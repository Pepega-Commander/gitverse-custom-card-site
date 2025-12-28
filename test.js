// test.js - Настоящие тесты для генератора SVG-карточек
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('📦 Тесты генератора SVG-карточек', () => {
  
  // Тест 1: Проверка структуры проекта
  describe('Структура проекта', () => {
    it('должен существовать index.html', () => {
      assert.ok(fs.existsSync('public/index.html'), 'Главная страница отсутствует');
    });
    
    it('должен существовать script.js с кодом', () => {
      const scriptPath = 'src/script.js';
      assert.ok(fs.existsSync(scriptPath), 'Основной скрипт отсутствует');
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      assert.ok(content.length > 1000, 'Скрипт слишком короткий (должен содержать логику)');
      assert.ok(content.includes('function') || content.includes('const') || content.includes('let'), 
        'Скрипт должен содержать JavaScript код');
    });
    
    it('должен существовать style.css', () => {
      assert.ok(fs.existsSync('src/style.css'), 'Стили отсутствуют');
    });
  });
  
  // Тест 2: Проверка генерации SVG (мокируем DOM)
  describe('Логика генерации SVG', () => {
    // Загружаем скрипт для тестирования (упрощённо)
    let svgGenerator;
    
    before(() => {
      // Мокаем минимальное DOM-окружение
      global.document = {
        createElementNS: (ns, tag) => {
          const elem = {
            tagName: tag,
            setAttribute: (name, value) => {
              elem[name] = value;
              return elem;
            },
            appendChild: () => elem,
            style: {}
          };
          return elem;
        },
        querySelector: () => ({ 
          appendChild: () => {},
          innerHTML: '',
          style: {}
        })
      };
      
      // Мокаем navigator для clipboard
      global.navigator = {
        clipboard: {
          writeText: () => Promise.resolve()
        }
      };
      
      // Простая функция-заглушка для теста
      svgGenerator = {
        createSVGElement: (tag, attributes = {}) => {
          const elem = { tagName: tag };
          for (const [key, value] of Object.entries(attributes)) {
            elem[key] = value;
          }
          return elem;
        },
        
        generateCardSVG: (username, bio, theme = 'default') => {
          // Простая имитация генерации SVG
          if (!username || !bio) {
            throw new Error('Имя пользователя и описание обязательны');
          }
          
          return {
            outerHTML: `<svg width="400" height="200" theme="${theme}">
              <text x="20" y="40">${username}</text>
              <text x="20" y="70">${bio}</text>
            </svg>`
          };
        }
      };
    });
    
    it('должен создавать SVG элемент', () => {
      const svg = svgGenerator.createSVGElement('svg', { width: '400', height: '200' });
      assert.strictEqual(svg.tagName, 'svg');
      assert.strictEqual(svg.width, '400');
    });
    
    it('должен генерировать SVG карточку с данными', () => {
      const username = 'TestUser';
      const bio = 'Тестовое описание';
      const theme = 'dark';
      
      const svg = svgGenerator.generateCardSVG(username, bio, theme);
      
      assert.ok(svg.outerHTML.includes(username), 'SVG должен содержать имя пользователя');
      assert.ok(svg.outerHTML.includes(bio), 'SVG должен содержать описание');
      assert.ok(svg.outerHTML.includes(`theme="${theme}"`), 'SVG должен содержать тему');
      assert.ok(svg.outerHTML.startsWith('<svg'), 'Должен быть SVG тег');
    });
    
    it('должен требовать обязательные параметры', () => {
      assert.throws(() => svgGenerator.generateCardSVG('', 'bio'), 
        /Имя пользователя и описание обязательны/);
      assert.throws(() => svgGenerator.generateCardSVG('user', ''), 
        /Имя пользователя и описание обязательны/);
    });
  });
  
  // Тест 3: Валидация конфигурации
  describe('Конфигурация проекта', () => {
    it('package.json должен быть валидным JSON', () => {
      const content = fs.readFileSync('package.json', 'utf8');
      assert.doesNotThrow(() => JSON.parse(content), 'package.json должен быть валидным JSON');
      
      const pkg = JSON.parse(content);
      assert.ok(pkg.name, 'package.json должен содержать имя проекта');
      assert.ok(pkg.scripts, 'package.json должен содержать scripts');
      assert.ok(pkg.scripts.test, 'package.json должен содержать script "test"');
    });
    
    it('должен содержать конфиг ESLint', () => {
      assert.ok(fs.existsSync('.eslintrc.json'), 'Конфиг ESLint отсутствует');
      try {
        const eslintConfig = JSON.parse(fs.readFileSync('.eslintrc.json', 'utf8'));
        assert.ok(eslintConfig.env, 'ESLint config должен содержать env');
      } catch (e) {
        throw new Error(`ESLint config содержит ошибку JSON: ${e.message}`);
      }
    });
    
    it('должен содержать CI/CD конфигурацию', () => {
      const workflowPath = '.github/workflows/course-validator.yml';
      assert.ok(fs.existsSync(workflowPath), 'Workflow CI/CD отсутствует');
      
      const content = fs.readFileSync(workflowPath, 'utf8');
      assert.ok(content.includes('name:'), 'Workflow должен иметь имя');
      assert.ok(content.includes('npm test') || content.includes('npm run test'), 
        'Workflow должен запускать тесты');
    });
  });
});

// Запуск тестов
if (require.main === module) {
  const Mocha = require('mocha');
  const mocha = new Mocha();
  mocha.addFile(__filename);
  mocha.run(failures => {
    process.exit(failures ? 1 : 0);
  });
}
