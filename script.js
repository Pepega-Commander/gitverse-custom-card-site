document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const generatedCode = document.getElementById('generatedCode');
    const instructionModal = document.getElementById('instructionModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const dontShowAgainCheckbox = document.getElementById('dontShowAgain');
    const themeSelector = document.getElementById('themeSelector');
    
    // Переменные
    let currentSiteTheme = 'dark';
    let currentSVGTheme = 'dark';
    let currentSVGCode = '';
    let hasShownInstruction = false;

    let audioPlayer = null;
    let musicVolume = 0.3; // По умолчанию 30% громкости
    let isMusicMuted = false;
    let currentTrackIndex = 0;

    let snowInterval = null;
    let snowflakes = [];
    let isSnowActive = false;
    
    // Ссылка на новогоднюю музыку
    const musicTracks = [
        {
            name: "Christmas 1",
            fullName: "All I Want For Christmas Is You",
            url: 'christmas1.mp3' // или .ogg
        },
        {
            name: "Christmas 2",
            fullName: "Last Christmas", 
            url: 'christmas2.mp3' // или .ogg
        },
        {
            name: "Christmas 3",
            fullName: "Jingle Bells Rock", 
            url: 'christmas3.mp3' // или .ogg
        }
    ];

    // ===== ТЕМЫ САЙТА =====
    const siteThemes = [
        { id: 'dark', name: 'Тёмная', emoji: '🌙' },
        { id: 'light', name: 'Светлая', emoji: '☀️' },
        { id: 'halloween', name: 'Halloween', emoji: '🎃' },
        { id: 'ocean', name: 'Ocean', emoji: '🌊' },
        { id: 'midnight', name: 'Полночь', emoji: '🌌' },
        { id: 'forest', name: 'Лес', emoji: '🌲' },
        { id: 'sunset', name: 'Закат', emoji: '🌅' },
        { id: 'coffee', name: 'Кофе', emoji: '☕' },
        { id: 'cyberpunk', name: 'Киберпанк', emoji: '🤖' },
        { id: 'rose', name: 'Розовая', emoji: '🌹' },
        { id: 'arctic', name: 'Арктика', emoji: '❄️' },
        { id: 'desert', name: 'Пустыня', emoji: '🏜️' },
        { id: 'matrix', name: 'Матрица', emoji: '💚' },
        { id: 'lavender', name: 'Лаванда', emoji: '🪻' },
        { id: 'newyear', name: 'Новый Год', emoji: '🎄' },
    ];

    let animationSettings = {
        particles: {
            count: 'medium',
            speed: 'medium',
            size: 'medium'
        },
        snow: {
            count: 'medium',
            speed: 'medium',
            size: 'medium'
        },
        waves: {
            amplitude: 'medium',
            speed: 'medium',
            complexity: 'medium'
        }
    };

    const cardStyles = {
        waves: {
            name: 'Волны',
            emoji: '🌊',
            description: 'Классические анимированные волны',
            generate: generateWavesCard
        },
        snow: {
            name: 'Снег',
            emoji: '❄️',
            description: 'Падающий снег и морозный фон',
            generate: generateSnowCard
        },
        minimalism: {
            name: 'Минимализм',
            emoji: '⚪',
            description: 'Чистый и простой дизайн',
            generate: generateSimpleCard
        },
        retro: {
            name: 'Ретровейв',
            emoji: '📼',
            description: 'Стиль 80-х с неоном',
            generate: generateRetroCard
        },
        city: {
            name: 'Город',
            emoji: '🏙️',
            description: 'Городской стиль с зданиями',
            generate: generateCityCard
        },
        moderncity: {
            name: 'Модерн-Сити',
            emoji: '🏙️',
            description: 'Современные небоскрёбы с неоном',
            generate: generateModernCityCard
        },
        particles: {
            name: 'Частицы',
            emoji: '✨',
            description: 'Плавающие анимированные частицы',
            generate: generateParticlesCard
        },
        gradient: {
            name: 'Градиент',
            emoji: '🌈',
            description: 'Плавный анимированный градиент',
            generate: generateGradientCard
        },
        newyear: {
            name: 'Новый Год',
            emoji: '🎄',
            description: 'Новогодняя елка с огнями',
            generate: generateNewYearCard
        }
    };

    let currentCardStyle = 'waves';

    // 1. ВОЛНЫ (базовая)
    function generateWavesCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = 'Сгенерировано в GitVerse') {
        const amplitude = config.amplitude || 'medium';
        const speed = config.speed || 'medium';
        
        const amplitudes = { 
            low: 210,    // Высокая волна
            medium: 190, // Средняя волна  
            high: 160    // Низкая волна
        };
        
        const durations = { 
            low: '12s',   // Медленно
            medium: '8s', // Средне
            high: '4s'    // Быстро
        };
        
        const waveHeight = amplitudes[amplitude] || 190;
        const waveDuration = durations[speed] || '8s';
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.bg1}">
                    <animate attributeName="stop-color" values="${colors.bg1};${colors.accent};${colors.bg1}" dur="20s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stop-color="${colors.bg2}">
                    <animate attributeName="stop-color" values="${colors.bg2};${colors.bg1};${colors.bg2}" dur="20s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${colors.shadow}" flood-opacity="0.3"/>
            </filter>
            
            <!-- CLIP PATH -->
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <!-- ВСЁ содержимое внутри clipPath -->
        <g clip-path="url(#cardClip)">
            <rect width="100%" height="100%" fill="url(#bgGradient)" rx="15" ry="15" filter="url(#shadow)"/>
            
            <text x="30" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${colors.text}">${username}</text>
            <text x="30" y="95" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}" opacity="0.9">${bio}</text>
            
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <!-- Волна, движущаяся слева направо -->
            <path d="M-200,200 Q100,${waveHeight} 300,200 T800,200 L800,250 L-200,250 Z" fill="${colors.accent}" opacity="0.2">
                <animate attributeName="d" 
                        dur="${waveDuration}"
                        repeatCount="indefinite"
                        values="M-200,200 Q100,${waveHeight} 300,200 T800,200 L800,250 L-200,250 Z;
                                M-150,200 Q150,${waveHeight-15} 350,200 T850,200 L850,250 L-150,250 Z;
                                M-200,200 Q100,${waveHeight} 300,200 T800,200 L800,250 L-200,250 Z"
                        keyTimes="0;0.5;1"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                <animate attributeName="opacity" values="0.2;0.25;0.2" dur="3s" repeatCount="indefinite"/>
            </path>
            
            <!-- Вторая волна (сдвинутая по фазе) -->
            <path d="M-250,200 Q50,${waveHeight+10} 250,200 T750,200 L750,250 L-250,250 Z" fill="${colors.accent}" opacity="0.15">
                <animate attributeName="d" 
                        dur="${waveDuration}"
                        repeatCount="indefinite"
                        begin="-0.8s"
                        values="M-250,200 Q50,${waveHeight+10} 250,200 T750,200 L750,250 L-250,250 Z;
                                M-200,200 Q100,${waveHeight-5} 300,200 T800,200 L800,250 L-200,250 Z;
                                M-250,200 Q50,${waveHeight+10} 250,200 T750,200 L750,250 L-250,250 Z"
                        keyTimes="0;0.5;1"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
            </path>
            
            <!-- Третья волна (мелкая) -->
            <path d="M-300,200 Q0,${waveHeight+20} 200,200 T700,200 L700,250 L-300,250 Z" fill="${colors.accent}" opacity="0.1">
                <animate attributeName="d" 
                        dur="${waveDuration}"
                        repeatCount="indefinite"
                        begin="-1.5s"
                        values="M-300,200 Q0,${waveHeight+20} 200,200 T700,200 L700,250 L-300,250 Z;
                                M-250,200 Q50,${waveHeight+5} 250,200 T750,200 L750,250 L-250,250 Z;
                                M-300,200 Q0,${waveHeight+20} 200,200 T700,200 L700,250 L-300,250 Z"
                        keyTimes="0;0.5;1"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
            </path>
        </g>
        
        <!-- Подпись ВНЕ clipPath -->
        <text x="250" y="235" text-anchor="middle" font-family="Arial" font-size="12" fill="${colors.text}" opacity="0.7">
            ${subtitle}
        </text>
    </svg>`;
    }

    // 2. СНЕГ
    function generateSnowCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = 'Сгенерировано в GitVerse') {
        const count = config.count || 'medium';
        const speed = config.speed || 'medium';
        
        const snowCounts = { low: 12, medium: 25, high: 40 };
        const durations = { low: 8, medium: 6, high: 4 };
        
        const snowflakeCount = snowCounts[count] || 25;
        const baseDuration = durations[speed] || 6;
        
        let snowflakesHTML = '';
        for (let i = 0; i < snowflakeCount; i++) {
            const x = Math.random() * 500;
            const startY = -10 - Math.random() * 40;
            const endY = 240 + Math.random() * 20;
            const duration = baseDuration + Math.random() * 3 - 1.5;
            const delay = Math.random() * 5;
            const size = 1 + Math.random() * 1.5;
            const sway = Math.random() * 40 - 20;
            const opacity = 0.3 + Math.random() * 0.5;
            const drift = Math.random() * 30 - 15;
            
            snowflakesHTML += `
                <circle cx="${x}" cy="${startY}" r="${size}" fill="white" opacity="${opacity}">
                    <animate attributeName="cy" 
                            values="${startY};${endY}" 
                            dur="${duration}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"/>
                    
                    <animate attributeName="cx" 
                            values="${x};${x + sway};${x + drift}" 
                            dur="${duration * 1.5}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"
                            keyTimes="0;0.5;1"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"/>
                    
                    <animate attributeName="opacity" 
                            values="0;${opacity};${opacity * 0.5};0" 
                            dur="${duration}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"
                            keyTimes="0;0.1;0.9;1"/>
                </circle>
            `;
        }
        
        // Определяем темы где нужен контраст
        const isLightTheme = currentSVGTheme === 'light';
        const isSnowTheme = currentSVGTheme === 'snow' || currentSVGTheme === 'arctic' || currentSVGTheme === 'newyear';
        
        // Цвета для кругов (используем явные цвета для лучшего контраста)
        const circle1Color = colors.accent || '#64d8ff';
        const circle2Color = isLightTheme ? '#3498db' : (colors.text || '#f0f6fc');
        
        // Третий круг - ЯВНЫЙ КОНТРАСТНЫЙ ЦВЕТ
        let circle3Color;
        let circle3TextColor;
        
        if (isSnowTheme) {
            // Для снежных тем - КРАСНЫЙ (максимальный контраст с белым/синим)
            circle3Color = '#e74c3c'; // Ярко-красный
            circle3TextColor = 'white';
        } else if (isLightTheme) {
            // Для светлой темы - ТЕМНО-СИНИЙ
            circle3Color = '#2c3e50';
            circle3TextColor = 'white';
        } else {
            // Для темных тем - ЯРКИЙ ЦВЕТ
            circle3Color = '#f39c12'; // Ярко-оранжевый
            circle3TextColor = 'white';
        }
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;">
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.bg1 || '#0c2d48'}"/>
                <stop offset="100%" stop-color="${colors.bg2 || '#1e4d70'}"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${circle1Color}" flood-opacity="0.3"/>
            </filter>
            <radialGradient id="lightGradient" cx="50%" cy="0%" r="80%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.1)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </radialGradient>
            
            <!-- CLIP PATH -->
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <!-- ВСЁ содержимое внутри clipPath -->
        <g clip-path="url(#cardClip)">
            <rect width="500" height="250" fill="url(#bgGradient)" rx="15" ry="15" filter="url(#shadow)"/>
            
            <!-- Свет сверху -->
            <rect width="500" height="100" fill="url(#lightGradient)" opacity="0.3"/>
            
            <!-- Снежинки -->
            ${snowflakesHTML}
            
            <!-- Сугроб -->
            <path d="M0,200 Q125,190 250,200 T500,200 L500,250 L0,250 Z" fill="rgba(255,255,255,0.2)"/>
            
            <!-- Текст -->
            <text x="30" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
                fill="${colors.text || '#ffffff'}" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${username}</text>
            <text x="30" y="95" font-family="Arial, sans-serif" font-size="16" 
                fill="${colors.text || '#ffffff'}" opacity="0.9" style="text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${bio}</text>
            
            <!-- Эмодзи в кругах -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${circle1Color}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="16" fill="white" 
                            style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="${circle2Color}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="16" 
                            fill="${isLightTheme ? 'white' : colors.bg1 || '#0d1117'}" 
                            style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="${circle3Color}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="16" 
                            fill="${circle3TextColor}" 
                            style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
        </g>
        
        <!-- Подпись ВНЕ clipPath -->
        <text x="250" y="235" text-anchor="middle" font-family="Arial" font-size="12" fill="${colors.text || '#ffffff'}" opacity="0.7">
            ${subtitle}
        </text>
    </svg>`;
    }


    function generateRetroCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '⚡ РЕТРОВЕЙВ 80-х') {
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#000000"/>
                <stop offset="100%" stop-color="#1a0033"/>
            </linearGradient>
            
            <!-- Ретро градиенты -->
            <linearGradient id="neonPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff00ff"/>
                <stop offset="100%" stop-color="#ff66ff"/>
            </linearGradient>
            
            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00ffff"/>
                <stop offset="100%" stop-color="#66ffff"/>
            </linearGradient>
            
            <filter id="retroGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                <feFlood flood-color="#ff00ff" flood-opacity="0.7" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <g clip-path="url(#cardClip)">
            <!-- Фон с сеткой -->
            <rect width="500" height="250" fill="url(#bgGradient)" rx="12" ry="12"/>
            
            <!-- Ретро сетка -->
            ${Array.from({length: 6}).map((_, i) => 
                `<line x1="20" y1="${50 + i * 40}" x2="480" y2="${50 + i * 40}" stroke="#00ffff" stroke-width="1" stroke-dasharray="3,3" opacity="0.15"/>`
            ).join('')}
            
            ${Array.from({length: 8}).map((_, i) => 
                `<line x1="${40 + i * 60}" y1="20" x2="${40 + i * 60}" y2="230" stroke="#ff00ff" stroke-width="1" stroke-dasharray="3,3" opacity="0.15"/>`
            ).join('')}
            
            <!-- Текст в ретро стиле -->
            <text x="30" y="60" font-family="'Courier New', monospace" font-size="28" font-weight="bold" 
                fill="none" stroke="url(#neonPink)" stroke-width="2" filter="url(#retroGlow)">${username}</text>
            <text x="30" y="95" font-family="'Courier New', monospace" font-size="16" 
                fill="#00ffff" opacity="0.9" filter="url(#retroGlow)">${bio}</text>
            
            <!-- Ромбы с неоновой обводкой -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <!-- Розовый ромб -->
                    <g>
                        <rect x="13" y="13" width="24" height="24" 
                            fill="none" stroke="url(#neonPink)" stroke-width="3" stroke-opacity="0.9"
                            transform="rotate(45 25 25)" filter="url(#retroGlow)">
                            <animateTransform attributeName="transform" type="rotate" values="45 25 25; 405 25 25" 
                                            dur="6s" repeatCount="indefinite"/>
                        </rect>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white" filter="url(#retroGlow)">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <!-- Голубой ромб -->
                    <g transform="translate(70, 0)">
                        <rect x="13" y="13" width="24" height="24" 
                            fill="none" stroke="url(#neonCyan)" stroke-width="3" stroke-opacity="0.9"
                            transform="rotate(45 25 25)" filter="url(#retroGlow)">
                            <animateTransform attributeName="transform" type="rotate" values="45 25 25; -315 25 25" 
                                            dur="6s" repeatCount="indefinite" begin="2s"/>
                        </rect>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="black" filter="url(#retroGlow)">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <!-- Желтый ромб -->
                    <g transform="translate(140, 0)">
                        <rect x="13" y="13" width="24" height="24" 
                            fill="none" stroke="#ffff00" stroke-width="3" stroke-opacity="0.9"
                            transform="rotate(45 25 25)" filter="url(#retroGlow)">
                            <animateTransform attributeName="transform" type="rotate" values="405 25 25; 45 25 25" 
                                            dur="6s" repeatCount="indefinite" begin="4s"/>
                        </rect>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="black" filter="url(#retroGlow)">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <!-- Ретро полосы по бокам -->
            <rect x="10" y="10" width="5" height="230" fill="url(#neonPink)" opacity="0.7" filter="url(#retroGlow)"/>
            <rect x="485" y="10" width="5" height="230" fill="url(#neonCyan)" opacity="0.7" filter="url(#retroGlow)"/>
            
            <!-- Мигающие неоновые точки -->
            <circle cx="100" cy="180" r="3" fill="#ff00ff" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="250" cy="200" r="3" fill="#00ffff" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
            </circle>
            <circle cx="400" cy="190" r="3" fill="#ffff00" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1s"/>
            </circle>
        </g>
        
        <!-- Подпись (поднимаем выше) -->
        <text x="250" y="240" text-anchor="middle" font-family="'Courier New', monospace" font-size="11" 
            fill="#00ffff" opacity="0.8" filter="url(#retroGlow)">
            ${subtitle}
        </text>
    </svg>`;
    }


    // 3. МИНИМАЛИЗМ
    function generateSimpleCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '⚫ Геометрический минимализм') {
        const isNewYear = currentSVGTheme === 'newyear';
        const isLightTheme = currentSVGTheme === 'light';
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
            </style>
            
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${isNewYear ? '#0a1e28' : colors.bg1}"/>
                <stop offset="100%" stop-color="${isNewYear ? '#05222a' : colors.bg2}"/>
            </linearGradient>
            
            <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${colors.shadow}" flood-opacity="0.2"/>
            </filter>
            
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
            
            ${isNewYear ? `
                <linearGradient id="holidayAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ff0000"/>
                    <stop offset="50%" stop-color="#00ff00"/>
                    <stop offset="100%" stop-color="#ff0000"/>
                </linearGradient>
            ` : ''}
        </defs>
        
        <g clip-path="url(#cardClip)">
            <rect width="500" height="250" fill="url(#bgGradient)" rx="12" ry="12" filter="url(#shadow)"/>
            
            <text x="30" y="65" font-family="'Inter', sans-serif" font-size="30" font-weight="300" 
                fill="${colors.text}" style="letter-spacing: 0.5px;">
                ${username}
            </text>
            
            <text x="30" y="100" font-family="'Inter', sans-serif" font-size="17" font-weight="300"
                fill="${colors.text}" opacity="0.8">
                ${bio}
            </text>
            
            <line x1="30" y1="115" x2="470" y2="115" 
                stroke="${isNewYear ? 'url(#holidayAccent)' : colors.accent}" 
                stroke-width="0.8" opacity="0.3">
                ${isNewYear ? `<animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>` : ''}
            </line>
            
            <line x1="15" y1="15" x2="15" y2="235" stroke="${colors.accent}" stroke-width="0.8" opacity="0.2"/>
            <line x1="485" y1="15" x2="485" y2="235" stroke="${colors.accent}" stroke-width="0.8" opacity="0.2"/>
            <line x1="15" y1="15" x2="485" y2="15" stroke="${colors.accent}" stroke-width="0.8" opacity="0.2"/>
            <line x1="15" y1="235" x2="485" y2="235" stroke="${colors.accent}" stroke-width="0.8" opacity="0.2"/>
            
            ${isNewYear ? `
                <circle cx="400" cy="40" r="1.5" fill="white" opacity="0.6">
                    <animate attributeName="cy" values="40;45;40" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="450" cy="60" r="1" fill="white" opacity="0.4">
                    <animate attributeName="cy" values="60;65;60" dur="4s" repeatCount="indefinite" begin="1s"/>
                </circle>
                <circle cx="480" cy="30" r="2" fill="white" opacity="0.5">
                    <animate attributeName="cy" values="30;35;30" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
                
                <circle cx="100" cy="180" r="2" fill="#ff0000" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="250" cy="200" r="2" fill="#00ff00" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" begin="0.3s"/>
                </circle>
                <circle cx="400" cy="190" r="2" fill="#ffff00" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="0.6s"/>
                </circle>
            ` : `
                <circle cx="400" cy="80" r="1.2" fill="${colors.accent}" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="450" cy="110" r="1" fill="${colors.accent}" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" begin="1s"/>
                </circle>
            `}
            
            <!-- Круги -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" 
                                fill="${isNewYear ? '#ff6b6b' : colors.accent}" 
                                opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="#ff6b6b;#ff0000;#ff6b6b" dur="3s" repeatCount="indefinite"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" 
                                fill="${isNewYear ? '#4CAF50' : colors.text}" 
                                opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="#4CAF50;#00ff00;#4CAF50" dur="3s" repeatCount="indefinite" begin="1s"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="${colors.bg1}">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" 
                                fill="${isLightTheme ? colors.bg2 : (isNewYear ? '#2196F3' : colors.bg1)}" 
                                opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="#2196F3;#00ffff;#2196F3" dur="3s" repeatCount="indefinite" begin="2s"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" 
                            fill="${isLightTheme ? colors.text : 'white'}">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <circle cx="20" cy="20" r="1.5" fill="${colors.accent}" opacity="0.5"/>
            <circle cx="480" cy="20" r="1.5" fill="${colors.accent}" opacity="0.5"/>
            <circle cx="20" cy="230" r="1.5" fill="${colors.accent}" opacity="0.5"/>
            <circle cx="480" cy="230" r="1.5" fill="${colors.accent}" opacity="0.5"/>
        </g>
        
        <text x="250" y="245" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" font-weight="300"
            fill="${colors.text}" opacity="0.6" style="letter-spacing: 0.5px;">
            ${isNewYear ? '🎄 ' : ''}${subtitle}${isNewYear ? ' 🎄' : ''}
        </text>
    </svg>`;
    }

    // ГОРОД
    function generateCityCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '🏘️ Русский город • Панельки') {
        const isWinter = currentSVGTheme === 'newyear' || currentSVGTheme === 'snow' || currentSVGTheme === 'arctic';
        const isHalloween = currentSVGTheme === 'halloween';
        const isForest = currentSVGTheme === 'forest';
        const isDesert = currentSVGTheme === 'desert';
        const isOcean = currentSVGTheme === 'ocean';
        const isGalaxy = currentSVGTheme === 'galaxy';
        const isNewYear = currentSVGTheme === 'newyear';
        const isMatrix = currentSVGTheme === 'matrix';
        const isCyberpunk = currentSVGTheme === 'cyberpunk';
        const isGitHub = currentSVGTheme === 'github';
        const isMidnight = currentSVGTheme === 'midnight';

        function getCloudsHTML() {
            if (isDesert || isGalaxy || isNewYear || isMatrix || isCyberpunk) {
                return '';
            }
            
            else if (isMidnight) {
                // ПАСМУРНАЯ ПОГОДА С МНОЖЕСТВОМ ОБЛАКОВ
                return `
                    <!-- Пасмурное небо с облаками неправильной формы -->
                    <g opacity="0.95">
                        <!-- Большое облако слева -->
                        <path d="M-100,40 
                                C50,30 150,25 250,35 
                                C350,40 300,50 200,55 
                                C100,60 0,55 -50,50 
                                C-80,45 -120,50 -100,40Z" 
                            fill="#2a3650" stroke="#1c2538" stroke-width="1" opacity="0.8">
                            <animate attributeName="d" 
                                    dur="80s"
                                    repeatCount="indefinite"
                                    values="M-100,40 C50,30 150,25 250,35 C350,40 300,50 200,55 C100,60 0,55 -50,50 C-80,45 -120,50 -100,40Z;
                                            M-90,38 C60,32 160,27 260,37 C360,42 310,52 210,57 C110,62 10,57 -40,52 C-70,47 -110,52 -90,38Z;
                                            M-100,40 C50,30 150,25 250,35 C350,40 300,50 200,55 C100,60 0,55 -50,50 C-80,45 -120,50 -100,40Z"/>
                        </path>
                        
                        <!-- Основное облако по центру -->
                        <path d="M100,55 
                                C250,45 400,40 500,50 
                                C600,60 550,70 450,75 
                                C350,80 200,75 150,70 
                                C100,65 50,65 100,55Z" 
                            fill="#3a4a6b" stroke="#2d3a54" stroke-width="1.2" opacity="0.9">
                            <animate attributeName="d" 
                                    dur="70s"
                                    repeatCount="indefinite"
                                    values="M100,55 C250,45 400,40 500,50 C600,60 550,70 450,75 C350,80 200,75 150,70 C100,65 50,65 100,55Z;
                                            M110,53 C260,47 410,42 510,52 C610,62 560,72 460,77 C360,82 210,77 160,72 C110,67 60,67 110,53Z;
                                            M100,55 C250,45 400,40 500,50 C600,60 550,70 450,75 C350,80 200,75 150,70 C100,65 50,65 100,55Z"
                                    begin="-15s"/>
                        </path>
                        
                        <!-- Большое облако справа -->
                        <path d="M300,60 
                                C450,50 600,45 700,55 
                                C800,65 750,75 650,80 
                                C550,85 400,80 350,75 
                                C300,70 250,70 300,60Z" 
                            fill="#4a5a7b" stroke="#3a4a6b" stroke-width="1.5" opacity="0.95">
                            <animate attributeName="d" 
                                    dur="60s"
                                    repeatCount="indefinite"
                                    values="M300,60 C450,50 600,45 700,55 C800,65 750,75 650,80 C550,85 400,80 350,75 C300,70 250,70 300,60Z;
                                            M310,58 C460,52 610,47 710,57 C810,67 760,77 660,82 C560,87 410,82 360,77 C310,72 260,72 310,58Z;
                                            M300,60 C450,50 600,45 700,55 C800,65 750,75 650,80 C550,85 400,80 350,75 C300,70 250,70 300,60Z"
                                    begin="-30s"/>
                            
                            <!-- Тень для объема -->
                            <animate attributeName="fill" 
                                    values="#4a5a7b;#526283;#4a5a7b" 
                                    dur="40s" 
                                    repeatCount="indefinite"/>
                        </path>
                        
                        <!-- Дополнительное облако сверху -->
                        <path d="M50,35 
                                C200,25 350,20 450,30 
                                C550,40 500,45 400,50 
                                C300,55 150,50 100,45 
                                C50,40 0,45 50,35Z" 
                            fill="#2d3a54" stroke="#1c2538" stroke-width="0.8" opacity="0.7">
                            <animate attributeName="d" 
                                    dur="90s"
                                    repeatCount="indefinite"
                                    values="M50,35 C200,25 350,20 450,30 C550,40 500,45 400,50 C300,55 150,50 100,45 C50,40 0,45 50,35Z;
                                            M60,33 C210,27 360,22 460,32 C560,42 510,47 410,52 C310,57 160,52 110,47 C60,42 10,47 60,33Z;
                                            M50,35 C200,25 350,20 450,30 C550,40 500,45 400,50 C300,55 150,50 100,45 C50,40 0,45 50,35Z"
                                    begin="-45s"/>
                        </path>
                    </g>
                    
                    <!-- Луна, пытающаяся пробиться сквозь облака -->
                    <g opacity="0.7">
                        <!-- Рассеянный свет луны -->
                        <circle cx="450" cy="50" r="35" fill="url(#moonGlowGradient)" opacity="0.25">
                            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="25s" repeatCount="indefinite"/>
                            <animate attributeName="r" values="35;38;35" dur="30s" repeatCount="indefinite"/>
                        </circle>
                        
                        <!-- Диск луны -->
                        <circle cx="450" cy="50" r="15" fill="#f5f7ff" opacity="0.5">
                            <animate attributeName="opacity" values="0.5;0.7;0.5" dur="20s" repeatCount="indefinite"/>
                            <animate attributeName="cx" values="450;455;450" dur="40s" repeatCount="indefinite"/>
                        </circle>
                        
                        <!-- Пятна на луне -->
                        <circle cx="445" cy="48" r="3" fill="#e6e8ff" opacity="0.3"/>
                        <circle cx="455" cy="53" r="2" fill="#e6e8ff" opacity="0.4"/>
                    </g>
                    
                    <!-- Легкая дымка/туман -->
                    <rect x="0" y="90" width="500" height="50" fill="url(#fogGradient)" opacity="0.15">
                        <animate attributeName="opacity" values="0.15;0.2;0.15" dur="18s" repeatCount="indefinite"/>
                        <animateTransform 
                            attributeName="transform"
                            type="translate"
                            values="0,0; 5,0; 0,0"
                            dur="30s"
                            repeatCount="indefinite"/>
                    </rect>
                    
                    <!-- Отдельные клочья облаков (не овалы!) -->
                    <g opacity="0.8">
                        <!-- Клочок облака 1 -->
                        <path d="M80,70 Q120,65 160,70 Q140,75 100,75 Q60,75 80,70Z" 
                            fill="#5a6a8b" opacity="0.9"/>
                        
                        <!-- Клочок облака 2 -->
                        <path d="M350,65 Q380,60 410,65 Q400,70 370,70 Q340,70 350,65Z" 
                            fill="#4a5a7b" opacity="0.8"/>
                        
                        <!-- Клочок облака 3 -->
                        <path d="M220,80 Q260,75 300,80 Q280,85 240,85 Q200,85 220,80Z" 
                            fill="#3a4a6b" opacity="0.7"/>
                    </g>
                `;
            } else if (isOcean) {
                // Океанские волнообразные облака (оставляем как есть)
                return `
                    <!-- Волнообразные облака -->
                    <path d="M50,60 Q100,50 150,60 T250,60 Q300,55 350,60 T450,60" 
                        fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                    <path d="M30,80 Q80,70 130,80 T230,80 Q280,75 330,80 T430,80" 
                        fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
                    
                    <!-- Солнце/блики на воде -->
                    <circle cx="450" cy="50" r="15" fill="#ffd700" opacity="0.7">
                        <animate attributeName="r" values="15;16;15" dur="3s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.7;0.8;0.7" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Морские чайки -->
                    <path d="M400,40 Q410,35 420,40 Q430,45 440,40" stroke="white" stroke-width="1.5" fill="none" opacity="0.6"/>
                    <path d="M370,55 Q380,50 390,55 Q400,60 410,55" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/>
                `;
            } else if (isHalloween) {
                return `
                    <path d="M50,50 Q150,40 250,50 Q350,45 450,50" 
                        fill="rgba(45, 27, 61, 0.2)" stroke="rgba(35, 20, 50, 0.3)" stroke-width="0.8"/>
                `;
            } else if (isWinter || isNewYear) {
                return `
                    <path d="M50,50 Q150,45 250,50 Q350,48 450,50" 
                        fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
                `;
            } else {
                return `
                    <path d="M50,50 Q150,45 250,50 Q350,48 450,50" 
                        fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
                `;
            }
        }

        function lightenColor(color) {
            // Функция для осветления цвета свечения окон
            const colorMap = {
                '#58a6ff': '#8bc1ff',  // GitHub синий → светлее
                '#6d8eff': '#9db4ff',  // Midnight синий → светлее
                '#ff6b6b': '#ff9d9d',  // New Year красный → светлее
                '#ffcc66': '#ffe499',  // Winter желтый → светлее
                '#ff7518': '#ffa366',  // Halloween оранжевый → светлее
                '#ffd700': '#ffed4e',  // Ocean золотой → светлее
            };
            return colorMap[color] || '#ffffff';
        }


        
        // Цвета в зависимости от темы
        let treeColor, grassColor, skyColor1, skyColor2, groundColor, sidewalkColor, treeType;
        let buildingColor, panelColor, windowColor;
        
        if (isGitHub) {
            treeColor = '#2b2b2b';
            grassColor = '#3c3c3c';
            skyColor1 = '#0d1117'; 
            skyColor2 = '#161b22';
            groundColor = '#21262d';
            sidewalkColor = '#30363d';
            treeType = 'default';
            buildingColor = '#21262d';
            panelColor = '#484f58';
            windowColor = '#58a6ff';
        } else if (isHalloween) {
            treeColor = '#8B4513';
            grassColor = '#2F4F4F';
            skyColor1 = '#2d1b3d';
            skyColor2 = '#45295f';
            groundColor = '#3a2615';
            sidewalkColor = '#5a3d1a';
            treeType = 'halloween';
            buildingColor = '#5a3d3d';
            panelColor = '#8b7355';
            windowColor = '#ff7518';
        } else if (isMidnight) { // ← ДОБАВЬ ЭТО!
            treeColor = '#2C3E50';          // Темно-синие деревья
            grassColor = '#34495E';         // Сине-серый газон
            skyColor1 = '#0a0e17';          // Полночный темно-синий
            skyColor2 = '#151a2d';          // Немного светлее
            groundColor = '#1a1a2e';        // Очень темный синий
            sidewalkColor = '#2C3E50';      // Темно-синий тротуар
            treeType = 'default';
            buildingColor = '#1a1a2e';      // Полночные здания
            panelColor = '#8b7355';
            windowColor = '#6d8eff';        // Светло-синие окна
        } else if (isWinter || isNewYear) {
            treeColor = '#FFFFFF';
            grassColor = '#F0F8FF';
            skyColor1 = isNewYear ? '#0a1e28' : '#87CEEB';
            skyColor2 = isNewYear ? '#05222a' : '#4682B4';
            groundColor = '#2C3E50';
            sidewalkColor = '#708090';
            treeType = 'winter';
            buildingColor = '#5a6b8a';
            panelColor = '#8b7355';
            windowColor = isNewYear ? '#ff6b6b' : '#ffcc66';
        } else if (isForest) {
            treeColor = '#228B22';
            grassColor = '#2E8B57';
            skyColor1 = '#87CEEB';
            skyColor2 = '#4682B4';
            groundColor = '#3d5c2e';
            sidewalkColor = '#556B2F';
            treeType = 'forest';
            buildingColor = '#5a6b8a';
            panelColor = '#8b7355';
            windowColor = '#38a169';
        } else if (isDesert) {
            treeColor = '#D2691E';
            grassColor = '#F4A460';
            skyColor1 = '#FFD700';
            skyColor2 = '#FF8C00';
            groundColor = '#DEB887';
            sidewalkColor = '#D2B48C';
            treeType = 'desert';
            buildingColor = '#a0522d';
            panelColor = '#8b7355';
            windowColor = '#ffcc66';
        } else if (isOcean) {
            // ОСОБЫЕ ЦВЕТА ДЛЯ ОКЕАНСКОЙ ТЕМЫ
            treeColor = '#2E8B57';
            grassColor = '#20B2AA';
            skyColor1 = '#87CEEB';
            skyColor2 = '#4682B4';
            groundColor = '#4a6b8a'; // Морской песок с синевой
            sidewalkColor = '#5a7ba5'; // Светлый морской цвет
            treeType = 'ocean';
            buildingColor = '#3a5a8c'; // Темно-синий для зданий
            panelColor = '#4a6fa5'; // Более светлый синий для панелей
            windowColor = '#ffd700'; // Золотые окна
        } else if (isGalaxy) {
            treeColor = '#2C3E50';
            grassColor = '#34495E';
            skyColor1 = '#0c0e2e';
            skyColor2 = '#1a1a2e';
            groundColor = '#1a1a2e';
            sidewalkColor = '#2C3E50';
            treeType = 'default';
            buildingColor = '#2c3e50';
            panelColor = '#8b7355';
            windowColor = '#9d65ff';
        } else if (isMatrix) {
            treeColor = '#00ff00';
            grassColor = '#00cc00';
            skyColor1 = '#001100';
            skyColor2 = '#002200';
            groundColor = '#003300';
            sidewalkColor = '#004400';
            treeType = 'default';
            buildingColor = '#002200';
            panelColor = '#8b7355';
            windowColor = '#00ff00';
        } else if (isCyberpunk) {
            treeColor = '#00ff9d';
            grassColor = '#00cc7a';
            skyColor1 = '#0a0a0a';
            skyColor2 = '#1a1a2e';
            groundColor = '#1a1a2e';
            sidewalkColor = '#2a2a4e';
            treeType = 'default';
            buildingColor = '#1a1a2e';
            panelColor = '#8b7355';
            windowColor = '#ff00ff';
        } else {
            treeColor = '#228B22';
            grassColor = '#2E8B57';
            skyColor1 = '#87CEEB';
            skyColor2 = '#4682B4';
            groundColor = '#556B2F';
            sidewalkColor = '#8FBC8F';
            treeType = 'default';
            buildingColor = colors.bg2 || '#5a6b8a';
            panelColor = '#8b7355';
            windowColor = colors.accent || '#ffcc66';
        }
        
        let buildingsHTML = '';
        
        const khrushchevkaData = [
        {x: 40, y: 85, width: 100, height: 170},   // y уменьшен на 5, height увеличен на 10
        {x: 150, y: 95, width: 95, height: 160},   // y уменьшен на 5, height увеличен на 10
        {x: 255, y: 85, width: 98, height: 170},   // y уменьшен на 5, height увеличен на 10
        {x: 365, y: 95, width: 95, height: 160},   // y уменьшен на 5, height увеличен на 10
    ];

        
        // Функция для создания деревьев
        function generateTree(x, y, size, type) {
            const groundY = 210;
            
            if (isOcean) {
                // ОСОБЫЕ ДЕРЕВЬЯ ДЛЯ ОКЕАНСКОЙ ТЕМЫ (пальмы)
                return `
                    <!-- Морская пальма -->
                    <rect x="${x - 3}" y="${groundY}" width="6" height="30" fill="#8B4513"/>
                    
                    <!-- Крона пальмы -->
                    <circle cx="${x}" cy="${groundY - 10}" r="${size}" fill="${treeColor}" opacity="0.9">
                        <animate attributeName="r" values="${size};${size * 1.05};${size}" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Кокосы -->
                    <circle cx="${x - 5}" cy="${groundY - 5}" r="2.5" fill="#8B4513" opacity="0.8"/>
                    <circle cx="${x + 5}" cy="${groundY - 8}" r="2" fill="#8B4513" opacity="0.8"/>
                `;
            }
            
            switch(type) {
                case 'winter':
                    return `
                        <rect x="${x - 4}" y="${groundY}" width="8" height="30" fill="#8B4513"/>
                        <circle cx="${x}" cy="${groundY - 10}" r="${size}" fill="white" opacity="0.9"/>
                    `;
                        
                case 'halloween':
                    return `
                        <rect x="${x - 3}" y="${groundY}" width="6" height="25" fill="#8B4513"/>
                        <line x1="${x}" y1="${groundY - 5}" x2="${x - 15}" y2="${groundY - 25}" stroke="#8B4513" stroke-width="2"/>
                        <line x1="${x}" y1="${groundY - 5}" x2="${x + 15}" y2="${groundY - 25}" stroke="#8B4513" stroke-width="2"/>
                    `;
                        
                default:
                    return `
                        <rect x="${x - 4}" y="${groundY}" width="8" height="30" fill="#8B4513"/>
                        <circle cx="${x}" cy="${groundY - 10}" r="${size}" fill="${treeColor}" opacity="0.9"/>
                    `;
            }
        }
        
        // ЗВЕЗДЫ ДЛЯ НОЧНЫХ ТЕМ
        let galaxyStarsHTML = '';
        if (isGalaxy || isNewYear || isMatrix || isCyberpunk) {
            const starCount = isNewYear ? 50 : 40;
            for (let i = 0; i < starCount; i++) {
                const x = Math.random() * 500;
                const y = Math.random() * 150;
                const size = 0.3 + Math.random() * 1.2;
                const opacity = 0.1 + Math.random() * 0.6;
                const delay = Math.random() * 3;
                const duration = 2 + Math.random() * 3;
                const twinkle = Math.random() > 0.5;
                
                // Разные цвета звезд для разных тем
                let starColor = 'white';
                if (isMatrix) starColor = '#00ff00';
                if (isCyberpunk) starColor = i % 3 === 0 ? '#00ff9d' : i % 3 === 1 ? '#ff00ff' : '#1e90ff';
                
                if (twinkle) {
                    galaxyStarsHTML += `
                        <circle cx="${x}" cy="${y}" r="${size}" fill="${starColor}" opacity="${opacity}">
                            <animate attributeName="opacity" values="${opacity};${opacity * 2.5};${opacity}" 
                                    dur="${duration}s" repeatCount="indefinite" begin="${delay}s"/>
                        </circle>
                    `;
                } else {
                    galaxyStarsHTML += `
                        <circle cx="${x}" cy="${y}" r="${size}" fill="${starColor}" opacity="${opacity}"/>
                    `;
                }
            }
        }
        
        // ВОЛНЫ/ОБЛАКА ДЛЯ ОКЕАНСКОЙ ТЕМЫ
        let oceanWavesHTML = '';
        if (isOcean) {
            oceanWavesHTML = `
                <!-- Волнообразные облака -->
                <path d="M50,60 Q100,50 150,60 T250,60 Q300,55 350,60 T450,60" 
                    fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                <path d="M30,80 Q80,70 130,80 T230,80 Q280,75 330,80 T430,80" 
                    fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
                
                <!-- Солнце/блики на воде -->
                <circle cx="450" cy="50" r="15" fill="#ffd700" opacity="0.7">
                    <animate attributeName="r" values="15;16;15" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0.8;0.7" dur="4s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Морские чайки -->
                <path d="M400,40 Q410,35 420,40 Q430,45 440,40" stroke="white" stroke-width="1.5" fill="none" opacity="0.6"/>
                <path d="M370,55 Q380,50 390,55 Q400,60 410,55" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/>
            `;
        }
        
        // ОГОНЬКИ ДЛЯ НОВОГОДНЕЙ ТЕМЫ
        let newYearLightsHTML = '';
        if (isNewYear) {
            // Гирлянды между зданиями
            const garlandPositions = [
                {x1: 140, y1: 85, x2: 245, y2: 85},
                {x1: 355, y1: 95, x2: 460, y2: 95},
                {x1: 245, y1: 90, x2: 350, y2: 100}
            ];
            
            garlandPositions.forEach((pos, i) => {
                const colors = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff'];
                newYearLightsHTML += `
                    <line x1="${pos.x1}" y1="${pos.y1}" x2="${pos.x2}" y2="${pos.y2}" 
                        stroke="${colors[i % colors.length]}" stroke-width="2" stroke-dasharray="5,3" opacity="0.7">
                        <animate attributeName="stroke" values="${colors[i % colors.length]};${colors[(i+1) % colors.length]};${colors[i % colors.length]}" 
                                dur="3s" repeatCount="indefinite" begin="${i * 0.5}s"/>
                    </line>
                `;
            });
            
            // Огни на ребрах зданий
            khrushchevkaData.forEach((building, i) => {
                const color = i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#ffff00';
                const delay = i * 0.3;
                
                // Огни по периметру здания
                newYearLightsHTML += `
                    <!-- Огни на левой стороне здания ${i} -->
                    <circle cx="${building.x}" cy="${building.y + 40}" r="2" fill="${color}" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" begin="${delay}s"/>
                    </circle>
                    <circle cx="${building.x}" cy="${building.y + 100}" r="2" fill="${color}" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" begin="${delay + 0.2}s"/>
                    </circle>
                    
                    <!-- Огни на правой стороне здания ${i} -->
                    <circle cx="${building.x + building.width}" cy="${building.y + 60}" r="2" fill="${color}" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" begin="${delay + 0.1}s"/>
                    </circle>
                    <circle cx="${building.x + building.width}" cy="${building.y + 120}" r="2" fill="${color}" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" begin="${delay + 0.3}s"/>
                    </circle>
                `;
            });
        }
        
        // СНЕЖИНКИ ДЛЯ ЗИМНИХ ТЕМ
        let snowflakesHTML = '';
        if (isWinter || isNewYear) {
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * 500;
                const startY = -10;
                const endY = 250;
                const duration = 6 + Math.random() * 6;
                const delay = Math.random() * 3;
                const size = 0.3 + Math.random() * 1;
                
                snowflakesHTML += `
                    <circle cx="${x}" cy="${startY}" r="${size}" fill="white" opacity="${0.1 + Math.random() * 0.3}">
                        <animate attributeName="cy" values="${startY};${endY}" 
                                dur="${duration}s" repeatCount="indefinite" begin="${delay}s"/>
                    </circle>
                `;
            }
        }
        
        // СНЕГ НА ПОЛЕ ДЛЯ ЗИМНИХ ТЕМ
        let fieldSnowHTML = '';
        if (isWinter || isNewYear) {
            // Снежный покров на поле
            fieldSnowHTML = `
                <rect x="0" y="200" width="500" height="50" fill="rgba(255,255,255,0.1)" rx="0" ry="0"/>
                
                <!-- Куча снега в углах -->
                <path d="M0,200 Q100,195 200,200 T400,200 Q450,205 500,200 L500,210 L0,210 Z" 
                    fill="rgba(255,255,255,0.15)"/>
                
                <!-- Отдельные снежные кучки -->
                ${Array.from({length: 15}).map((_, i) => {
                    const x = 20 + Math.random() * 460;
                    const y = 205;
                    const width = 10 + Math.random() * 20;
                    const height = 3 + Math.random() * 4;
                    const opacity = 0.3 + Math.random() * 0.3;
                    
                    return `
                        <ellipse cx="${x}" cy="${y}" rx="${width/2}" ry="${height}" 
                                fill="rgba(255,255,255,${opacity})"/>
                    `;
                }).join('')}
            `;
        }
        
        // СТРОИМ ЗДАНИЯ
        khrushchevkaData.forEach((building, index) => {
            // Основное здание
            buildingsHTML += `
                <rect x="${building.x}" y="${building.y}" width="${building.width}" height="${building.height}" 
                    fill="${buildingColor}" opacity="0.9"/>
                
                ${Array.from({length: 5}).map((_, i) => 
                    `<rect x="${building.x}" y="${building.y + i * 32}" width="${building.width}" height="3" fill="${panelColor}" opacity="0.7"/>`
                ).join('')}
                
                ${generateKhrushchevkaWindows(building.x + 10, building.y + 12, building.width - 20, building.height - 24, windowColor, isWinter || isNewYear)}
                
                <rect x="${building.x - 4}" y="${building.y}" width="${building.width + 8}" height="5" fill="#4a4a4a"/>
                
                ${isWinter || isNewYear ? `<rect x="${building.x - 2}" y="${building.y - 5}" width="${building.width + 4}" height="5" fill="white" opacity="0.8"/>` : ''}
                
                <rect x="${building.x + building.width/2 - 8}" y="${building.y + building.height - 10}" width="16" height="10" fill="#8B4513"/>
                <rect x="${building.x + building.width/2 - 6}" y="${building.y + building.height - 20}" width="12" height="10" fill="#A0522D"/>
            `;
            
            if (index < khrushchevkaData.length - 1) {
                const treeX = building.x + building.width + 20;
                const treeSize = 18 + Math.random() * 4;
                buildingsHTML += generateTree(treeX, 210, treeSize, treeType);
            }
        });
        
        // ДЕРЕВЬЯ ПО КРАЯМ
        buildingsHTML += generateTree(25, 210, 16, treeType);
        buildingsHTML += generateTree(475, 210, 17, treeType);
        
        // ФУНКЦИЯ ДЛЯ ОКОН
        function generateKhrushchevkaWindows(x, y, width, height, color, isWinterOrNewYear) {
            let windows = '';
            const floorHeight = 32;
            const floors = 5;
            const windowsPerFloor = 8;
            const windowWidth = 8;
            const windowHeight = 12;
            const spacing = (width - windowsPerFloor * windowWidth) / (windowsPerFloor + 1);
            
            // Определяем градиент для свечения в зависимости от темы
            let glowGradientId = '';
            if (isGitHub) glowGradientId = 'windowGlowGitHub';
            else if (isMidnight) glowGradientId = 'windowGlowMidnight';
            else if (isNewYear) glowGradientId = 'windowGlowNewYear';
            else if (isWinter) glowGradientId = 'windowGlowWinter';
            else if (isHalloween) glowGradientId = 'windowGlowHalloween';
            
            for (let floor = 0; floor < floors; floor++) {
                for (let window = 0; window < windowsPerFloor; window++) {
                    const windowX = x + spacing + window * (windowWidth + spacing);
                    const windowY = y + floor * floorHeight + 8;
                    const isLit = Math.random() > 0.4; // 60% окон горят
                    
                    // Определяем цвет для конкретного окна
                    let windowColorValue = color;
                    let hasGlow = false;
                    
                    if (isGitHub && isLit) {
                        windowColorValue = '#58a6ff';
                        hasGlow = Math.random() > 0.6; // 40% окон светятся
                    } else if (isMidnight && isLit) {
                        windowColorValue = '#6d8eff';
                        hasGlow = Math.random() > 0.5; // 50% окон светятся
                    } else if (isNewYear && isLit) {
                        windowColorValue = '#ff6b6b';
                        hasGlow = Math.random() > 0.4; // 60% окон светятся
                    } else if (isWinter && isLit) {
                        windowColorValue = '#ffcc66';
                        hasGlow = Math.random() > 0.5; // 50% окон светятся
                    } else if (isHalloween && isLit) {
                        windowColorValue = '#ff7518';
                        hasGlow = Math.random() > 0.6; // 40% окон светятся
                    } else if (isOcean && isLit) {
                        windowColorValue = '#ffd700';
                        hasGlow = Math.random() > 0.5; // 50% окон светятся
                    }
                    
                    // Начинаем собирать HTML для этого окна
                    let windowHTML = `
                        <g>
                    `;
                    
                    // Добавляем свечение если нужно (пункт 4)
                    if (hasGlow && glowGradientId) {
                        windowHTML += `
                            <!-- Свечение окна -->
                            <rect x="${windowX - 3}" y="${windowY - 3}" width="${windowWidth + 6}" height="${windowHeight + 6}" 
                                fill="url(#${glowGradientId})" opacity="${isLit ? 0.8 : 0}">
                                <animate attributeName="opacity" values="0.6;0.8;0.6" dur="${3 + Math.random() * 3}s" repeatCount="indefinite"/>
                            </rect>
                        `;
                    }
                    
                    // Само окно (пункт 2)
                    windowHTML += `
                            <!-- Само окно -->
                            <rect x="${windowX}" y="${windowY}" width="${windowWidth}" height="${windowHeight}" 
                                fill="${windowColorValue}" opacity="${isLit ? 1 : 0.2}">
                    `;
                    
                    // Анимации для горящих окон
                    if (isLit) {
                        windowHTML += `
                                <animate attributeName="opacity" 
                                        values="0.9;0.7;0.5;0.7;0.9" 
                                        dur="${4 + Math.random() * 4}s" 
                                        repeatCount="indefinite"
                                        keyTimes="0;0.3;0.5;0.7;1"/>
                        `;
                        
                        if (hasGlow) {
                            windowHTML += `
                                <animate attributeName="fill" 
                                        values="${windowColorValue};${lightenColor(windowColorValue)};${windowColorValue}" 
                                        dur="${5 + Math.random() * 3}s" 
                                        repeatCount="indefinite"/>
                            `;
                        }
                        
                        if (isNewYear) {
                            windowHTML += `
                                <animate attributeName="fill" 
                                        values="${windowColorValue};#ffffff;${windowColorValue}" 
                                        dur="4s" 
                                        repeatCount="indefinite"/>
                            `;
                        }
                        
                        if (isOcean) {
                            windowHTML += `
                                <animate attributeName="fill" 
                                        values="${windowColorValue};#ffffff;${windowColorValue}" 
                                        dur="5s" 
                                        repeatCount="indefinite"/>
                            `;
                        }
                    }
                    
                    windowHTML += `
                            </rect>
                    `;
                    
                    // Добавляем подоконник с подсветкой для светящихся окон (пункт 4 продолжение)
                    if (hasGlow) {
                        windowHTML += `
                            <!-- Подоконник с подсветкой -->
                            <rect x="${windowX - 1}" y="${windowY + windowHeight}" 
                                width="${windowWidth + 2}" height="2" 
                                fill="${windowColorValue}" opacity="0.5">
                                <animate attributeName="opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite"/>
                            </rect>
                        `;
                    }
                    
                    windowHTML += `
                        </g>
                    `;
                    
                    windows += windowHTML;
                }
            }
            return windows;
        }
        
        // ЛАВОЧКИ
        let benchesHTML = `
            <!-- Лавочка 1 -->
            <rect x="80" y="200" width="40" height="4" fill="${isOcean ? '#5a3d1a' : '#8B4513'}"/>
            <rect x="78" y="196" width="44" height="4" fill="${isOcean ? '#6b4a2b' : '#A0522D'}"/>
            
            <!-- Лавочка 2 -->
            <rect x="220" y="200" width="40" height="4" fill="${isOcean ? '#5a3d1a' : '#8B4513'}"/>
            <rect x="218" y="196" width="44" height="4" fill="${isOcean ? '#6b4a2b' : '#A0522D'}"/>
            
            <!-- Лавочка 3 -->
            <rect x="380" y="200" width="40" height="4" fill="${isOcean ? '#5a3d1a' : '#8B4513'}"/>
            <rect x="378" y="196" width="44" height="4" fill="${isOcean ? '#6b4a2b' : '#A0522D'}"/>
        `;
        
        // УРНЫ
        let trashBinsHTML = `
            <!-- Мусорка 1 -->
            <rect x="130" y="195" width="12" height="15" fill="#696969" rx="2"/>
            <rect x="128" y="190" width="16" height="5" fill="#808080"/>
            
            <!-- Мусорка 2 -->
            <rect x="290" y="195" width="12" height="15" fill="#696969" rx="2"/>
            <rect x="288" y="190" width="16" height="5" fill="#808080"/>
        `;

        // Уличные фонари для ночных тем - РЕАЛЬНО ОПУЩЕННЫЕ
        let streetLightsHTML = '';
        if (isMidnight || isGitHub || isNewYear || isWinter) {
            const lightColor = isGitHub ? '#58a6ff' : 
                            isMidnight ? '#6d8eff' : 
                            isNewYear ? '#ff6b6b' : 
                            isWinter ? '#ffcc66' : '#ffffff';
            
            const glowGradient = isGitHub ? 'windowGlowGitHub' : 
                                isMidnight ? 'windowGlowMidnight' : 
                                isNewYear ? 'windowGlowNewYear' : 
                                'windowGlowWinter';
            
            streetLightsHTML = `
                <!-- Уличные фонари в парке - 4 штуки -->
                <g>
                    <!-- Фонарь 1 (крайний левый) - ВЫСОКИЙ С ПОВОРОТОМ СВЕРХУ -->
                    <g transform="translate(60, 180)"> <!-- Ещё выше: 190 → 180 -->
                        <!-- ОЧЕНЬ ВЫСОКИЙ столб -->
                        <rect x="-2" y="0" width="4" height="55" fill="#5a5a5a"/>
                        <rect x="-5" y="55" width="10" height="5" fill="#696969"/>
                        
                        <!-- Прямой кронштейн, начинающийся ВЫСОКО на столбе -->
                        <line x1="0" y1="-15" x2="40" y2="-45" 
                            stroke="#707070" stroke-width="4" stroke-linecap="round"/>
                        
                        <!-- Плафон на конце -->
                        <circle cx="40" cy="-45" r="8" fill="#c0c0c0" opacity="0.9" stroke="#a0a0a0" stroke-width="1.5"/>
                        
                        <!-- Яркая лампочка -->
                        <circle cx="40" cy="-45" r="5" fill="${lightColor}" opacity="1">
                            <animate attributeName="r" values="5;5.8;5" dur="1.3s" repeatCount="indefinite"/>
                            <animate attributeName="fill" values="${lightColor};${lightenColor(lightColor)};${lightColor}" 
                                    dur="2s" repeatCount="indefinite"/>
                        </circle>
                        
                        <!-- ОЧЕНЬ ЯРКИЙ и большой луч-конус -->
                        <path d="M40,-45 
                                Q45,-30 50,-45
                                L70,45
                                Q45,65 20,45
                                L30,-45
                                Z" 
                            fill="url(#${glowGradient})" opacity="0.55">
                            <animate attributeName="opacity" values="0.55;0.65;0.55" dur="2.5s" repeatCount="indefinite"/>
                        </path>
                        
                        <ellipse cx="45" cy="50" rx="35" ry="18" fill="url(#${glowGradient})" opacity="0.25">
                            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3.5s" repeatCount="indefinite"/>
                        </ellipse>
                    </g>
                    
                    <!-- Фонарь 2 (слева от центра) -->
                    <g transform="translate(170, 178)">
                        <rect x="-2" y="0" width="4" height="58" fill="#5a5a5a"/>
                        <rect x="-5" y="58" width="10" height="5" fill="#696969"/>
                        
                        <line x1="0" y1="-18" x2="40" y2="-48" 
                            stroke="#707070" stroke-width="4" stroke-linecap="round"/>
                        
                        <circle cx="40" cy="-48" r="8" fill="#c0c0c0" opacity="0.9" stroke="#a0a0a0" stroke-width="1.5"/>
                        
                        <circle cx="40" cy="-48" r="5" fill="${lightColor}" opacity="1">
                            <animate attributeName="r" values="5;5.8;5" dur="1.3s" repeatCount="indefinite" begin="0.3s"/>
                            <animate attributeName="fill" values="${lightColor};${lightenColor(lightColor)};${lightColor}" 
                                    dur="2s" repeatCount="indefinite" begin="0.3s"/>
                        </circle>
                        
                        <path d="M40,-48 
                                Q45,-33 50,-48
                                L70,42
                                Q45,62 20,42
                                L30,-48
                                Z" 
                            fill="url(#${glowGradient})" opacity="0.55">
                            <animate attributeName="opacity" values="0.55;0.65;0.55" dur="2.5s" repeatCount="indefinite" begin="0.3s"/>
                        </path>
                        <ellipse cx="45" cy="47" rx="35" ry="18" fill="url(#${glowGradient})" opacity="0.25">
                            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3.5s" repeatCount="indefinite" begin="0.3s"/>
                        </ellipse>
                    </g>
                    
                    <!-- Фонарь 3 (справа от центра) - ПОВЕРНУТ ВЛЕВО -->
                    <g transform="translate(330, 182)">
                        <rect x="-2" y="0" width="4" height="53" fill="#5a5a5a"/>
                        <rect x="-5" y="53" width="10" height="5" fill="#696969"/>
                        
                        <!-- Кронштейн влево (зеркально) -->
                        <line x1="0" y1="-16" x2="-40" y2="-46" 
                            stroke="#707070" stroke-width="4" stroke-linecap="round"/>
                        
                        <circle cx="-40" cy="-46" r="8" fill="#c0c0c0" opacity="0.9" stroke="#a0a0a0" stroke-width="1.5"/>
                        
                        <circle cx="-40" cy="-46" r="5" fill="${lightColor}" opacity="1">
                            <animate attributeName="r" values="5;5.8;5" dur="1.3s" repeatCount="indefinite" begin="0.6s"/>
                            <animate attributeName="fill" values="${lightColor};${lightenColor(lightColor)};${lightColor}" 
                                    dur="2s" repeatCount="indefinite" begin="0.6s"/>
                        </circle>
                        
                        <!-- Зеркальный луч-конус -->
                        <path d="M-40,-46 
                                Q-45,-31 -50,-46
                                L-70,44
                                Q-45,64 -20,44
                                L-30,-46
                                Z" 
                            fill="url(#${glowGradient})" opacity="0.55">
                            <animate attributeName="opacity" values="0.55;0.65;0.55" dur="2.5s" repeatCount="indefinite" begin="0.6s"/>
                        </path>
                        <ellipse cx="-45" cy="49" rx="35" ry="18" fill="url(#${glowGradient})" opacity="0.25">
                            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3.5s" repeatCount="indefinite" begin="0.6s"/>
                        </ellipse>
                    </g>
                    
                    <!-- Фонарь 4 (крайний правый) - ПОВЕРНУТ ВЛЕВО -->
                    <g transform="translate(440, 179)">
                        <rect x="-2" y="0" width="4" height="56" fill="#5a5a5a"/>
                        <rect x="-5" y="56" width="10" height="5" fill="#696969"/>
                        
                        <line x1="0" y1="-17" x2="-40" y2="-47" 
                            stroke="#707070" stroke-width="4" stroke-linecap="round"/>
                        
                        <circle cx="-40" cy="-47" r="8" fill="#c0c0c0" opacity="0.9" stroke="#a0a0a0" stroke-width="1.5"/>
                        
                        <circle cx="-40" cy="-47" r="5" fill="${lightColor}" opacity="1">
                            <animate attributeName="r" values="5;5.8;5" dur="1.3s" repeatCount="indefinite" begin="0.9s"/>
                            <animate attributeName="fill" values="${lightColor};${lightenColor(lightColor)};${lightColor}" 
                                    dur="2s" repeatCount="indefinite" begin="0.9s"/>
                        </circle>
                        
                        <path d="M-40,-47 
                                Q-45,-32 -50,-47
                                L-70,43
                                Q-45,63 -20,43
                                L-30,-47
                                Z" 
                            fill="url(#${glowGradient})" opacity="0.55">
                            <animate attributeName="opacity" values="0.55;0.65;0.55" dur="2.5s" repeatCount="indefinite" begin="0.9s"/>
                        </path>
                        <ellipse cx="-45" cy="48" rx="35" ry="18" fill="url(#${glowGradient})" opacity="0.25">
                            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3.5s" repeatCount="indefinite" begin="0.9s"/>
                        </ellipse>
                    </g>
                </g>
            `;
        }

        let snowmanHTML = '';
        if (isWinter || isNewYear) {
            snowmanHTML = `
                <!-- Снеговик в парке -->
                <g transform="translate(420, 185)">
                    <!-- Нижний шар снеговика -->
                    <circle cx="0" cy="25" r="12" fill="white" opacity="0.97">
                        <animate attributeName="cy" values="25;24;25" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Средний шар -->
                    <circle cx="0" cy="10" r="9" fill="white" opacity="0.97">
                        <animate attributeName="cy" values="10;9;10" dur="3s" repeatCount="indefinite" begin="0.5s"/>
                    </circle>
                    
                    <!-- Верхний шар (голова) -->
                    <circle cx="0" cy="-2" r="6.5" fill="white" opacity="0.97">
                        <animate attributeName="cy" values="-2;-3;-2" dur="3s" repeatCount="indefinite" begin="1s"/>
                    </circle>
                    
                    <!-- Глаза -->
                    <circle cx="-2" cy="-2" r="1" fill="black"/>
                    <circle cx="2" cy="-2" r="1" fill="black"/>
                    
                    <!-- Нос (морковка) -->
                    <polygon points="0,0 4,1 0,2" fill="#ff7518"/>
                    
                    <!-- Рот (улыбка) -->
                    <path d="M-2.5,2 Q0,4 2.5,2" stroke="black" stroke-width="0.7" fill="none" stroke-linecap="round"/>
                    
                    <!-- Пуговицы -->
                    <circle cx="0" cy="12" r="1.2" fill="black">
                        <animate attributeName="r" values="1.2;1.5;1.2" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="0" cy="20" r="1.2" fill="black">
                        <animate attributeName="r" values="1.2;1.5;1.2" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
                    </circle>
                    
                    <!-- Ведро на голове -->
                    <rect x="-3.5" y="-9" width="7" height="2.5" fill="#4a4a4a" rx="1"/>
                    <rect x="-2.5" y="-10.5" width="5" height="1.5" fill="#4a4a4a" rx="0.5"/>
                    
                    <!-- Руки -->
                    <line x1="-7" y1="10" x2="-12" y2="5" stroke="#8B4513" stroke-width="1.5" stroke-linecap="round"/>
                    <line x1="7" y1="10" x2="12" y2="5" stroke="#8B4513" stroke-width="1.5" stroke-linecap="round"/>
                    
                    <!-- Метелка -->
                    <line x1="12" y1="5" x2="18" y2="0" stroke="#8B4513" stroke-width="1.2" stroke-linecap="round"/>
                    <line x1="18" y1="0" x2="16" y2="-2" stroke="#8B4513" stroke-width="0.8" stroke-linecap="round"/>
                    <line x1="18" y1="0" x2="16" y2="2" stroke="#8B4513" stroke-width="0.8" stroke-linecap="round"/>
                    <line x1="18" y1="0" x2="20" y2="-1.5" stroke="#8B4513" stroke-width="0.8" stroke-linecap="round"/>
                    <line x1="18" y1="0" x2="20" y2="1.5" stroke="#8B4513" stroke-width="0.8" stroke-linecap="round"/>
                </g>
            `;
        }
        
        // КУСТЫ
        let bushesHTML = '';
        if (isOcean) {
            bushesHTML = `
                <!-- Морские кусты/водоросли -->
                <ellipse cx="200" cy="210" rx="12" ry="8" fill="#20B2AA" opacity="0.8"/>
                <ellipse cx="195" cy="205" rx="10" ry="6" fill="#2E8B57" opacity="0.9"/>
                <ellipse cx="205" cy="205" rx="9" ry="5" fill="#3CB371" opacity="0.9"/>
                
                <ellipse cx="320" cy="210" rx="14" ry="9" fill="#20B2AA" opacity="0.8"/>
                <ellipse cx="315" cy="205" rx="11" ry="7" fill="#2E8B57" opacity="0.9"/>
                <ellipse cx="325" cy="205" rx="10" ry="6" fill="#3CB371" opacity="0.9"/>
                
                <!-- Морские ракушки/камни -->
                <circle cx="180" cy="213" r="3" fill="#ffd700" opacity="0.6"/>
                <circle cx="340" cy="212" r="2.5" fill="#ffed4e" opacity="0.5"/>
            `;
        } else if (isGitHub) { // ← ДОБАВЬ ДЛЯ GITHUB
            bushesHTML = `
                <!-- Серые кусты для GitHub темы -->
                <circle cx="200" cy="210" r="10" fill="#484f58" opacity="0.8"/>
                <circle cx="195" cy="205" r="8" fill="#6e7681" opacity="0.9"/>
                <circle cx="205" cy="205" r="7" fill="#8b949e" opacity="0.9"/>
                
                <circle cx="320" cy="210" r="12" fill="#484f58" opacity="0.8"/>
                <circle cx="315" cy="205" r="9" fill="#6e7681" opacity="0.9"/>
                <circle cx="325" cy="205" r="8" fill="#8b949e" opacity="0.9"/>
            `;
        } else if (isMidnight) { // ← ДОБАВЬ ДЛЯ ПОЛНОЧИ
            bushesHTML = `
                <!-- Темно-синие кусты для полночной темы -->
                <circle cx="200" cy="210" r="10" fill="#2C3E50" opacity="0.8"/>
                <circle cx="195" cy="205" r="8" fill="#34495E" opacity="0.9"/>
                <circle cx="205" cy="205" r="7" fill="#4a6278" opacity="0.9"/>
                
                <circle cx="320" cy="210" r="12" fill="#2C3E50" opacity="0.8"/>
                <circle cx="315" cy="205" r="9" fill="#34495E" opacity="0.9"/>
                <circle cx="325" cy="205" r="8" fill="#4a6278" opacity="0.9"/>
            `;
        } else if (isWinter || isNewYear) {
            bushesHTML = `
                <!-- Снежные кусты -->
                <circle cx="200" cy="210" r="10" fill="#F0F8FF" opacity="0.8"/>
                <!-- ... -->
            `;
        } else {
            bushesHTML = `
                <!-- Обычные зеленые кусты -->
                <circle cx="200" cy="210" r="10" fill="${grassColor}" opacity="0.8"/>
                <circle cx="195" cy="205" r="8" fill="${isWinter || isNewYear ? '#F0F8FF' : '#2E8B57'}" opacity="0.9"/>
                <circle cx="205" cy="205" r="7" fill="${isWinter || isNewYear ? '#FFFFFF' : '#3CB371'}" opacity="0.9"/>
                
                <circle cx="320" cy="210" r="12" fill="${grassColor}" opacity="0.8"/>
                <circle cx="315" cy="205" r="9" fill="${isWinter || isNewYear ? '#F0F8FF' : '#2E8B57'}" opacity="0.9"/>
                <circle cx="325" cy="205" r="8" fill="${isWinter || isNewYear ? '#FFFFFF' : '#3CB371'}" opacity="0.9"/>
            `;
        }
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <!-- Градиент для виньетки (тёмные углы) -->
            <radialGradient id="vignetteGradient" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
            </radialGradient>

            <radialGradient id="moonGlowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f5f7ff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#f5f7ff" stop-opacity="0"/>
            </radialGradient>

            <!-- Градиент для тумана (добавить для полночной темы) -->
            <linearGradient id="fogGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#6a7a9b" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#6a7a9b" stop-opacity="0"/>
            </linearGradient>

            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${skyColor1}"/>
                <stop offset="100%" stop-color="${skyColor2}"/>
            </linearGradient>

            <filter id="textShadow">
                <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.7)"/>
            </filter>

            <radialGradient id="windowGlowGitHub" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#58a6ff" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="#58a6ff" stop-opacity="0"/>
            </radialGradient>
            
            <radialGradient id="windowGlowMidnight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#6d8eff" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#6d8eff" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#6d8eff" stop-opacity="0"/>
            </radialGradient>
            
            <radialGradient id="windowGlowWinter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffcc66" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#ffcc66" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#ffcc66" stop-opacity="0"/>
            </radialGradient>
            
            <radialGradient id="windowGlowNewYear" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ff6b6b" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#ff6b6b" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#ff6b6b" stop-opacity="0"/>
            </radialGradient>

            <radialGradient id="windowGlowHalloween" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ff7518" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#ff7518" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#ff7518" stop-opacity="0"/>
            </radialGradient>
            
            <!-- Фильтр свечения -->
            <filter id="windowGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                <feFlood flood-color="currentColor" flood-opacity="0.6" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>

            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <g clip-path="url(#cardClip)">
            <!-- Небо -->
            <rect width="500" height="250" fill="url(#skyGradient)" rx="12" ry="12"/>
            
            <!-- Звезды для ночных тем -->
            ${galaxyStarsHTML}
            
            <!-- Волны/облака для океанской темы -->
            ${oceanWavesHTML}

            
            <!-- Снежинки для зимней и новогодней темы -->
            ${snowflakesHTML}
            
            <!-- Облака -->
            ${getCloudsHTML()}

            <!-- ТЕМНОТА для ночных тем (полупрозрачный чёрный слой) -->
            ${(isMidnight || isGitHub || isNewYear || isWinter) ? `
                <!-- Тёмный слой для атмосферы ночи -->
                <rect width="500" height="250" fill="#000000" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0.35;0.3" dur="10s" repeatCount="indefinite"/>
                </rect>
                
                <!-- Тёмные углы (виньетка эффект) -->
                <radialGradient id="vignetteGradient" cx="50%" cy="50%" r="75%">
                    <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
                    <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
                </radialGradient>
                <rect width="500" height="250" fill="url(#vignetteGradient)" opacity="0.5"/>
                
                <!-- Лёгкая дымка -->
                <rect width="500" height="250" fill="url(#fogGradient)" opacity="0.1"/>
            ` : ''}
            
            ${buildingsHTML}

            <!-- Огоньки для новогодней темы -->
            ${newYearLightsHTML}
            
            <!-- ПОЛЕ -->
            <rect x="0" y="195" width="500" height="60" fill="${groundColor}"/>
            
            <!-- Снег на поле для зимних тем -->
            ${fieldSnowHTML ? fieldSnowHTML.replace(/y="200"/g, 'y="195"').replace(/height="50"/g, 'height="60"') : ''}
            
            <!-- Тротуар -->
            <rect x="40" y="205" width="420" height="40" fill="${sidewalkColor}" opacity="${isWinter || isNewYear ? 0.7 : 0.8}" rx="3"/>
            
            <!-- Бордюр -->
            <rect x="0" y="195" width="500" height="3" fill="#8B4513" opacity="0.9"/>
            

            <!-- ЛАВОЧКИ -->
            ${benchesHTML}

            <!-- СНЕГОВИК -->
            ${snowmanHTML}
            
            <!-- УРНЫ -->
            ${trashBinsHTML}
            
            <!-- КУСТЫ -->
            ${bushesHTML}
            
            <!-- Снег на земле зимой -->
            ${isWinter || isNewYear ? `
                <circle cx="100" cy="200" r="3" fill="white" opacity="0.7"/>
                <circle cx="250" cy="198" r="2" fill="white" opacity="0.8"/>
                <circle cx="400" cy="202" r="4" fill="white" opacity="0.6"/>
            ` : ''}
            
            <!-- Текст пользователя -->
            <text x="30" y="60" font-family="'Arial', sans-serif" font-size="28" font-weight="bold" 
                fill="${isMatrix ? '#00ff00' : isCyberpunk ? '#00ff9d' : 'white'}" filter="url(#textShadow)">${username}</text>
            <text x="30" y="95" font-family="'Arial', sans-serif" font-size="16" 
                fill="${isMatrix ? '#00ff00' : isCyberpunk ? '#00ff9d' : 'white'}" opacity="0.9" filter="url(#textShadow)">${bio}</text>
            
            ${streetLightsHTML}
            
            <!-- Круги с эмодзи -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${windowColor}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="${windowColor};#ff0000;${windowColor}" dur="3s" repeatCount="indefinite"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="#e74c3c" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="#e74c3c;#00ff00;#e74c3c" dur="3s" repeatCount="indefinite" begin="1s"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="#27ae60" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                            ${isNewYear ? `<animate attributeName="fill" values="#27ae60;#ffff00;#27ae60" dur="3s" repeatCount="indefinite" begin="2s"/>` : ''}
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
        </g>
        
        <!-- Подпись -->
        <text x="250" y="245" text-anchor="middle" font-family="'Arial', sans-serif" font-size="11" 
            fill="${isMatrix ? '#00ff00' : isCyberpunk ? '#00ff9d' : 'white'}" opacity="0.8" filter="url(#textShadow)">
            ${isOcean ? '🏖️ ' : ''}${subtitle}${isOcean ? ' 🏖️' : ''}
        </text>
    </svg>`;
    }

    // 5. ЧАСТИЦЫ
    function generateParticlesCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = 'Сгенерировано в GitVerse') {
        const count = config.count || 'medium';
        const speed = config.speed || 'medium';
        const size = config.size || 'medium';
        
        const particleCounts = { low: 5, medium: 10, high: 20 };
        const durations = { low: 8, medium: 5, high: 3 };
        const sizes = { low: 1.2, medium: 1.8, high: 2.5 };
        
        const particleCount = particleCounts[count] || 10;
        const baseDuration = durations[speed] || 5;
        const baseSize = sizes[size] || 1.8;
        
        let particlesHTML = '';
        for (let i = 0; i < particleCount; i++) {
            const x = 30 + Math.random() * 440;
            const y = 30 + Math.random() * 140;
            const delay = Math.random() * 3;
            const individualDuration = baseDuration + Math.random() * 2 - 1;
            const particleSize = baseSize * (0.7 + Math.random() * 0.6);
            const endX = x + (Math.random() * 60 - 30);
            const endY = y + (Math.random() * 40 - 20);
            const midX = (x + endX) / 2 + (Math.random() * 40 - 20);
            const midY = (y + endY) / 2 + (Math.random() * 30 - 15);
            
            particlesHTML += `
                <circle cx="${x}" cy="${y}" r="${particleSize}" fill="${colors.accent}" opacity="${0.4 + Math.random() * 0.4}">
                    <animate attributeName="cy" values="${y};${midY};${endY};${y}" 
                            dur="${individualDuration}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"
                            keyTimes="0;0.5;0.8;1"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"/>
                    <animate attributeName="cx" values="${x};${midX};${endX};${x}" 
                            dur="${individualDuration}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"
                            keyTimes="0;0.5;0.8;1"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"/>
                    <animate attributeName="opacity" values="${0.4 + Math.random() * 0.4};${0.8 + Math.random() * 0.2};${0.3 + Math.random() * 0.3};${0.4 + Math.random() * 0.4}" 
                            dur="${individualDuration}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"/>
                    <animate attributeName="r" values="${particleSize};${particleSize * 1.2};${particleSize}" 
                            dur="${individualDuration/2}s" 
                            repeatCount="indefinite" 
                            begin="${delay}s"/>
                </circle>
            `;
        }
        
        let glowParticlesHTML = '';
        for (let i = 0; i < 3; i++) {
            const x = 200 + Math.random() * 100;
            const y = 80 + Math.random() * 100;
            const size = 3 + Math.random() * 2;
            const duration = 3 + Math.random() * 2;
            
            glowParticlesHTML += `
                <circle cx="${x}" cy="${y}" r="${size}" fill="${colors.accent}" opacity="0.2">
                    <animate attributeName="r" values="${size};${size * 1.5};${size}" 
                            dur="${duration}s" 
                            repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0.4;0.2" 
                            dur="${duration}s" 
                            repeatCount="indefinite"/>
                </circle>
            `;
        }
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.bg1}">
                    <animate attributeName="stop-color" values="${colors.bg1};${colors.accent};${colors.bg1}" dur="15s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stop-color="${colors.bg2}">
                    <animate attributeName="stop-color" values="${colors.bg2};${colors.bg1};${colors.bg2}" dur="15s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${colors.shadow}" flood-opacity="0.3"/>
            </filter>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.7"/>
                <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0"/>
            </radialGradient>
            
            <!-- CLIP PATH -->
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <!-- ВСЁ содержимое внутри clipPath -->
        <g clip-path="url(#cardClip)">
            <!-- Фон с градиентом -->
            <rect width="100%" height="100%" fill="url(#bgGradient)" rx="15" ry="15" filter="url(#shadow)"/>
            
            <!-- Большой центральный светящийся круг -->
            <circle cx="250" cy="125" r="60" fill="url(#glowGradient)" opacity="0.1">
                <animate attributeName="r" values="60;65;60" dur="8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.1;0.15;0.1" dur="8s" repeatCount="indefinite"/>
            </circle>
            
            ${particlesHTML}
            ${glowParticlesHTML}
            
            <!-- Текст пользователя -->
            <text x="30" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${colors.text}" 
                filter="url(#shadow)">${username}</text>
            <text x="30" y="95" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}" opacity="0.9">${bio}</text>
            
            <!-- Эмодзи с анимацией -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white" 
                            style="text-shadow: 0 0 3px rgba(0,0,0,0.5);">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white" 
                            style="text-shadow: 0 0 3px rgba(0,0,0,0.5);">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="${colors.accent}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white" 
                            style="text-shadow: 0 0 3px rgba(0,0,0,0.5);">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <!-- Частицы, вылетающие из кружков эмодзи -->
            <circle cx="55" cy="165" r="1.5" fill="${colors.accent}" opacity="0.6">
                <animate attributeName="cx" values="55;75;55" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="cy" values="165;145;165" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="125" cy="165" r="1.5" fill="${colors.accent}" opacity="0.6">
                <animate attributeName="cx" values="125;145;125" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
                <animate attributeName="cy" values="165;150;165" dur="3.5s" repeatCount="indefinite" begin="0.5s"/>
            </circle>
            <circle cx="195" cy="165" r="1.5" fill="${colors.accent}" opacity="0.6">
                <animate attributeName="cx" values="195;215;195" dur="4s" repeatCount="indefinite" begin="1s"/>
                <animate attributeName="cy" values="165;155;165" dur="4s" repeatCount="indefinite" begin="1s"/>
            </circle>
        </g>
        
        <!-- Подпись ВНЕ clipPath -->
        <text x="250" y="235" text-anchor="middle" font-family="Arial" font-size="12" fill="${colors.text}" opacity="0.7">
            ${subtitle}
        </text>
    </svg>`;
    }

    // 6. ГРАДИЕНТ (дополнительный)
    function generateGradientCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '🌈 Градиентная карточка') {
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Основной градиент -->
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.bg1}">
                    <animate attributeName="stop-color" values="${colors.bg1};${colors.accent};${colors.bg1}" dur="10s" repeatCount="indefinite"/>
                </stop>
                <stop offset="50%" stop-color="${colors.accent}">
                    <animate attributeName="stop-color" values="${colors.accent};${colors.text};${colors.accent}" dur="15s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stop-color="${colors.bg2}">
                    <animate attributeName="stop-color" values="${colors.bg2};${colors.bg1};${colors.bg2}" dur="12s" repeatCount="indefinite"/>
                </stop>
            </linearGradient>
            
            <!-- Второй градиент для эффекта -->
            <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.1"/>
                <stop offset="50%" stop-color="${colors.text}" stop-opacity="0.05"/>
                <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0.1"/>
            </linearGradient>
            
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${colors.shadow}" flood-opacity="0.3"/>
            </filter>
            
            <!-- CLIP PATH -->
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
        </defs>
        
        <!-- ВСЁ содержимое внутри clipPath -->
        <g clip-path="url(#cardClip)">
            <!-- Основной фон -->
            <rect width="500" height="250" fill="url(#bgGradient)" rx="12" ry="12" filter="url(#shadow)"/>
            
            <!-- Второй слой градиента -->
            <rect width="500" height="250" fill="url(#overlayGradient)" rx="12" ry="12"/>
            
            <!-- Линии в стиле минимализма -->
            <line x1="30" y1="115" x2="470" y2="115" stroke="${colors.text}" stroke-width="1" opacity="0.2"/>
            
            <!-- Угловые акценты -->
            <circle cx="20" cy="20" r="3" fill="${colors.accent}" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="480" cy="20" r="3" fill="${colors.accent}" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" begin="1s"/>
            </circle>
            <circle cx="20" cy="230" r="3" fill="${colors.accent}" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" begin="2s"/>
            </circle>
            <circle cx="480" cy="230" r="3" fill="${colors.accent}" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" begin="3s"/>
            </circle>
            
            <text x="30" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${colors.text}">${username}</text>
            <text x="30" y="95" font-family="Arial, sans-serif" font-size="16" fill="${colors.text}" opacity="0.9">${bio}</text>
            
            <!-- Круги с градиентом -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <defs>
                            <radialGradient id="gradientCircle1" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="${colors.accent}"/>
                                <stop offset="100%" stop-color="${colors.bg1}"/>
                            </radialGradient>
                        </defs>
                        <circle cx="25" cy="25" r="20" fill="url(#gradientCircle1)" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <defs>
                            <radialGradient id="gradientCircle2" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="${colors.text}"/>
                                <stop offset="100%" stop-color="${colors.bg2}"/>
                            </radialGradient>
                        </defs>
                        <circle cx="25" cy="25" r="20" fill="url(#gradientCircle2)" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="${colors.bg1}">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <defs>
                            <linearGradient id="gradientCircle3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="${colors.bg1}"/>
                                <stop offset="100%" stop-color="${colors.accent}"/>
                            </linearGradient>
                        </defs>
                        <circle cx="25" cy="25" r="20" fill="url(#gradientCircle3)" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <!-- Точки-переливы -->
            ${Array.from({length: 8}).map((_, i) => {
                const x = 350 + i * 20;
                const y = 80 + Math.sin(i) * 10;
                const delay = i * 0.3;
                return `
                    <circle cx="${x}" cy="${y}" r="1.5" fill="${colors.accent}" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" begin="${delay}s"/>
                    </circle>
                `;
            }).join('')}
        </g>
        
        <!-- Подпись ВНЕ clipPath -->
        <text x="250" y="240" text-anchor="middle" font-family="Arial" font-size="12" fill="${colors.text}" opacity="0.7">
            ${subtitle}
        </text>
    </svg>`;
    }

    // МОДЕРН-СИТИ (здания сдвинуты правее)
    function generateModernCityCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '🗽 Современный мегаполис') {
        const accentColor = colors.accent || '#3498db';
        const windowColor = colors.text === '#00ff00' ? '#00ff00' : '#f1c40f';
        
        let buildingsHTML = '';
        
        // Разнообразные формы зданий (СДВИНУТЫ ПРАВЕЕ на 50px)
        const skyscrapers = [
            // Слева - здание с изогнутой крышей
            {x: 230, y: 90, baseWidth: 40, height: 160, taper: 0.8, color: colors.bg1 || '#34495e', type: 'curved'},
            
            // Центр - стандартное сужающееся здание
            {x: 280, y: 70, baseWidth: 50, height: 180, taper: 0.75, color: colors.bg2 || '#2c3e50', type: 'standard'},
            
            // Центр-право - здание с антенной
            {x: 340, y: 60, baseWidth: 45, height: 190, taper: 0.7, color: colors.bg1 || '#34495e', type: 'antenna'},
            
            // Право - узкое здание со шпилем
            {x: 395, y: 80, baseWidth: 35, height: 170, taper: 0.65, color: colors.bg2 || '#2c3e50', type: 'spire'},
            
            // Крайнее правое - широкое здание
            {x: 440, y: 75, baseWidth: 55, height: 175, taper: 0.85, color: colors.bg1 || '#34495e', type: 'wide'},
        ];
        
        function generateModernSkyscraper(x, y, baseWidth, height, taper, color, type) {
            const topWidth = baseWidth * taper;
            
            let building = `
                <!-- Основное здание -->
                <polygon points="
                    ${x},${y + height} 
                    ${x + baseWidth},${y + height} 
                    ${x + baseWidth - (baseWidth - topWidth)/2},${y} 
                    ${x + (baseWidth - topWidth)/2},${y}"
                    fill="${color}" opacity="0.9"/>
            `;
            
            // Разные типы крыш и деталей
            if (type === 'curved') {
                // Изогнутая крыша
                building += `
                    <path d="M${x + (baseWidth - topWidth)/2},${y} 
                            Q${x + baseWidth/2},${y - 10} ${x + baseWidth - (baseWidth - topWidth)/2},${y}"
                        fill="${accentColor}" opacity="0.7"/>
                `;
            } else if (type === 'antenna') {
                // Антенна
                building += `
                    <line x1="${x + baseWidth/2}" y1="${y}" x2="${x + baseWidth/2}" y2="${y - 30}" 
                        stroke="${accentColor}" stroke-width="1.5" opacity="0.8"/>
                    <circle cx="${x + baseWidth/2}" cy="${y - 35}" r="3" fill="${accentColor}" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                    </circle>
                `;
            } else if (type === 'spire') {
                // Шпиль
                building += `
                    <polygon points="${x + baseWidth/2},${y} 
                                    ${x + baseWidth/2 - 3},${y - 25} 
                                    ${x + baseWidth/2 + 3},${y - 25}" 
                            fill="${accentColor}" opacity="0.8"/>
                `;
            }
            
            // Добавляем окна (разные паттерны для разных зданий)
            building += generateModernWindows(x + 5, y + 5, baseWidth - 10, height - 10, windowColor, taper, type);
            
            return building;
        }
        
        function generateModernWindows(x, y, width, height, color, taper, type) {
            let windows = '';
            const windowRows = Math.floor(height / 25);
            
            for (let row = 0; row < windowRows; row++) {
                const rowWidth = width * (1 - (1 - taper) * (row / windowRows));
                const rowX = x + (width - rowWidth) / 2;
                
                // Разные паттерны окон для разных типов зданий
                let windowCols;
                let skipPattern;
                
                if (type === 'wide') {
                    windowCols = Math.floor(rowWidth / 12); // Более частые окна
                    skipPattern = row % 2 === 0 ? 2 : 3; // Шахматный порядок
                } else if (type === 'antenna') {
                    windowCols = Math.floor(rowWidth / 18); // Реже окна
                    skipPattern = 0; // Все окна
                } else {
                    windowCols = Math.floor(rowWidth / 15); // Стандартно
                    skipPattern = row % 3 === 0 ? 1 : 0; // Случайный пропуск
                }
                
                for (let col = 0; col < windowCols; col++) {
                    if (skipPattern === 0 || col % skipPattern !== 0) {
                        if (Math.random() > 0.3) {
                            const windowX = rowX + 2 + col * (rowWidth / windowCols);
                            const windowY = y + 5 + row * 25;
                            const windowWidth = 6 + Math.random() * 4;
                            const windowHeight = 10 + Math.random() * 5;
                            const hue = type === 'curved' ? accentColor : 
                                    type === 'spire' ? '#f39c12' : color;
                            const delay = col * 0.1 + row * 0.3;
                            const duration = 2 + Math.random() * 2;
                            const lit = Math.random() > 0.2;
                            
                            windows += `
                                <rect x="${windowX}" y="${windowY}" width="${windowWidth}" height="${windowHeight}" 
                                    fill="${hue}" opacity="${lit ? 0.8 : 0.3}">
                                    ${lit ? `
                                        <animate attributeName="opacity" 
                                                values="0.8;1;0.5;0.8" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"
                                                keyTimes="0;0.4;0.7;1"/>
                                    ` : ''}
                                </rect>
                            `;
                        }
                    }
                }
            }
            return windows;
        }
        
        // Строим небоскребы
        skyscrapers.forEach((skyscraper) => {
            buildingsHTML += generateModernSkyscraper(
                skyscraper.x, skyscraper.y, 
                skyscraper.baseWidth, skyscraper.height, 
                skyscraper.taper, skyscraper.color,
                skyscraper.type
            );
        });
        
        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#001a33"/>
                <stop offset="50%" stop-color="${colors.bg1 || '#003366'}"/>
                <stop offset="100%" stop-color="#000d1a"/>
            </linearGradient>
            
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1a1a2e"/>
                <stop offset="100%" stop-color="#0f3460"/>
            </linearGradient>
            
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
            
            <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        <g clip-path="url(#cardClip)">
            <rect width="500" height="250" fill="url(#skyGradient)" rx="12" ry="12"/>
            
            <circle cx="450" cy="60" r="20" fill="#f5f5f5" opacity="0.8"/>
            <circle cx="445" cy="55" r="16" fill="#e0e0e0" opacity="0.6"/>
            
            ${Array.from({length: 40}).map((_, i) => {
                const x = Math.random() * 500;
                const y = Math.random() * 150;
                const size = 0.2 + Math.random() * 0.8;
                const opacity = 0.1 + Math.random() * 0.4;
                const delay = Math.random() * 3;
                const duration = 1.5 + Math.random() * 2;
                const twinkle = Math.random() > 0.6;
                
                if (twinkle) {
                    return `
                        <circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}">
                            <animate attributeName="opacity" values="${opacity};${opacity * 2.5};${opacity}" 
                                    dur="${duration}s" repeatCount="indefinite" begin="${delay}s"/>
                        </circle>
                    `;
                } else {
                    return `
                        <circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}"/>
                    `;
                }
            }).join('')}
            
            <!-- Поверхность на всю длину -->
            <rect x="0" y="190" width="500" height="60" fill="url(#groundGradient)"/>
            
            ${buildingsHTML}
            
            <text x="30" y="60" font-family="'Arial', sans-serif" font-size="28" font-weight="bold" 
                fill="white">${username}</text>
            <text x="30" y="95" font-family="'Arial', sans-serif" font-size="16" 
                fill="white" opacity="0.9">${bio}</text>
            
            <!-- Круги -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${accentColor}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="#e74c3c" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="#f39c12" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
        </g>
        
        <text x="250" y="235" text-anchor="middle" font-family="'Arial', sans-serif" font-size="11" 
            fill="white" opacity="0.8">
            ${subtitle}
        </text>
    </svg>`;
    }

    function generateNewYearCard(username, bio, emoji1, emoji2, emoji3, colors, config = {}, subtitle = '🎄 С Новым Годом!') {
        // Цвета для кружков эмодзи (новогодние цвета)
        const circleColors = ['#ff0000', '#00ff00', '#ffff00'];
        const trunkColor = '#8B4513';
        
        // Флаг новогодней темы (нужен для бенгальского огня и подписи)
        const isNewYearTheme = currentSVGTheme === 'newyear';

        // Детальная гирлянда ОБВИВАЮЩАЯ елку
        function generateGarland() {
            let garlandHTML = '';
            const lightColors = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff66cc', '#66ff66'];
            
            // Спиральная гирлянда вокруг елки
            const centerX = 380; // Центр елки
            const centerY = 110; // Центр елки по вертикали (ПРИПОДНЯТА)
            const turns = 3.5;
            const maxRadius = 55;
            const points = 36;
            
            for (let i = 0; i < points; i++) {
                const progress = i / points;
                const angle = progress * Math.PI * 2 * turns;
                const radius = maxRadius * (1 - progress * 0.4);
                
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius - 10;
                
                if (y > 20 && y < 160) {
                    const color = lightColors[i % lightColors.length];
                    const delay = i * 0.15;
                    const size = 2 + Math.random() * 1.5;
                    const pulseDuration = 1.2 + Math.random() * 1;
                    
                    garlandHTML += `
                        <circle cx="${x}" cy="${y}" r="${size}" fill="${color}" filter="url(#lightGlow)">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="${pulseDuration}s" repeatCount="indefinite" begin="${delay}s"/>
                            <animate attributeName="r" values="${size};${size * 1.4};${size}" dur="${pulseDuration * 1.5}s" repeatCount="indefinite" begin="${delay}s"/>
                        </circle>
                    `;
                }
            }
            
            return garlandHTML;
        }

        const snowmanHTML = `
            <!-- Большой снеговик (ЛЕВЕЕ) с красивым бенгальским огнем -->
            <g transform="translate(250, 160)">
                <!-- Нижний шар (самый большой) -->
                <circle cx="0" cy="35" r="28" fill="white" opacity="0.97" filter="url(#snowShadow)">
                    <animate attributeName="cy" values="35;37;35" dur="4s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Средний шар -->
                <circle cx="0" cy="5" r="22" fill="white" opacity="0.97" filter="url(#snowShadow)">
                    <animate attributeName="cy" values="5;7;5" dur="4s" repeatCount="indefinite" begin="0.3s"/>
                </circle>
                
                <!-- Голова -->
                <circle cx="0" cy="-18" r="16" fill="white" opacity="0.97" filter="url(#snowShadow)">
                    <animate attributeName="cy" values="-18;-16;-18" dur="4s" repeatCount="indefinite" begin="0.6s"/>
                </circle>
                
                <!-- Глаза -->
                <circle cx="-4" cy="-18" r="2.5" fill="black"/>
                <circle cx="4" cy="-18" r="2.5" fill="black"/>
                
                <!-- Нос (морковка) -->
                <polygon points="0,-16 7,-14.5 0,-13" fill="#ff7518"/>
                
                <!-- Рот (улыбка) -->
                <path d="M-5,-13 Q0,-10 5,-13" stroke="black" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                
                <!-- Пуговицы -->
                <circle cx="0" cy="8" r="3.5" fill="black">
                    <animate attributeName="r" values="3.5;4;3.5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="0" cy="20" r="3.5" fill="black">
                    <animate attributeName="r" values="3.5;4;3.5" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
                </circle>
                
                <!-- Руки -->
                <g>
                    <!-- Левая рука (с веточкой) -->
                    <line x1="-22" y1="5" x2="-40" y2="15" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
                    <line x1="-40" y1="15" x2="-44" y2="10" stroke="#8B4513" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="-40" y1="15" x2="-44" y2="20" stroke="#8B4513" stroke-width="2.5" stroke-linecap="round"/>
                    
                    <!-- Правая рука -->
                    <line x1="22" y1="5" x2="40" y2="15" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
                    
                    ${isNewYearTheme ? `
                        <!-- КРАСИВЫЙ БЕНГАЛЬСКИЙ ОГОНЬ -->
                        <g transform="translate(40, 15)">
                            <!-- Палочка -->
                            <line x1="0" y1="0" x2="25" y2="-20" stroke="#8B4513" stroke-width="3.5" stroke-linecap="round"/>
                            
                            <!-- Основа огня с градиентом -->
                            <circle cx="25" cy="-20" r="6" fill="url(#bengalGradient)" opacity="0.95">
                                <animate attributeName="r" values="6;7;6" dur="0.7s" repeatCount="indefinite"/>
                            </circle>
                            
                            <!-- Основное пламя (динамичное) -->
                            <path d="M25,-20 Q30,-28 35,-25 Q40,-22 35,-18 Q30,-14 25,-20" 
                                fill="url(#flameGradient)" opacity="0.9">
                                <animate attributeName="d" 
                                        values="M25,-20 Q30,-28 35,-25 Q40,-22 35,-18 Q30,-14 25,-20;
                                                M25,-20 Q30,-30 38,-26 Q44,-20 35,-15 Q26,-10 25,-20;
                                                M25,-20 Q30,-28 35,-25 Q40,-22 35,-18 Q30,-14 25,-20"
                                        dur="0.8s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.9;1;0.9" dur="0.8s" repeatCount="indefinite"/>
                            </path>
                            
                            <!-- Яркое ядро -->
                            <circle cx="26" cy="-19" r="2" fill="#FFFF00" opacity="0.9">
                                <animate attributeName="r" values="2;2.5;2" dur="0.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite"/>
                            </circle>
                            
                            <!-- Искры, летящие вверх (более много) -->
                            ${Array.from({length: 8}).map((_, i) => {
                                const angle = -Math.PI/2 + (Math.random() - 0.5) * 0.8;
                                const distance = 15 + Math.random() * 10;
                                const sparkX = 25 + Math.cos(angle) * distance;
                                const sparkY = -20 + Math.sin(angle) * distance;
                                const duration = 0.6 + Math.random() * 0.4;
                                const delay = i * 0.1;
                                const size = 0.5 + Math.random() * 0.7;
                                const colors = ['#FFFF00', '#FFA500', '#FF4500', '#FFD700'];
                                const color = colors[i % colors.length];
                                
                                return `
                                    <circle cx="25" cy="-20" r="${size}" fill="${color}" opacity="0">
                                        <animate attributeName="cx" 
                                                values="25;${sparkX}" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                        <animate attributeName="cy" 
                                                values="-20;${sparkY}" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                        <animate attributeName="opacity" 
                                                values="0;0.8;0" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                        <animate attributeName="r" 
                                                values="${size};${size * 0.5};0" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                    </circle>
                                `;
                            }).join('')}
                            
                            <!-- Падающие искры (по дуге) -->
                            ${Array.from({length: 6}).map((_, i) => {
                                const angle = Math.PI/4 + (Math.random() - 0.5) * 0.5;
                                const distance = 12 + Math.random() * 8;
                                const sparkX = 25 + Math.cos(angle) * distance;
                                const sparkY = -20 + Math.sin(angle) * distance;
                                const duration = 0.8 + Math.random() * 0.3;
                                const delay = i * 0.15;
                                const size = 0.3 + Math.random() * 0.4;
                                const colors = ['#FFA500', '#FF6347', '#FF4500'];
                                const color = colors[i % colors.length];
                                
                                return `
                                    <circle cx="25" cy="-20" r="${size}" fill="${color}" opacity="0">
                                        <animate attributeName="cx" 
                                                values="25;${sparkX}" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                        <animate attributeName="cy" 
                                                values="-20;${sparkY}" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                        <animate attributeName="opacity" 
                                                values="0;0.6;0" 
                                                dur="${duration}s" 
                                                repeatCount="indefinite" 
                                                begin="${delay}s"/>
                                    </circle>
                                `;
                            }).join('')}
                            
                            <!-- Свечение -->
                            <circle cx="25" cy="-20" r="15" fill="url(#glowGradient)" opacity="0.2">
                                <animate attributeName="r" values="15;18;15" dur="1s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.2;0.3;0.2" dur="1s" repeatCount="indefinite"/>
                            </circle>
                            
                            <!-- Дымок -->
                            <circle cx="27" cy="-18" r="3" fill="#888888" opacity="0">
                                <animate attributeName="r" values="3;8;12" dur="2s" repeatCount="indefinite"/>
                                <animate attributeName="cy" values="-18;-23;-28" dur="2s" repeatCount="indefinite"/>
                                <animate attributeName="cx" values="27;30;33" dur="2s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0;0.3;0" dur="2s" repeatCount="indefinite"/>
                            </circle>
                        </g>
                    ` : ''}
                </g>
                
                <!-- Шарфик -->
                <rect x="-16" y="-5" width="32" height="5" fill="#FF0000" rx="2.5"/>
                <rect x="10" y="-5" width="20" height="5" fill="#FF0000" rx="2.5" transform="rotate(25 10 -5)"/>
                
                <!-- Шапка с помпоном -->
                <rect x="-14" y="-38" width="28" height="10" fill="#8B0000" rx="6"/>
                <rect x="-10" y="-41" width="20" height="3" fill="#8B0000" rx="1.5"/>
                <circle cx="0" cy="-41" r="7" fill="#8B0000"/>
                <circle cx="0" cy="-46" r="5" fill="white" opacity="0.95">
                    <animate attributeName="r" values="5;5.5;5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
            </g>
        `;


        // Большая детальная елка (ПРИПОДНЯТА)
        const bigTreeHTML = `
            <!-- Большая детальная елка (ПРИПОДНЯТА) -->
            <g transform="translate(380, 70)">
                <!-- Толстый ствол -->
                <rect x="-14" y="110" width="28" height="50" fill="${trunkColor}" rx="3"/>
                <rect x="-11" y="110" width="22" height="8" fill="#A0522D" rx="2"/>
                
                <!-- Многослойная елка -->
                <!-- Слой 1: Самый нижний и широкий -->
                <polygon points="0,90 70,120 -70,120" fill="#1B5E20" opacity="0.95"/>
                <polygon points="0,85 65,115 -65,115" fill="#2E7D32" opacity="0.95"/>
                
                <!-- Слой 2 -->
                <polygon points="0,70 60,100 -60,100" fill="#1B5E20" opacity="0.9"/>
                <polygon points="0,65 55,95 -55,95" fill="#2E7D32" opacity="0.9"/>
                
                <!-- Слой 3 -->
                <polygon points="0,50 50,80 -50,80" fill="#1B5E20" opacity="0.9"/>
                <polygon points="0,45 45,75 -45,75" fill="#388E3C" opacity="0.9"/>
                
                <!-- Слой 4 -->
                <polygon points="0,30 40,60 -40,60" fill="#2E7D32" opacity="0.85"/>
                <polygon points="0,25 35,55 -35,55" fill="#388E3C" opacity="0.85"/>
                
                <!-- Слой 5 -->
                <polygon points="0,10 30,40 -30,40" fill="#1B5E20" opacity="0.8"/>
                <polygon points="0,5 25,35 -25,35" fill="#4CAF50" opacity="0.8"/>
                
                <!-- Слой 6: Верхние ветки -->
                <polygon points="0,-10 20,20 -20,20" fill="#2E7D32" opacity="0.75"/>
                <polygon points="0,-15 15,15 -15,15" fill="#4CAF50" opacity="0.75"/>
                
                <!-- Верхушка -->
                <polygon points="0,-30 12,0 -12,0" fill="#388E3C" opacity="0.7"/>
                
                <!-- Снег на ветках -->
                <circle cx="-35" cy="95" r="2.2" fill="white" opacity="0.9"/>
                <circle cx="-25" cy="75" r="1.8" fill="white" opacity="0.8"/>
                <circle cx="30" cy="55" r="2.5" fill="white" opacity="0.9"/>
                <circle cx="15" cy="35" r="1.8" fill="white" opacity="0.8"/>
                <circle cx="-10" cy="15" r="2.2" fill="white" opacity="0.9"/>
                
                <!-- Звезда на макушке -->
                <g>
                    <!-- Внешние лучи -->
                    <polygon points="0,-42 4,-35 12,-35 6,-25 9,-18 0,-22 -9,-18 -6,-25 -12,-35 -4,-35" 
                            fill="#ffd700" filter="url(#starGlow)">
                        <animate attributeName="fill" values="#ffd700;#ffff00;#ffd700" dur="2s" repeatCount="indefinite"/>
                    </polygon>
                    <!-- Внутренняя часть -->
                    <polygon points="0,-33 5,-27 0,-22 -5,-27" fill="#ffcc00" opacity="0.9">
                        <animate attributeName="fill" values="#ffcc00;#fffacd;#ffcc00" dur="1.5s" repeatCount="indefinite"/>
                    </polygon>
                    <!-- Блик -->
                    <circle cx="-1.5" cy="-25" r="0.8" fill="white" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </g>
                
                <!-- Декоративные элементы на елке -->
                <circle cx="20" cy="100" r="3.5" fill="#ff3333" opacity="0.9">
                    <animate attributeName="r" values="3.5;4.2;3.5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="-30" cy="70" r="3" fill="#33ff33" opacity="0.9">
                    <animate attributeName="r" values="3;3.8;3" dur="1.8s" repeatCount="indefinite" begin="0.3s"/>
                </circle>
                <circle cx="10" cy="45" r="3.5" fill="#ffff33" opacity="0.9">
                    <animate attributeName="r" values="3.5;4.2;3.5" dur="2s" repeatCount="indefinite" begin="0.6s"/>
                </circle>
                <circle cx="-15" cy="25" r="2.8" fill="#ff33ff" opacity="0.9">
                    <animate attributeName="r" values="2.8;3.5;2.8" dur="1.7s" repeatCount="indefinite" begin="0.9s"/>
                </circle>
                
                <!-- Гирлянда обвивающая елку -->
                ${generateGarland()}
            </g>
        `;

        // Подарки ПРЯМО ПОД елкой (ПОНИЖЕ и ПОМЕНЬШЕ)
        const giftsHTML = `
            <!-- Подарки под елкой (пониже и поменьше) -->
            <g transform="translate(350, 215)">
                <!-- Красный подарок -->
                <g>
                    <rect x="-45" y="0" width="35" height="25" fill="#ff3333" rx="4"/>
                    <rect x="-39" y="5" width="23" height="15" fill="rgba(255,255,255,0.15)" rx="2.5"/>
                    <!-- Золотые ленты -->
                    <rect x="-27.5" y="0" width="3" height="25" fill="#ffcc00"/>
                    <rect x="-45" y="12.5" width="35" height="3" fill="#ffcc00"/>
                    <!-- Бант -->
                    <polygon points="-29,0 -26,0 -27.5,8" fill="#ffcc00" opacity="0.9"/>
                </g>
                
                <!-- Зеленый подарок -->
                <g>
                    <rect x="0" y="-5" width="40" height="30" fill="#33cc33" rx="5"/>
                    <rect x="6" y="2" width="28" height="18" fill="rgba(255,255,255,0.15)" rx="3.5"/>
                    <!-- Серебряные ленты -->
                    <rect x="20" y="-5" width="3" height="30" fill="#cccccc"/>
                    <rect x="0" y="10" width="40" height="3" fill="#cccccc"/>
                    <!-- Бант -->
                    <polygon points="21.5,-5 23.5,-5 20,7" fill="#cccccc" opacity="0.9"/>
                </g>
                
                <!-- Синий подарок -->
                <g>
                    <rect x="50" y="-2" width="30" height="27" fill="#3366ff" rx="4"/>
                    <rect x="56" y="4" width="18" height="15" fill="rgba(255,255,255,0.15)" rx="2.5"/>
                    <!-- Фиолетовые ленты -->
                    <rect x="65" y="-2" width="3" height="27" fill="#cc66ff"/>
                    <rect x="50" y="11.5" width="30" height="3" fill="#cc66ff"/>
                    <!-- Бант -->
                    <polygon points="66.5,-2 68.5,-2 65,10" fill="#cc66ff" opacity="0.9"/>
                </g>
            </g>
        `;

        // Снежинки
        const snowflakesHTML = Array.from({length: 45}).map((_, i) => {
            const x = Math.random() * 500;
            const startY = -20;
            const endY = 270;
            const duration = 3 + Math.random() * 4;
            const delay = Math.random() * 3;
            const size = 0.4 + Math.random() * 1;
            const sway = (Math.random() - 0.5) * 50;
            const opacity = 0.4 + Math.random() * 0.3;
            
            return `
                <circle cx="${x}" cy="${startY}" r="${size}" fill="white" opacity="${opacity}">
                    <animate attributeName="cy" values="${startY};${endY}" 
                            dur="${duration}s" repeatCount="indefinite" begin="${delay}s"/>
                    <animate attributeName="cx" values="${x};${x + sway}" 
                            dur="${duration * 2}s" repeatCount="indefinite" begin="${delay}s"/>
                </circle>
            `;
        }).join('');

        return `
    <svg width="100%" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
        <defs>

            <!-- Градиенты для бенгальского огня -->
            <linearGradient id="bengalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFF00"/>
                <stop offset="50%" stop-color="#FFA500"/>
                <stop offset="100%" stop-color="#FF4500"/>
            </linearGradient>
            
            <radialGradient id="flameGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFFF00" stop-opacity="0.9"/>
                <stop offset="70%" stop-color="#FFA500" stop-opacity="0.7"/>
                <stop offset="100%" stop-color="#FF4500" stop-opacity="0.4"/>
            </radialGradient>
            
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFFF00" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#FF4500" stop-opacity="0"/>
            </radialGradient>

            <!-- Фоновый градиент -->
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a1e28"/>
                <stop offset="50%" stop-color="#0a2e38"/>
                <stop offset="100%" stop-color="#05222a"/>
            </linearGradient>
            
            <!-- Клип-пат -->
            <clipPath id="cardClip">
                <rect width="500" height="250" rx="12" ry="12"/>
            </clipPath>
            
            <!-- Фильтры -->
            <filter id="lightGlow">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            
            <filter id="starGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            
            <filter id="snowShadow">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.2)" flood-opacity="0.3"/>
            </filter>
            
            <!-- Градиент для текста -->
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#e6f7ff"/>
            </linearGradient>
        </defs>
        
        <g clip-path="url(#cardClip)">
            <!-- Фон -->
            <rect width="500" height="250" fill="url(#bgGradient)" rx="12" ry="12"/>
                        
            <!-- Звезды на небе -->
            ${Array.from({length: 20}).map((_, i) => {
                const x = Math.random() * 500;
                const y = Math.random() * 80;
                const size = 0.4 + Math.random() * 0.7;
                const opacity = 0.3 + Math.random() * 0.4;
                const delay = Math.random() * 4;
                
                return `
                    <circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}">
                        <animate attributeName="opacity" values="${opacity};${opacity * 2};${opacity}" 
                                dur="${2 + Math.random() * 2}s" repeatCount="indefinite" begin="${delay}s"/>
                    </circle>
                `;
            }).join('')}
            
            <!-- Большая детальная елка (приподнята) -->
            ${bigTreeHTML}
            
            <!-- Подарки под елкой (пониже и поменьше) -->
            ${giftsHTML}
            
            <!-- Снеговик (левее) -->
            ${snowmanHTML}
            
            <!-- Снежинки -->
            ${snowflakesHTML}
            
            <!-- Текст пользователя -->
            <text x="30" y="60" font-family="'Arial', sans-serif" font-size="28" font-weight="bold" 
                fill="url(#textGradient)" style="text-shadow: 0 2px 6px rgba(0,0,0,0.6);">${username}</text>
            <text x="30" y="95" font-family="'Arial', sans-serif" font-size="16" 
                fill="url(#textGradient)" opacity="0.9" style="text-shadow: 0 1px 4px rgba(0,0,0,0.5);">${bio}</text>
            
            <!-- Круги с эмодзи -->
            <g transform="translate(30, 140)">
                ${emoji1 ? `
                    <g>
                        <circle cx="25" cy="25" r="20" fill="${circleColors[0]}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white"
                            style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${emoji1}</text>
                    </g>
                ` : ''}
                
                ${emoji2 ? `
                    <g transform="translate(70, 0)">
                        <circle cx="25" cy="25" r="20" fill="${circleColors[1]}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white"
                            style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${emoji2}</text>
                    </g>
                ` : ''}
                
                ${emoji3 ? `
                    <g transform="translate(140, 0)">
                        <circle cx="25" cy="25" r="20" fill="${circleColors[2]}" opacity="0.9">
                            <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" begin="1s"/>
                        </circle>
                        <text x="25" y="32" text-anchor="middle" font-family="Arial" font-size="14" fill="white"
                            style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${emoji3}</text>
                    </g>
                ` : ''}
            </g>
            
            <!-- Сугроб -->
            <path d="M0,220 Q125,210 250,220 T500,220 L500,250 L0,250 Z" fill="white" opacity="0.2"/>
        </g>
        
        <!-- Подпись -->
            <text x="250" y="240" text-anchor="middle" font-family="'Arial', sans-serif" font-size="12" 
                fill="white" opacity="0.8" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
                ${subtitle}
            </text>
    </svg>`;
    }

    // Цвета для тем сайта
    const siteThemeColors = {
        dark: { bg: '#0d1117', panel: '#161b22', border: '#30363d', text: '#f0f6fc', text2: '#8b949e', accent: '#1f6feb', accentGreen: '#238636' },
        light: { bg: '#f6f8fa', panel: '#ffffff', border: '#d0d7de', text: '#1f2328', text2: '#656d76', accent: '#0969da', accentGreen: '#1a7f37' },
        halloween: { bg: '#1a0f0f', panel: '#2a1515', border: '#ff7518', text: '#ff8c42', text2: '#ffa766', accent: '#ff7518', accentGreen: '#d35400' },
        ocean: { bg: '#0a192f', panel: '#112240', border: '#64ffda', text: '#ccd6f6', text2: '#8892b0', accent: '#64ffda', accentGreen: '#00b894' },
        midnight: { bg: '#0a0e17', panel: '#151a2d', border: '#2a3b6d', text: '#e6e8ff', text2: '#8b9bdd', accent: '#6d8eff', accentGreen: '#27ae60' },
        forest: { bg: '#0d1f12', panel: '#1a3320', border: '#2d8b57', text: '#d4f7dc', text2: '#7bc096', accent: '#38a169', accentGreen: '#2d8b57' },
        sunset: { bg: '#2d1b3d', panel: '#45295f', border: '#ff6b6b', text: '#ffd6d6', text2: '#ffa8a8', accent: '#ff6b6b', accentGreen: '#ff9a76' },
        coffee: { bg: '#3a2615', panel: '#523621', border: '#8b4513', text: '#f5e6d3', text2: '#d2b48c', accent: '#8b4513', accentGreen: '#a0522d' },
        cyberpunk: { bg: '#0a0a0a', panel: '#1a1a2e', border: '#00ff9d', text: '#00ff9d', text2: '#00cc7a', accent: '#ff00ff', accentGreen: '#00ff9d' },
        rose: { bg: '#2d1a2d', panel: '#452945', border: '#ff66b2', text: '#ffd6e7', text2: '#ff99cc', accent: '#ff66b2', accentGreen: '#ff3385' },
        arctic: { bg: '#0c2d48', panel: '#1e4d70', border: '#64d8ff', text: '#e6f7ff', text2: '#99e0ff', accent: '#64d8ff', accentGreen: '#00b7eb' },
        desert: { bg: '#2d1a12', panel: '#4a2c1d', border: '#d4a574', text: '#f5e6d3', text2: '#d2b48c', accent: '#d4a574', accentGreen: '#b38b5d' },
        matrix: { bg: '#001100', panel: '#002200', border: '#00ff00', text: '#00ff00', text2: '#00cc00', accent: '#00ff00', accentGreen: '#00cc00' },
        lavender: { bg: '#2d1a4d', panel: '#452973', border: '#b19cd9', text: '#f0e6ff', text2: '#d9c9ff', accent: '#b19cd9', accentGreen: '#9b87c5' },
        newyear: { bg: '#0a1e28', panel: '#05222a', border: '#ff6b6b', text: '#ffffff', text2: '#ffcc00', accent: '#ff6b6b', accentGreen: '#27ae60' }
    };
    
    // ===== ТЕМЫ SVG =====
    const svgThemes = {
        dark: { name: 'Тёмная', bg1: '#2b2d42', bg2: '#121420', text: '#f8f9fa', accent: '#1f6feb', shadow: '#1f6feb', emoji: '🌙' },
        light: { name: 'Светлая', bg1: '#f6f8fa', bg2: '#ffffff', text: '#1f2328', accent: '#0969da', shadow: '#0969da', emoji: '☀️' },
        halloween: { name: 'Halloween', bg1: '#000000', bg2: '#610000', text: '#ff7518', accent: '#ff8c42', shadow: '#ff7518', emoji: '🎃' },
        ocean: { name: 'Ocean', bg1: '#1a2980', bg2: '#26d0ce', text: '#ffffff', accent: '#4cc9f0', shadow: '#1a2980', emoji: '🌊' },
        midnight: { name: 'Полночь', bg1: '#0a0e17', bg2: '#151a2d', text: '#e6e8ff', accent: '#6d8eff', shadow: '#6d8eff', emoji: '🌌' },
        forest: { name: 'Лесная', bg1: '#1a3c2e', bg2: '#0d1f17', text: '#d4edda', accent: '#38a169', shadow: '#38a169', emoji: '🌲' },
        sunset: { name: 'Закат', bg1: '#ff6b6b', bg2: '#4a235a', text: '#fff5f5', accent: '#ff9a76', shadow: '#ff6b6b', emoji: '🌅' },
        coffee: { name: 'Кофе', bg1: '#3a2615', bg2: '#523621', text: '#f5e6d3', accent: '#8b4513', shadow: '#8b4513', emoji: '☕' },
        cyberpunk: { name: 'Киберпанк', bg1: '#0a0a0a', bg2: '#1a1a2e', text: '#00ff9d', accent: '#ff00ff', shadow: '#ff00ff', emoji: '🤖' },
        rose: { name: 'Розовая', bg1: '#ffd6e7', bg2: '#ff99cc', text: '#8b2252', accent: '#ff66b2', shadow: '#ff66b2', emoji: '🌹' },
        arctic: { name: 'Арктика', bg1: '#0c2d48', bg2: '#1e4d70', text: '#e6f7ff', accent: '#64d8ff', shadow: '#64d8ff', emoji: '❄️' },
        desert: { name: 'Пустыня', bg1: '#f4e7d3', bg2: '#d4a574', text: '#5d4037', accent: '#a0522d', shadow: '#a0522d', emoji: '🏜️' },
        matrix: { name: 'Матрица', bg1: '#001100', bg2: '#003300', text: '#00ff00', accent: '#00ff00', shadow: '#00ff00', emoji: '💚' },
        lavender: { name: 'Лаванда', bg1: '#e6e6ff', bg2: '#d6c6ff', text: '#4a235a', accent: '#9d65c9', shadow: '#9d65c9', emoji: '🪻' },
        github: { name: 'GitHub', bg1: '#0d1117', bg2: '#161b22', text: '#f0f6fc', accent: '#58a6ff', shadow: '#58a6ff', emoji: '🐙' },
        rainbow: { name: 'Радуга', bg1: '#667eea', bg2: '#764ba2', text: '#ffffff', accent: '#f093fb', shadow: '#f5576c', emoji: '🌈' },
        candy: { name: 'Конфетная', bg1: '#ff9a9e', bg2: '#fad0c4', text: '#4a235a', accent: '#a569bd', shadow: '#a569bd', emoji: '🍬' },
        space: { name: 'Космос', bg1: '#000428', bg2: '#004e92', text: '#ffffff', accent: '#ffcc00', shadow: '#ffcc00', emoji: '🚀' },
        vintage: { name: 'Винтаж', bg1: '#3e2723', bg2: '#5d4037', text: '#d7ccc8', accent: '#8d6e63', shadow: '#8d6e63', emoji: '📜' },
        pastel: { name: 'Пастель', bg1: '#ffd6e7', bg2: '#c2f0fc', text: '#5d4037', accent: '#ff9a9e', shadow: '#a569bd', emoji: '🎀' },
        galaxy: { name: 'Галактика', bg1: '#0c0e2e', bg2: '#2d1b69', text: '#e6e6ff', accent: '#9d65ff', shadow: '#ff6b9d', emoji: '🌌' },
        nord: { name: 'Nord', bg1: '#2e3440', bg2: '#3b4252', text: '#d8dee9', accent: '#88c0d0', shadow: '#81a1c1', emoji: '🏔️' },
        dracula: { name: 'Dracula', bg1: '#282a36', bg2: '#44475a', text: '#f8f8f2', accent: '#bd93f9', shadow: '#ff79c6', emoji: '🧛' },
        solarized: { name: 'Solarized', bg1: '#002b36', bg2: '#073642', text: '#839496', accent: '#2aa198', shadow: '#268bd2', emoji: '☀️' },
        purpleneon: { name: 'Фиолетовый Неон', bg1: '#0a0a0a', bg2: '#1a1a2e', text: '#e6f7ff', accent: '#9d4edd', shadow: '#00bbf9', emoji: '🔮' },
        neon: { name: 'Неон', bg1: '#000000', bg2: '#000000', text: '#ff1493', accent: '#00ff7f', shadow: '#1e90ff', emoji: '⚡' },
        newyear: { name: 'Новый Год', bg1: '#0a2e38', bg2: '#05222a', text: '#ffffff', accent: '#ff6b6b', shadow: '#ffcc00', emoji: '🎄' },
    };

    // ===== ИНИЦИАЛИЗАЦИЯ ТЕМ САЙТА =====
    function initSiteThemes() {
        // Загружаем сохраненную тему сайта
        const savedTheme = localStorage.getItem('siteTheme');
        if (savedTheme && siteThemeColors[savedTheme]) {
            currentSiteTheme = savedTheme;
            console.log('📁 Загружена сохраненная тема:', savedTheme);
            setSiteTheme(savedTheme);
        } else {
            // По умолчанию - темная тема
            currentSiteTheme = 'dark';
            setSiteTheme('dark');
        }
        
        // Создаем HTML для кнопок тем
        let buttonsHTML = siteThemes.map(theme => {
            const isActive = theme.id === currentSiteTheme;
            return `
                <button class="site-theme-btn ${isActive ? 'active' : ''}" 
                        data-theme="${theme.id}"
                        title="${theme.name}">
                    <span class="theme-emoji-small">${theme.emoji}</span>
                    ${theme.name}
                </button>
            `;
        }).join('');
        
        // Вставляем кнопки в контейнер
        const themeButtonsContainer = document.querySelector('.theme-switcher-buttons');
        if (themeButtonsContainer) {
            themeButtonsContainer.innerHTML = buttonsHTML;
        }
        
        // Обработчики кликов для кнопок тем
        document.querySelectorAll('.site-theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const themeId = this.dataset.theme;
                console.log('🎨 Выбрана тема:', themeId);
                setSiteTheme(themeId);
                
                // Сохраняем состояние в localStorage
                localStorage.setItem('siteTheme', themeId);
                
                // Показываем уведомление
                const themeName = this.textContent.trim();
                showNotification(`Тема "${themeName}" применена`, 'success');
            });
        });
        
        // Обработчик для кнопки раскрытия/скрытия панели тем
        const toggleThemeBtn = document.getElementById('toggleThemeSwitcher');
        if (toggleThemeBtn) {
            toggleThemeBtn.addEventListener('click', function() {
                const container = document.querySelector('.theme-buttons-container');
                const themeSwitcher = this.closest('.compact-theme-switcher');
                
                if (container) {
                    container.classList.toggle('collapsed');
                    this.classList.toggle('expanded');
                    
                    // Обновляем текст кнопки
                    const span = this.querySelector('span');
                    span.textContent = this.classList.contains('expanded') ? 'Скрыть темы сайта' : 'Сменить тему сайта';
                    
                    // Обновляем видимость кнопки снега
                    console.log('🔄 Обновляем видимость снега после переключения панели');
                    setTimeout(updateSnowVisibility, 100);
                }
            });
        }
    }
        
    
    function setSiteTheme(themeId) {
        currentSiteTheme = themeId;
        const colors = siteThemeColors[themeId];
        
        // Применяем CSS переменные
        document.documentElement.style.setProperty('--bg-color', colors.bg);
        document.documentElement.style.setProperty('--panel-bg', colors.panel);
        document.documentElement.style.setProperty('--border-color', colors.border);
        document.documentElement.style.setProperty('--text-primary', colors.text);
        document.documentElement.style.setProperty('--text-secondary', colors.text2);
        document.documentElement.style.setProperty('--accent', colors.accent);
        document.documentElement.style.setProperty('--accent-green', colors.accentGreen);
        
        // Управляем видимостью кнопки снега
        updateSnowVisibility();

        
        // Музыка
        handleThemeMusic(themeId);
        
        // Уведомление для новогодней темы
        if (themeId === 'newyear') {
            setTimeout(() => {
                showNotification('🎄 Новогодняя тема! Появилась пасхалка...', 'info', 3000);
            }, 500);
        }

        // Обновляем активную кнопку темы
        document.querySelectorAll('.site-theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === themeId) {
                btn.classList.add('active');
            }
        });

        // И замените на безопасный вариант:
        const themeButtons = document.querySelectorAll('.site-theme-btn');
        if (themeButtons.length > 0) {
            themeButtons.forEach(btn => {
                if (btn && btn.dataset) {
                    btn.classList.remove('active');
                    if (btn.dataset.theme === themeId) {
                        btn.classList.add('active');
                    }
                }
            });
        }
        
        // Генерируем карточку
        generateCard();
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ ТЕМ SVG =====
    function initSVGThemes() {
        // Загружаем сохраненную SVG тему
        const savedSVGTheme = localStorage.getItem('svgTheme');
        if (savedSVGTheme && svgThemes[savedSVGTheme]) {
            currentSVGTheme = savedSVGTheme;
        }
        
        themeSelector.innerHTML = '';
        
        Object.entries(svgThemes).forEach(([id, theme]) => {
            const btn = document.createElement('button');
            btn.className = `theme-option ${id === currentSVGTheme ? 'active' : ''}`;
            btn.dataset.theme = id;
            btn.innerHTML = `
                <span class="theme-emoji">${theme.emoji}</span>
                ${theme.name}
            `;
            
            // Устанавливаем фон
            btn.style.background = `linear-gradient(135deg, ${theme.bg1}, ${theme.bg2})`;
            
            btn.addEventListener('click', function() {
                currentSVGTheme = id;
                
                // Обновляем активную кнопку
                document.querySelectorAll('.theme-option').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Сохраняем выбор темы
                localStorage.setItem('svgTheme', id);
                
                // Генерируем новую карточку
                generateCard();
                
                // Показываем уведомление
                showNotification(`Тема "${theme.name}" выбрана`, 'info');
            });
            
            themeSelector.appendChild(btn);
        });
        
        // Генерируем карточку с сохраненной темой
        generateCard();
    }
    
    // ===== ГЕНЕРАЦИЯ КАРТОЧКИ =====
    function generateCard() {
        const username = document.getElementById('username').value || 'crystalfire';
        const bio = document.getElementById('bio').value || 'Студент, вайб-кодер';
        const emoji1 = document.getElementById('emoji1').value.trim();
        const emoji2 = document.getElementById('emoji2').value.trim();
        const emoji3 = document.getElementById('emoji3').value.trim();
        const subtitle = document.getElementById('cardSubtitle')?.value || 'Сгенерировано в GitVerse';
        const colors = svgThemes[currentSVGTheme] || svgThemes.dark;

        const emojiData = {
            emoji1: emoji1 || null,  // null если пусто
            emoji2: emoji2 || null,
            emoji3: emoji3 || null
        };

        const subtitleInput = document.getElementById('cardSubtitle');
        if (subtitleInput) {
            subtitleInput.addEventListener('input', generateCard);
        }
        
        // Выбираем функцию генерации
        const styleGenerator = cardStyles[currentCardStyle]?.generate;
        
        if (!styleGenerator) {
            console.error(`Стиль ${currentCardStyle} не найден`);
            return;
        }
        
        // Добавляем настройки анимации
        const animationConfig = animationSettings[currentCardStyle] || {};
        
        // Генерируем карточку с subtitle
        currentSVGCode = styleGenerator(
            escapeXML(username),
            escapeXML(bio),
            emojiData.emoji1,  // Передаем null если пусто
            emojiData.emoji2,
            emojiData.emoji3,
            colors,
            animationConfig,
            escapeXML(subtitle)
        );

        
        // Обновляем предпросмотр
        previewContainer.innerHTML = currentSVGCode;
        
        // Генерируем код для README.md
        const markdownCode = `![${escapeXML(username)} - ${escapeXML(bio)}](./gitverse-card.svg)`;
        generatedCode.textContent = markdownCode;
    }

    // ===== МОДАЛЬНОЕ ОКНО =====
    function showModal() {
        instructionModal.style.display = 'flex';
        setTimeout(() => instructionModal.classList.add('active'), 10);
    }
    
    function closeModal() {
        instructionModal.classList.remove('active');
        setTimeout(() => {
            instructionModal.style.display = 'none';
            if (dontShowAgainCheckbox.checked) {
                localStorage.setItem('svgInstructionShown', 'true');
                hasShownInstruction = true;
            }
        }, 300);
    }
    
    closeModalBtn.addEventListener('click', function() {
        closeModal();
        downloadFile();
    });
    
    modalOkBtn.addEventListener('click', function() {
        closeModal();
        downloadFile();
    });
    
    instructionModal.addEventListener('click', function(e) {
        if (e.target === instructionModal) {
            closeModal();
            downloadFile();
        }
    });
    
    // ===== СКАЧИВАНИЕ =====
    function downloadFile() {
        if (!currentSVGCode) {
            showNotification('Сначала сгенерируйте карточку!', 'warning');
            return;
        }
        
        // Анимация кнопки
        downloadBtn.classList.add('pulsing');
        
        setTimeout(() => {
            // Создаем и скачиваем файл
            const blob = new Blob([currentSVGCode], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gitverse-card.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Показываем галочку
            showCustomCheckmark();
            
            // Снимаем анимацию
            downloadBtn.classList.remove('pulsing');
        }, 100);
    }
    
    downloadBtn.addEventListener('click', function() {
        if (!currentSVGCode) {
            this.style.animation = 'shake 0.5s ease';
            setTimeout(() => this.style.animation = '', 500);
            showNotification('Сначала сгенерируйте карточку!', 'warning');
            return;
        }
        
        const dontShowAgain = localStorage.getItem('svgInstructionShown') === 'true';
        
        if (!dontShowAgain && !hasShownInstruction) {
            showModal();
            hasShownInstruction = true;
        } else {
            downloadFile();
        }
    });
    
    // ===== ГАЛОЧКА =====
    function showCustomCheckmark() {
        const checkmark = document.getElementById('customCheckmark');
        const overlay = document.getElementById('checkmarkOverlay');
        
        checkmark.style.display = 'block';
        overlay.style.display = 'block';
        
        // Плавное появление
        setTimeout(() => {
            checkmark.style.transform = 'translate(-50%, -50%) scale(1)';
            checkmark.style.opacity = '1';
        }, 10);
        
        // Плавное исчезновение через 3 секунды
        setTimeout(() => {
            checkmark.style.transform = 'translate(-50%, -50%) scale(0.8)';
            checkmark.style.opacity = '0';
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                checkmark.style.display = 'none';
                overlay.style.display = 'none';
                overlay.style.opacity = '1';
                // Сбрасываем стили
                checkmark.style.transform = 'translate(-50%, -50%) scale(0)';
                checkmark.style.opacity = '0';
            }, 600);
        }, 2000);
    }
    
    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    function escapeXML(text) {
        return text.replace(/[<>&"']/g, function(c) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c];
        });
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('emoji-btn')) {
            const emoji = e.target.dataset.emoji;
            
            // Копируем эмодзи в буфер обмена
            navigator.clipboard.writeText(emoji).then(() => {
                // Показываем всплывающую подсказку
                showEmojiTooltip(e.target, 'Скопировано!');
                
                // Автоматически вставляем в первое пустое поле
                const emojiInputs = [
                    document.getElementById('emoji1'),
                    document.getElementById('emoji2'), 
                    document.getElementById('emoji3')
                ];
                
                for (let input of emojiInputs) {
                    if (!input.value.trim()) {
                        input.value = emoji;
                        input.dispatchEvent(new Event('input'));
                        break;
                    }
                }
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                showEmojiTooltip(e.target, 'Не удалось скопировать');
            });
        }
    });
    
    function showEmojiTooltip(element, message) {
        // Удаляем старые тултипы
        document.querySelectorAll('.emoji-tooltip').forEach(t => t.remove());
        
        // Создаем тултип
        const tooltip = document.createElement('div');
        tooltip.className = 'emoji-tooltip';
        tooltip.textContent = message;
        
        // Позиционируем
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top + scrollTop - 10}px`;
        tooltip.style.zIndex = '10000';
        
        document.body.appendChild(tooltip);
        
        // Убираем через 1.5 секунды
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        }, 1000);
    }

    // ===== СВОРАЧИВАНИЕ СЕКЦИЙ =====
    // ===== СВОРАЧИВАНИЕ СЕКЦИЙ =====
    function initCollapsibleSections() {
        // Для категорий эмодзи
        document.querySelectorAll('.category-label').forEach(label => {
            label.addEventListener('click', function(e) {
                if (e.target.classList.contains('collapse-toggle')) return;
                
                const categoryHeader = this.closest('.category-header');
                const emojiGroup = categoryHeader.querySelector('.emoji-group');
                const toggleIcon = this.querySelector('.collapse-toggle');
                
                if (emojiGroup) {
                    categoryHeader.classList.toggle('collapsed');
                    emojiGroup.classList.toggle('collapsed');
                    
                    // Обновляем значок
                    if (toggleIcon) {
                        toggleIcon.textContent = emojiGroup.classList.contains('collapsed') ? '+' : '−';
                    }
                    
                    // Сохраняем состояние
                    const categoryName = this.querySelector('i').nextSibling.textContent.trim();
                    localStorage.setItem(`category_${categoryName}`, emojiGroup.classList.contains('collapsed'));
                    
                    // Обновляем глобальное состояние
                    updateGlobalEmojiCollapseState();
                }
            });
            
            // Восстанавливаем состояние
            const categoryHeader = label.closest('.category-header');
            const categoryName = label.querySelector('i').nextSibling.textContent.trim();
            const isCollapsed = localStorage.getItem(`category_${categoryName}`) === 'true';
            
            if (isCollapsed && categoryHeader) {
                categoryHeader.classList.add('collapsed');
                const emojiGroup = categoryHeader.querySelector('.emoji-group');
                if (emojiGroup) emojiGroup.classList.add('collapsed');
                const toggleIcon = label.querySelector('.collapse-toggle');
                if (toggleIcon) toggleIcon.textContent = '+';
            }
        });
        
        // Для секций настроек (кроме текста внизу карточки - он будет обработан отдельно)
        document.querySelectorAll('.section-header').forEach(header => {
            // Пропускаем секцию с текстом внизу карточки - она будет обработана отдельно
            if (header.closest('.collapsible-section')?.querySelector('#cardSubtitle')) {
                return;
            }
            
            header.addEventListener('click', function(e) {
                if (e.target.classList.contains('collapse-toggle')) return;
                
                const section = this.closest('.collapsible-section');
                const content = this.nextElementSibling;
                const toggleIcon = this.querySelector('.collapse-toggle');
                
                if (content && content.classList.contains('section-content')) {
                    section.classList.toggle('collapsed');
                    content.classList.toggle('collapsed');
                    
                    // Обновляем значок
                    if (toggleIcon) {
                        toggleIcon.textContent = content.classList.contains('collapsed') ? '+' : '−';
                    }
                    
                    // Сохраняем состояние
                    const sectionType = this.querySelector('h3').textContent.trim();
                    localStorage.setItem(`section_${sectionType}`, content.classList.contains('collapsed'));
                    
                    // Обновляем глобальное состояние
                    updateGlobalSectionCollapseState();
                }
            });
            
            // Восстанавливаем состояние
            const section = header.closest('.collapsible-section');
            const content = header.nextElementSibling;
            const sectionType = header.querySelector('h3').textContent.trim();
            const isCollapsed = localStorage.getItem(`section_${sectionType}`) === 'true';
            
            if (isCollapsed && content) {
                section.classList.add('collapsed');
                content.classList.add('collapsed');
                const toggleIcon = header.querySelector('.collapse-toggle');
                if (toggleIcon) toggleIcon.textContent = '+';
            }
        });
        
        // ОСОБАЯ ОБРАБОТКА: Текст внизу карточки
        const subtitleSection = document.querySelector('.collapsible-section:has(#cardSubtitle)');
        if (subtitleSection) {
            const subtitleHeader = subtitleSection.querySelector('.section-header');
            const subtitleContent = subtitleSection.querySelector('.section-content');
            const subtitleToggle = subtitleHeader?.querySelector('.collapse-toggle');
            
            if (subtitleHeader && subtitleContent && subtitleToggle) {
                subtitleHeader.addEventListener('click', function(e) {
                    if (e.target.classList.contains('collapse-toggle')) return;
                    
                    subtitleSection.classList.toggle('collapsed');
                    subtitleContent.classList.toggle('collapsed');
                    
                    // Обновляем значок
                    subtitleToggle.textContent = subtitleContent.classList.contains('collapsed') ? '+' : '−';
                    
                    // Сохраняем состояние
                    localStorage.setItem('subtitleSectionCollapsed', subtitleContent.classList.contains('collapsed'));
                });
                
                // Восстанавливаем состояние
                const isCollapsed = localStorage.getItem('subtitleSectionCollapsed') === 'true';
                if (isCollapsed) {
                    subtitleSection.classList.add('collapsed');
                    subtitleContent.classList.add('collapsed');
                    subtitleToggle.textContent = '+';
                } else {
                    subtitleSection.classList.remove('collapsed');
                    subtitleContent.classList.remove('collapsed');
                    subtitleToggle.textContent = '−';
                }
            }
        }
    }
    
    // ===== УПРАВЛЕНИЕ КАТЕГОРИЯМИ ЭМОДЗИ =====
    function initEmojiCollapsibleControls() {
        const collapseAllEmojiBtn = document.getElementById('collapseAllEmojiBtn');
        const expandAllEmojiBtn = document.getElementById('expandAllEmojiBtn');
        
        // Функция для обновления значков категорий эмодзи
        function updateEmojiToggleIcons() {
            document.querySelectorAll('.category-header').forEach(header => {
                const toggleIcon = header.querySelector('.collapse-toggle');
                if (toggleIcon) {
                    toggleIcon.textContent = header.classList.contains('collapsed') ? '+' : '−';
                }
            });
        }
        
        if (collapseAllEmojiBtn) {
            collapseAllEmojiBtn.addEventListener('click', function() {
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.add('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.add('collapsed');
                });
                
                // Обновляем значки
                updateEmojiToggleIcons();
                
                localStorage.setItem('allEmojiCategoriesCollapsed', 'true');
                showNotification('Все категории эмодзи свёрнуты', 'info');
            });
        }
        
        if (expandAllEmojiBtn) {
            expandAllEmojiBtn.addEventListener('click', function() {
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.remove('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.remove('collapsed');
                });
                
                // Обновляем значки
                updateEmojiToggleIcons();
                
                localStorage.removeItem('allEmojiCategoriesCollapsed');
                showNotification('Все категории эмодзи развёрнуты', 'info');
            });
        }
        
        // Восстанавливаем состояние при загрузке
        const allCollapsed = localStorage.getItem('allEmojiCategoriesCollapsed') === 'true';
        if (allCollapsed) {
            setTimeout(() => {
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.add('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.add('collapsed');
                });
                setTimeout(updateEmojiToggleIcons, 150);
            }, 100);
        }
    }
    
    // ===== УПРАВЛЕНИЕ ВСЕМИ СЕКЦИЯМИ =====
    function initSectionControls() {
        const collapseAllSectionsBtn = document.getElementById('collapseAllSectionsBtn');
        const expandAllSectionsBtn = document.getElementById('expandAllSectionsBtn');
        
        // Функция для обновления значков
        function updateSectionToggleIcons() {
            document.querySelectorAll('.collapsible-section').forEach(section => {
                const toggleIcon = section.querySelector('.collapse-toggle');
                const content = section.querySelector('.section-content');
                if (toggleIcon && content) {
                    toggleIcon.textContent = content.classList.contains('collapsed') ? '+' : '−';
                }
            });

            document.querySelectorAll('.category-header').forEach(header => {
                const toggleIcon = header.querySelector('.collapse-toggle');
                const emojiGroup = header.querySelector('.emoji-group');
                if (toggleIcon && emojiGroup) {
                    toggleIcon.textContent = emojiGroup.classList.contains('collapsed') ? '+' : '−';
                }
            });
        }
        
        if (collapseAllSectionsBtn) {
            collapseAllSectionsBtn.addEventListener('click', function() {
                // Сворачиваем ВСЕ секции настроек
                document.querySelectorAll('.collapsible-section').forEach(section => {
                    section.classList.add('collapsed');
                    const content = section.querySelector('.section-content');
                    if (content) content.classList.add('collapsed');
                });
                
                // Сворачиваем ВСЕ категории эмодзи
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.add('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.add('collapsed');
                });
                
                // Обновляем значки
                updateSectionToggleIcons();
                
                // Сохраняем глобальные состояния
                localStorage.setItem('allSectionsCollapsed', 'true');
                localStorage.setItem('allEmojiCategoriesCollapsed', 'true');
                
                showNotification('Все секции свёрнуты', 'info');
            });
        }
        
        if (expandAllSectionsBtn) {
            expandAllSectionsBtn.addEventListener('click', function() {
                // Разворачиваем ВСЕ секции настроек
                document.querySelectorAll('.collapsible-section').forEach(section => {
                    section.classList.remove('collapsed');
                    const content = section.querySelector('.section-content');
                    if (content) content.classList.remove('collapsed');
                });
                
                // Разворачиваем ВСЕ категории эмодзи
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.remove('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.remove('collapsed');
                });
                
                // Обновляем значки
                updateSectionToggleIcons();
                
                // Удаляем глобальные состояния
                localStorage.removeItem('allSectionsCollapsed');
                localStorage.removeItem('allEmojiCategoriesCollapsed');
                
                showNotification('Все секции развёрнуты', 'info');
            });
        }
            
        setTimeout(() => {
            if (localStorage.getItem('allSectionsCollapsed') === 'true') {
                document.querySelectorAll('.collapsible-section').forEach(section => {
                    section.classList.add('collapsed');
                    const content = section.querySelector('.section-content');
                    if (content) content.classList.add('collapsed');
                });
            }
            
            if (localStorage.getItem('allEmojiCategoriesCollapsed') === 'true') {
                document.querySelectorAll('.category-header').forEach(header => {
                    header.classList.add('collapsed');
                    const emojiGroup = header.querySelector('.emoji-group');
                    if (emojiGroup) emojiGroup.classList.add('collapsed');
                });
            }
            
            setTimeout(updateSectionToggleIcons, 150);
        }, 100);
    }
    
    // Вспомогательные функции для глобального состояния
    function updateGlobalEmojiCollapseState() {
        const allGroups = document.querySelectorAll('.emoji-group');
        const collapsedGroups = document.querySelectorAll('.emoji-group.collapsed');
        
        if (allGroups.length === collapsedGroups.length) {
            localStorage.setItem('allEmojiCategoriesCollapsed', 'true');
        } else {
            localStorage.removeItem('allEmojiCategoriesCollapsed');
        }
    }
    
    function updateGlobalSectionCollapseState() {
        const allSections = document.querySelectorAll('.collapsible-section');
        const collapsedSections = document.querySelectorAll('.collapsible-section.collapsed');
        
        if (allSections.length === collapsedSections.length) {
            localStorage.setItem('allSectionsCollapsed', 'true');
        } else {
            localStorage.removeItem('allSectionsCollapsed');
        }
    }

    function initCardStyles() {
        const container = document.getElementById('cardStyleSelector');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.entries(cardStyles).forEach(([id, style]) => {
            const btn = document.createElement('button');
            btn.className = `card-style-option ${id === currentCardStyle ? 'active' : ''}`;
            btn.dataset.style = id;
            btn.innerHTML = `
                <div class="card-style-emoji">${style.emoji}</div>
                <div class="card-style-name">${style.name}</div>
                <div class="card-style-desc">${style.description}</div>
            `;
            
            btn.addEventListener('click', function() {
                currentCardStyle = id;
                
                // Обновляем активную кнопку
                document.querySelectorAll('.card-style-option').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                
                // Генерируем карточку с новым стилем
                generateCard();
                
                showNotification(`Стиль "${style.name}" выбран`, 'info');
            });
            
            container.appendChild(btn);
        });
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    copyBtn.addEventListener('click', function() {
        const code = generatedCode.textContent;
        if (!code || code.includes('Здесь появится')) {
            showNotification('Сначала сгенерируйте карточку!', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Код скопирован!', 'success');
        });
    });
    
    // Проверяем инструкцию
    if (localStorage.getItem('svgInstructionShown') === 'true') {
        hasShownInstruction = true;
    }

    function initAnimationControls() {
        const container = document.getElementById('animationControls');
        const presetsContainer = document.getElementById('animationPresets');
        
        function updateAnimationControls() {
            container.innerHTML = '';
            
            const style = cardStyles[currentCardStyle];
            const styleKey = currentCardStyle;
            
            if (!styleKey || !animationSettings[styleKey]) {
                container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Для этого стиля нет настроек анимации</p>';
                return;
            }
            
            const settings = animationSettings[styleKey];
let controlsHTML = '<div class="animation-controls" style="margin-top: 15px;">';
            
            // Создаем разные контролы для разных стилей
            if (styleKey === 'particles') {
                controlsHTML += `
                    <div class="control-group">
                        <div class="control-label">
                            <span>Количество частиц</span>
                            <span>${getSettingLabel(settings.count)}</span>
                        </div>
                        <div class="slider-container">
                            <input type="range" class="animation-slider" min="1" max="3" step="1" 
                                value="${getSliderValue(settings.count)}" 
                                data-setting="count" data-style="${styleKey}">
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Скорость движения</span>
                            <span>${getSettingLabel(settings.speed)}</span>
                        </div>
                        <div class="slider-container">
                            <input type="range" class="animation-slider" min="1" max="3" step="1" 
                                value="${getSliderValue(settings.speed)}" 
                                data-setting="speed" data-style="${styleKey}">
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Размер частиц</span>
                            <span>${getSettingLabel(settings.size)}</span>
                        </div>
                        <div class="slider-container">
                            <input type="range" class="animation-slider" min="1" max="3" step="1" 
                                value="${getSliderValue(settings.size)}" 
                                data-setting="size" data-style="${styleKey}">
                        </div>
                    </div>
                `;
            } else if (styleKey === 'snow') {
                controlsHTML += `
                    <div class="control-group">
                        <div class="control-label">
                            <span>Количество снежинок</span>
                            <span>${getSettingLabel(settings.count)}</span>
                        </div>
                        <div class="slider-container">
                            <input type="range" class="animation-slider" min="1" max="3" step="1" 
                                value="${getSliderValue(settings.count)}" 
                                data-setting="count" data-style="${styleKey}">
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Скорость падения</span>
                            <span>${getSettingLabel(settings.speed)}</span>
                        </div>
                        <div class="slider-container">
                            <input type="range" class="animation-slider" min="1" max="3" step="1" 
                                value="${getSliderValue(settings.speed)}" 
                                data-setting="speed" data-style="${styleKey}">
                        </div>
                    </div>
                `;
            } else if (styleKey === 'waves') {
                controlsHTML += `
                <div class="control-group">
                    <div class="control-label">
                        <span>Высота волны</span>
                        <span>${getWaveLabel(settings.amplitude)}</span>
                    </div>
                    <div class="slider-container">
                        <input type="range" class="animation-slider" min="1" max="3" step="1" 
                            value="${getSliderValue(settings.amplitude)}" 
                            data-setting="amplitude" data-style="${styleKey}">
                    </div>
                </div>
                <div class="control-group">
                    <div class="control-label">
                        <span>Скорость</span>
                        <span>${getSpeedLabel(settings.speed)}</span>
                    </div>
                    <div class="slider-container">
                        <input type="range" class="animation-slider" min="1" max="3" step="1" 
                            value="${getSliderValue(settings.speed)}" 
                            data-setting="speed" data-style="${styleKey}">
                    </div>
                </div>
            `;
        }
            
            controlsHTML += '</div>';
            container.innerHTML = controlsHTML;
            
            // Добавляем обработчики для слайдеров
            container.querySelectorAll('.animation-slider').forEach(slider => {
                slider.addEventListener('input', function() {
                    const styleKey = this.dataset.style;
                    const setting = this.dataset.setting;
                    const value = getSettingFromSlider(this.value);
                    
                    animationSettings[styleKey][setting] = value;
                    
                    // Обновляем label
                    const label = this.closest('.control-group').querySelector('.control-label span:last-child');
                    label.textContent = getSettingLabel(value);
                    
                    // Перегенерируем карточку
                    generateCard();
                });
            });
        }
        
        // Обработчики для пресетов
        if (presetsContainer) {
            presetsContainer.querySelectorAll('.animation-preset-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const preset = this.dataset.preset;
                    
                    // Убираем активный класс
                    presetsContainer.querySelectorAll('.animation-preset-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Применяем пресет
                    applyAnimationPreset(preset);
                    updateAnimationControls();
                    generateCard();
                });
            });
        }
        
        // Обновляем при смене стиля
        document.querySelectorAll('.card-style-option').forEach(btn => {
            btn.addEventListener('click', function() {
                setTimeout(updateAnimationControls, 100);
            });
        });
        
        updateAnimationControls();
    }

    function getWaveLabel(setting) {
        const labels = { 'low': 'Низкая', 'medium': 'Средняя', 'high': 'Высокая' };
        return labels[setting] || setting;
    }

    function getSpeedLabel(setting) {
        const labels = { 'low': 'Медленно', 'medium': 'Средне', 'high': 'Быстро' };
        return labels[setting] || setting;
    }


    function getSliderValue(setting) {
        const map = { 'low': 1, 'medium': 2, 'high': 3 };
        return map[setting] || 2;
    }

    function getSettingFromSlider(value) {
        const map = { 1: 'low', 2: 'medium', 3: 'high' };
        return map[value] || 'medium';
    }

    function getSettingLabel(setting) {
        const labels = { 'low': 'Мало', 'medium': 'Средне', 'high': 'Много' };
        return labels[setting] || setting;
    }

    function applyAnimationPreset(preset) {
        const styleKey = currentCardStyle;
        if (!animationSettings[styleKey]) return;
        
        const settings = animationSettings[styleKey];
        const presetValues = {
            subtle: 'low',
            medium: 'medium',
            intense: 'high'
        };
        
        const value = presetValues[preset] || 'medium';
        
        // Применяем ко всем настройкам текущего стиля
        Object.keys(settings).forEach(key => {
            settings[key] = value;
        });
    }

    // === АВТОМАТИЧЕСКАЯ ГЕНЕРАЦИЯ ПРИ ИЗМЕНЕНИЯХ ===
    document.getElementById('username').addEventListener('input', generateCard);
    document.getElementById('bio').addEventListener('input', generateCard);
    document.getElementById('emoji1').addEventListener('input', generateCard);
    document.getElementById('emoji2').addEventListener('input', generateCard);
    document.getElementById('emoji3').addEventListener('input', generateCard);
    document.getElementById('cardSubtitle').addEventListener('input', generateCard);
    
    document.addEventListener('change', function(e) {
        if (e.target.closest('.card-style-option')) {
            generateCard();
        }
    });

    function initMusicControls() {
        const musicControls = document.getElementById('musicControls');
        const musicToggleBtn = document.getElementById('musicToggleBtn');
        const musicVolumeSlider = document.getElementById('musicVolumeSlider');
        const musicPrevBtn = document.getElementById('musicPrevBtn');
        const musicNextBtn = document.getElementById('musicNextBtn');
        const musicTrackDisplay = document.getElementById('musicTrackDisplay');
        const closeTrackInfo = document.getElementById('closeTrackInfo');
        const trackItems = document.querySelectorAll('.track-item');
        
        if (!musicControls || !musicToggleBtn) return;
        
        // Загружаем сохраненные настройки
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume && musicVolumeSlider) {
            musicVolume = parseFloat(savedVolume);
            musicVolumeSlider.value = musicVolume * 100;
        }
        
        // ВАЖНО: Загружаем состояние звука и сразу синхронизируем переменную
        const savedMuted = localStorage.getItem('musicMuted');
        if (savedMuted !== null) {
            isMusicMuted = savedMuted === 'true';
        } else {
            // По умолчанию звук ВКЛЮЧЕН
            isMusicMuted = false;
            localStorage.setItem('musicMuted', 'false');
        }
        
        if (musicToggleBtn) {
            if (isMusicMuted) {
                musicToggleBtn.classList.add('muted');
                musicToggleBtn.title = "Включить музыку";
            } else {
                musicToggleBtn.classList.remove('muted');
                musicToggleBtn.title = "Выключить музыку";
            }
        }
        
        const savedTrackIndex = localStorage.getItem('musicTrackIndex');
        if (savedTrackIndex) {
            currentTrackIndex = parseInt(savedTrackIndex) % musicTracks.length;
        }
        updateTrackDisplay();
        
        // Обработчики событий
        musicToggleBtn.addEventListener('click', toggleMusic);
        
        if (musicVolumeSlider) {
            const initialVolume = musicVolumeSlider.value / 100;
            const initialColor = getVolumeColor(initialVolume);
            musicVolumeSlider.style.setProperty('--current-volume-color', initialColor);
            
            // Обработчик для изменения цвета при движении
            musicVolumeSlider.addEventListener('input', function(e) {
                const volume = e.target.value / 100;
                const color = getVolumeColor(volume);
                e.target.style.setProperty('--current-volume-color', color);
            });
        }

        function getVolumeColor(volume) {
            if (volume < 0.25) return '#ff3333';
            if (volume < 0.5) return '#ff9933';
            if (volume < 0.75) return '#ffff33';
            return '#33ff33';
        }
        
        if (musicPrevBtn) {
            musicPrevBtn.addEventListener('click', prevTrack);
        }
        
        if (musicNextBtn) {
            musicNextBtn.addEventListener('click', nextTrack);
        }
        
        // Обработчики для расширяемого окошка
        if (musicTrackDisplay) {
            musicTrackDisplay.addEventListener('click', toggleTrackInfo);
        }
        
        if (closeTrackInfo) {
            closeTrackInfo.addEventListener('click', closeTrackInfoPanel);
        }
        
        // Обработчики для элементов списка треков
        trackItems.forEach(item => {
            item.addEventListener('click', function() {
                const trackIndex = parseInt(this.dataset.track);
                if (trackIndex !== currentTrackIndex) {
                    currentTrackIndex = trackIndex;
                    localStorage.setItem('musicTrackIndex', currentTrackIndex.toString());
                    updateTrackDisplay();
                    playCurrentTrack();
                    updateTrackItems();
                }
            });
        });
        
        // Закрытие по клику вне окошка
        document.addEventListener('click', function(event) {
            const trackFull = document.getElementById('musicTrackFull');
            const trackDisplay = document.getElementById('musicTrackDisplay');
            
            if (trackFull && trackFull.classList.contains('show') && 
                !trackFull.contains(event.target) && 
                !trackDisplay.contains(event.target)) {
                
                // Проверяем, что клик не по кнопке внутри окна
                const clickedElement = event.target;
                const isControlButton = clickedElement.closest('.track-control-btn') || 
                                    clickedElement.closest('.close-track-btn') ||
                                    clickedElement.closest('.track-item');
                
                if (!isControlButton) {
                    closeTrackInfoPanel();
                }
            }
        });
    }

    function addSafeEventListener(element, event, handler) {
        if (!element) return;
        
        // Удаляем старый обработчик (если есть)
        element.removeEventListener(event, handler);
        
        // Добавляем новый
        element.addEventListener(event, handler);
    }


    function toggleTrackInfo() {
        const trackFull = document.getElementById('musicTrackFull');
        const trackDisplay = document.getElementById('musicTrackDisplay');
        
        if (trackFull && trackDisplay) {
            if (trackFull.classList.contains('show')) {
                closeTrackInfoPanel();
            } else {
                openTrackInfoPanel();
            }
        }
    }

    function openTrackInfoPanel() {
        const trackFull = document.getElementById('musicTrackFull');
        const trackDisplay = document.getElementById('musicTrackDisplay');
        const fullTrackName = document.getElementById('fullTrackName');
        
        if (trackFull && trackDisplay && fullTrackName) {
            trackFull.classList.add('show');
            trackDisplay.classList.add('expanded');
            fullTrackName.textContent = musicTracks[currentTrackIndex].fullName;
            updateTrackItems();
            
            // Добавляем класс для блокировки прокрутки фона
            document.body.classList.add('track-info-open');
        }
    }

    function closeTrackInfoPanel() {
        const trackFull = document.getElementById('musicTrackFull');
        const trackDisplay = document.getElementById('musicTrackDisplay');
        
        if (trackFull && trackDisplay) {
            trackFull.classList.remove('show');
            trackDisplay.classList.remove('expanded');
            document.body.classList.remove('track-info-open');
            
            // Убираем все обработчики с кнопок в окне
            const buttons = trackFull.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.replaceWith(btn.cloneNode(true));
            });
        }
    }


    function updateTrackItems() {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const trackIndex = parseInt(item.dataset.track);
            item.classList.toggle('active', trackIndex === currentTrackIndex);
            
            const icon = item.querySelector('i');
            if (icon) {
                icon.className = trackIndex === currentTrackIndex ? 'fas fa-play' : 'fas fa-music';
            }
        });
    }

    function updateTrackDisplay() {
        const currentTrackName = document.getElementById('currentTrackName');
        const fullTrackName = document.getElementById('fullTrackName');
        const musicTrackDisplay = document.getElementById('musicTrackDisplay');
        
        const track = musicTracks[currentTrackIndex];
        
        if (currentTrackName) {
            // Обрезаем слишком длинные названия для компактного отображения
            if (track.name.length > 18) {
                currentTrackName.textContent = track.name.substring(0, 15) + '...';
                if (musicTrackDisplay) {
                    musicTrackDisplay.title = track.name; // Показываем полное название при наведении
                }
            } else {
                currentTrackName.textContent = track.name;
            }
        }
        
        if (fullTrackName) {
            fullTrackName.textContent = track.name;
        }
        
        updateTrackItems();
    }

    function showTrackNotification(track, action = 'Играет') {
        // Сокращаем название для уведомлений
        let shortName = track.name;
        if (shortName.length > 25) {
            shortName = shortName.substring(0, 22) + '...';
        }
        
        showNotification(`🎶 ${action}: ${shortName}`, 'success');
    }



    function toggleMusic() {
        togglePlayPause();
    }

    function changeMusicVolume(event) {
        const volume = event.target.value / 100;
        musicVolume = volume;
        
        // Рассчитываем цвет в зависимости от громкости
        let color;
        if (volume < 0.25) {
            color = '#ff3333'; // Красный
        } else if (volume < 0.5) {
            color = '#ff9933'; // Оранжевый
        } else if (volume < 0.75) {
            color = '#ffff33'; // Желтый
        } else {
            color = '#33ff33'; // Зеленый
        }
        
        // Устанавливаем CSS переменную для цвета границы
        event.target.style.setProperty('--current-volume-color', color);
        
        if (audioPlayer) {
            audioPlayer.volume = volume;
            
            if (volume > 0 && isMusicMuted) {
                isMusicMuted = false;
                localStorage.setItem('musicMuted', 'false');
                const btn = document.getElementById('musicToggleBtn');
                if (btn) {
                    btn.classList.remove('muted');
                    btn.title = "Выключить музыку";
                }
            }
        }
        
        localStorage.setItem('musicVolume', volume.toString());
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
        localStorage.setItem('musicTrackIndex', currentTrackIndex.toString());
        updateTrackDisplay();
        playCurrentTrack();
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
        localStorage.setItem('musicTrackIndex', currentTrackIndex.toString());
        updateTrackDisplay();
        playCurrentTrack();
    }


    function startCurrentTrack() {
        // Останавливаем предыдущую музыку
        stopMusic();
        
        // Создаем аудиоплеер для текущего трека
        const currentTrack = musicTracks[currentTrackIndex];
        audioPlayer = new Audio(currentTrack.url);
        
        // Устанавливаем громкость
        audioPlayer.volume = isMusicMuted ? 0 : musicVolume;
        
        // Зацикливание
        const savedLoop = localStorage.getItem('musicLoop');
        audioPlayer.loop = savedLoop === 'true' || savedLoop === null;
        
        // Обработчики событий
        audioPlayer.addEventListener('error', (e) => {
            console.error('Ошибка загрузки музыки:', e);
            showNotification(`Не удалось загрузить: ${currentTrack.name}`, 'warning');
        });
        
        audioPlayer.addEventListener('loadedmetadata', () => {
            updateTrackTime();
            updateProgress();
        });
        
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('ended', handleTrackEnded);
        
        // Пытаемся воспроизвести
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Сразу обновляем состояние кнопок
                updateProgress();
                
                // Обновляем кнопку повтора
                const fullLoopBtn = document.getElementById('fullLoopBtn');
                if (fullLoopBtn) {
                    fullLoopBtn.classList.toggle('active', audioPlayer.loop);
                    fullLoopBtn.title = audioPlayer.loop ? "Выключить повтор" : "Повторять трек";
                }
                
                showTrackNotification(currentTrack, 'Играет');
                
            }).catch(error => {
                console.log('Автовоспроизведение заблокировано:', error);
                showNotification('▶️ Нажмите на кнопку музыки для запуска', 'info');
                
                // Даже если автовоспроизведение заблокировано, обновляем кнопки
                updateProgress();
            });
        } else {
            // Обновляем кнопки сразу
            updateProgress();
        }

        audioPlayer.addEventListener('play', syncPlayerButtons);
        audioPlayer.addEventListener('pause', syncPlayerButtons);
    }


    function handleTrackEnded() {
        console.log('Трек завершился. Repeat:', audioPlayer.loop);
        
        if (!audioPlayer.loop) {
            // Если повтор выключен, переходим к следующему треку
            setTimeout(() => {
                nextTrack();
            }, 500); // Небольшая пауза перед переходом
        } else {
            // Если повтор включен, трек начнется заново автоматически
            console.log('Повтор включен - трек начнется заново');
        }
    }

    function playCurrentTrack() {
        // Сохраняем состояние повтора перед сменой трека
        let wasLooping = false;
        if (audioPlayer) {
            wasLooping = audioPlayer.loop;
            stopMusic();
        }
        
        startCurrentTrack();
        
        // Восстанавливаем состояние повтора для нового трека
        if (audioPlayer && wasLooping !== undefined) {
            // Через небольшую задержку, чтобы трек успел загрузиться
            setTimeout(() => {
                if (audioPlayer) {
                    audioPlayer.loop = wasLooping;
                    localStorage.setItem('musicLoop', wasLooping.toString());
                    
                    // Обновляем кнопку повтора
                    const fullLoopBtn = document.getElementById('fullLoopBtn');
                    if (fullLoopBtn) {
                        fullLoopBtn.classList.toggle('active', wasLooping);
                        fullLoopBtn.title = wasLooping ? "Выключить повтор" : "Повторять трек";
                    }
                }
            }, 100);
        }
    }

    function togglePlayPause() {
        const mainBtn = document.getElementById('musicToggleBtn');
        const fullBtn = document.getElementById('fullPlayBtn');
        
        if (!audioPlayer) {
            startCurrentTrack();
            return;
        }
        
        if (audioPlayer.paused) {
            // Включаем воспроизведение
            audioPlayer.play().then(() => {
                // Синхронизируем кнопки
                syncPlayerButtons();
                isMusicMuted = false;
                localStorage.setItem('musicMuted', 'false');
                showTrackNotification(musicTracks[currentTrackIndex], 'Включена');
            }).catch(error => {
                console.error('Ошибка воспроизведения:', error);
                showNotification('Не удалось включить музыку', 'warning');
            });
        } else {
            // Выключаем воспроизведение
            audioPlayer.pause();
            // Синхронизируем кнопки
            syncPlayerButtons();
            isMusicMuted = true;
            localStorage.setItem('musicMuted', 'true');
            showNotification('⏸️ Музыка приостановлена', 'info');
        }
    }


    function stopMusic() {
        if (audioPlayer) {
            // Убираем обработчики
            audioPlayer.removeEventListener('ended', handleTrackEnded);
            audioPlayer.removeEventListener('timeupdate', updateProgress);
            audioPlayer.removeEventListener('loadedmetadata', updateTrackTime);
            
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            audioPlayer = null;
            
            const btn = document.getElementById('musicToggleBtn');
            if (btn) {
                btn.classList.remove('active');
                btn.title = "Включить музыку";
            }
        }
    }

    function resetMusicSettings() {
        // Проверяем, есть ли сохраненные настройки
        if (!localStorage.getItem('musicMuted')) {
            localStorage.setItem('musicMuted', 'false');
            localStorage.setItem('musicVolume', '0.3');
            localStorage.setItem('musicTrackIndex', '0');
            localStorage.setItem('musicLoop', 'true'); // По умолчанию повтор включен
        }
    }


    function handleThemeMusic(themeId) {
        const musicControls = document.getElementById('musicControls');
        
        if (themeId === 'newyear') {
            // Показываем элементы управления музыкой
            if (musicControls) {
                musicControls.style.display = 'flex';
                // Показываем анимацию появления
                setTimeout(() => {
                    musicControls.style.opacity = '1';
                    musicControls.style.transform = 'translateY(0)';
                }, 10);
            }
            
            // ВАЖНО: Сбрасываем флаг приглушения при включении новогодней темы
            // Если пользователь только что выбрал новогоднюю тему, скорее всего он хочет музыку
            const savedMuted = localStorage.getItem('musicMuted');
            
            // Если это первый раз или настройки не сохранены, включаем звук
            if (savedMuted === null || savedMuted === 'true') {
                isMusicMuted = false;
                localStorage.setItem('musicMuted', 'false');
            }
            
            // Запускаем музыку с небольшой задержкой
            setTimeout(() => {
                startCurrentTrack();
            }, 500);
            
            // Показываем подсказку
            setTimeout(() => {
                showNotification('🎄 Новогодняя тема включена! Доступно 3 новогодние мелодии', 'info');
            }, 1000);
            
        } else {
            // Скрываем элементы управления музыкой
            if (musicControls) {
                musicControls.style.opacity = '0';
                musicControls.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    musicControls.style.display = 'none';
                }, 300);
            }
            
            // Останавливаем музыку
            stopMusic();
        }
    }


    function initSeekControls() {
        const seekSlider = document.getElementById('trackSeekSlider');
        const fullPlayBtn = document.getElementById('fullPlayBtn');
        const fullPrevBtn = document.getElementById('fullPrevBtn');
        const fullNextBtn = document.getElementById('fullNextBtn');
        const fullLoopBtn = document.getElementById('fullLoopBtn');
        
        if (!seekSlider) return;
        
        // Инициализируем прогресс сразу
        updateProgress();
        
        // Обработчики для слайдера перемотки
        seekSlider.addEventListener('input', function() {
            if (audioPlayer && audioPlayer.duration) {
                const seekTime = (this.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
                
                // Обновляем CSS переменную для цвета прогресса
                this.style.setProperty('--progress', `${this.value}%`);
            }
        });
        
        // Обработчик для кнопки play/pause
        if (fullPlayBtn) {
            fullPlayBtn.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                togglePlayPause();
                return false;
            };
        }
        
        // Обработчик для кнопки предыдущего трека
        if (fullPrevBtn) {
            fullPrevBtn.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                prevTrack();
                return false;
            };
        }
        
        // Обработчик для кнопки следующего трека
        if (fullNextBtn) {
            fullNextBtn.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                nextTrack();
                return false;
            };
        }
        
        // Обработчик для кнопки повтора
        if (fullLoopBtn) {
            // Загружаем сохраненное состояние повтора
            const savedLoop = localStorage.getItem('musicLoop');
            const loopEnabled = savedLoop === null || savedLoop === 'true';
            
            if (audioPlayer) {
                audioPlayer.loop = loopEnabled;
            }
            
            fullLoopBtn.classList.toggle('active', loopEnabled);
            fullLoopBtn.title = loopEnabled ? "Выключить повтор" : "Повторять трек";
            
            fullLoopBtn.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                if (!audioPlayer) return false;
                
                audioPlayer.loop = !audioPlayer.loop;
                localStorage.setItem('musicLoop', audioPlayer.loop.toString());
                
                this.classList.toggle('active', audioPlayer.loop);
                this.title = audioPlayer.loop ? "Выключить повтор" : "Повторять трек";
                
                showNotification(audioPlayer.loop ? '🔁 Повтор включен' : '🔁 Повтор выключен', 'info');
                return false;
            };
        }
    }


    function updateTrackTime() {
        const totalTimeEl = document.getElementById('totalTime');
        const currentTimeEl = document.getElementById('currentTime');
        
        if (totalTimeEl && audioPlayer.duration) {
            const minutes = Math.floor(audioPlayer.duration / 60);
            const seconds = Math.floor(audioPlayer.duration % 60);
            totalTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (currentTimeEl) {
            const minutes = Math.floor(audioPlayer.currentTime / 60);
            const seconds = Math.floor(audioPlayer.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function updateProgress() {
        const seekSlider = document.getElementById('trackSeekSlider');
        const currentTimeEl = document.getElementById('currentTime');
        const fullPlayBtn = document.getElementById('fullPlayBtn');
        const mainBtn = document.getElementById('musicToggleBtn');
        
        if (!audioPlayer || !audioPlayer.duration) return;
        
        // Рассчитываем прогресс
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        // Обновляем слайдер
        if (seekSlider) {
            seekSlider.value = progress;
            // Обновляем CSS переменную для цвета прогресса
            seekSlider.style.setProperty('--progress', `${progress}%`);
        }
        
        // Обновляем текущее время
        if (currentTimeEl) {
            const minutes = Math.floor(audioPlayer.currentTime / 60);
            const seconds = Math.floor(audioPlayer.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Синхронизируем состояние кнопок
        if (audioPlayer.paused) {
            if (fullPlayBtn) {
                fullPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                fullPlayBtn.title = "Воспроизвести";
            }
            if (mainBtn) {
                mainBtn.classList.remove('active');
                mainBtn.classList.add('muted');
                mainBtn.title = "Включить музыку";
            }
        } else {
            if (fullPlayBtn) {
                fullPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                fullPlayBtn.title = "Пауза";
            }
            if (mainBtn) {
                mainBtn.classList.add('active');
                mainBtn.classList.remove('muted');
                mainBtn.title = "Выключить музыку";
            }
        }
    }


    function openTrackInfoPanel() {
        const trackFull = document.getElementById('musicTrackFull');
        const trackDisplay = document.getElementById('musicTrackDisplay');
        const fullTrackName = document.getElementById('fullTrackName');
        
        if (trackFull && trackDisplay && fullTrackName) {
            // Закрываем окно, если оно уже открыто (предотвращаем множественные открытия)
            if (trackFull.classList.contains('show')) {
                closeTrackInfoPanel();
                return;
            }
            
            trackFull.classList.add('show');
            trackDisplay.classList.add('expanded');
            fullTrackName.textContent = musicTracks[currentTrackIndex].name;
            updateTrackItems();
            
            // Синхронизируем кнопки
            syncPlayerButtons();
            
            // Инициализируем контролы
            initSeekControls();
            updateTrackTime();
            updateProgress();
            
            document.body.classList.add('track-info-open');
            
            // Синхронизируем состояние кнопок с текущим состоянием плеера
            setTimeout(syncPlayerButtons, 50);
        }
    }



    function syncPlayerButtons() {
        const mainBtn = document.getElementById('musicToggleBtn');
        const fullBtn = document.getElementById('fullPlayBtn');
        
        if (!audioPlayer) return;
        
        if (audioPlayer.paused) {
            if (mainBtn) {
                mainBtn.classList.remove('active');
                mainBtn.classList.add('muted');
                mainBtn.title = "Включить музыку";
            }
            if (fullBtn) {
                fullBtn.innerHTML = '<i class="fas fa-play"></i>';
                fullBtn.title = "Воспроизвести";
            }
        } else {
            if (mainBtn) {
                mainBtn.classList.add('active');
                mainBtn.classList.remove('muted');
                mainBtn.title = "Выключить музыку";
            }
            if (fullBtn) {
                fullBtn.innerHTML = '<i class="fas fa-pause"></i>';
                fullBtn.title = "Пауза";
            }
        }
    }

    // Вызывайте эту функцию при открытии окна с треками:
    function openTrackInfoPanel() {
        const trackFull = document.getElementById('musicTrackFull');
        const trackDisplay = document.getElementById('musicTrackDisplay');
        const fullTrackName = document.getElementById('fullTrackName');
        
        if (trackFull && trackDisplay && fullTrackName) {
            trackFull.classList.add('show');
            trackDisplay.classList.add('expanded');
            fullTrackName.textContent = musicTracks[currentTrackIndex].name;
            updateTrackItems();
            
            // Синхронизируем кнопки
            syncPlayerButtons();
            
            // Инициализируем контролы
            initSeekControls();
            updateTrackTime();
            updateProgress();
            
            document.body.classList.add('track-info-open');
        }
    }

    function initSnow() {
        console.log('❄️ Инициализация снега...');
        
        // Создаем canvas для снега если его нет
        if (!document.getElementById('snowCanvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'snowCanvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9998';
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 0.5s ease';
            document.body.appendChild(canvas);
            console.log('✅ Canvas для снега создан');
        }
        
        // Загружаем сохраненное состояние
        const savedSnowState = localStorage.getItem('snowActive');
        if (savedSnowState === 'true') {
            isSnowActive = true;
            console.log('❄️ Снег был сохранен как включенный');
        }
        
        // Находим кнопку снега
        const snowBtn = document.getElementById('toggleSnowBtn');
        if (snowBtn) {
            console.log('✅ Кнопка снега найдена:', snowBtn);
            
            // Обновляем начальное состояние кнопки
            updateSnowButton();
            
            // Обработчик клика
            snowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('=== КЛИК ПО КНОПКЕ СНЕГА ===');
                console.log('1. Текущее состояние isSnowActive:', isSnowActive);
                console.log('2. Тема сайта:', currentSiteTheme);
                console.log('3. Canvas существует:', !!document.getElementById('snowCanvas'));
                
                // Меняем состояние
                isSnowActive = !isSnowActive;
                
                console.log('4. Новое состояние isSnowActive:', isSnowActive);
                
                // Включаем/выключаем снег
                toggleSnow(isSnowActive);
                
                // Сохраняем состояние
                localStorage.setItem('snowActive', isSnowActive.toString());
                console.log('5. Сохранено в localStorage:', isSnowActive);
            });
        } else {
            console.error('❌ Кнопка снега не найдена!');
        }
        
        // Включаем снег если он был сохранен и тема новогодняя
        if (isSnowActive && currentSiteTheme === 'newyear') {
            console.log('❄️ Автовключение снега (сохраненное состояние)');
            setTimeout(() => {
                toggleSnow(true);
            }, 1000);
        }
    }

    function updateSnowButtonState() {
        const snowBtn = document.getElementById('toggleSnowBtn');
        if (!snowBtn) return;
        
        if (isSnowActive) {
            snowBtn.classList.add('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Выключить снегопад ✨</span>';
        } else {
            snowBtn.classList.remove('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Включить снегопад 🎁</span>';
        }
    }

    // Простая функция обновления кнопки
    function updateSnowButton() {
        const snowBtn = document.getElementById('toggleSnowBtn');
        if (!snowBtn) return;
        
        if (isSnowActive) {
            snowBtn.classList.add('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Выключить снегопад ✨</span>';
            console.log('🔄 Кнопка снега: активна');
        } else {
            snowBtn.classList.remove('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Включить снегопад 🎁</span>';
            console.log('🔄 Кнопка снега: неактивна');
        }
    }


    // Функция управления видимостью (которая использует CSS классы)
    function updateSnowVisibility() {
        const themeSwitcher = document.querySelector('.compact-theme-switcher');
        
        if (!themeSwitcher) {
            console.error('❌ compact-theme-switcher не найден');
            return;
        }
        
        console.log('🔄 updateSnowVisibility вызвана, тема:', currentSiteTheme);
        
        // Убираем класс новогодней темы
        themeSwitcher.classList.remove('newyear-theme');
        
        // Добавляем класс ТОЛЬКО если тема новогодняя
        if (currentSiteTheme === 'newyear') {
            themeSwitcher.classList.add('newyear-theme');
            console.log('✅ Добавлен класс newyear-theme к compact-theme-switcher');
            
            // Восстанавливаем состояние кнопки снега
            const snowBtn = document.getElementById('toggleSnowBtn');
            if (snowBtn) {
                const savedSnowState = localStorage.getItem('snowActive');
                if (savedSnowState === 'true') {
                    snowBtn.classList.add('active');
                    snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Выключить снегопад ✨</span>';
                    console.log('❄️ Снег был включен, обновляем кнопку');
                } else {
                    snowBtn.classList.remove('active');
                    snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Включить снегопад 🎁</span>';
                }
            }
        } else {
            console.log('❌ Не новогодняя тема, убираем класс newyear-theme');
        }
    }

    function toggleSnow(enable) {
        const canvas = document.getElementById('snowCanvas');
        console.log('❄️ toggleSnow вызван:', enable, 'canvas:', canvas);
        
        if (!canvas) {
            console.error('❌ Canvas не найден!');
            return;
        }
        
        isSnowActive = enable;
        
        if (enable) {
            console.log('❄️ Включаем снег...');
            // Включаем снег
            canvas.style.opacity = '1';
            canvas.classList.add('active');
            startSnowfall(canvas);
            
            showNotification('❄️ Снегопад включен!', 'success');
        } else {
            console.log('❄️ Выключаем снег...');
            // Выключаем снег
            canvas.style.opacity = '0';
            canvas.classList.remove('active');
            stopSnowfall();
            
            showNotification('❄️ Снегопад выключен', 'info');
        }
        
        // Обновляем кнопку
        updateSnowButton();
    }

    function startSnowfall(canvas) {
        console.log('❄️ Запуск снегопада на canvas:', canvas);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('❌ Не удалось получить контекст canvas');
            return;
        }
        
        // Очищаем предыдущую анимацию
        if (snowInterval) {
            clearInterval(snowInterval);
            snowflakes = [];
        }
        
        // Настраиваем размер canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log('📐 Canvas размеры:', canvas.width, 'x', canvas.height);
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Создаем снежинки
        function createSnowflakes(count = 80) {
            for (let i = 0; i < count; i++) {
                snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 1 + 0.5,
                    sway: Math.random() * 2 - 1,
                    opacity: Math.random() * 0.5 + 0.3,
                    swaySpeed: Math.random() * 0.05 + 0.02
                });
            }
            console.log('❄️ Создано снежинок:', snowflakes.length);
        }
        
        // Анимация снежинок
        function animateSnow() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Добавляем новые снежинки если нужно
            if (snowflakes.length < 80 && Math.random() > 0.97) {
                createSnowflakes(1);
            }
            
            // Рисуем и обновляем снежинки
            snowflakes.forEach((flake, index) => {
                // Обновляем позицию
                flake.y += flake.speed;
                flake.x += Math.sin(flake.y * flake.swaySpeed) * flake.sway;
                
                // Если снежинка упала за экран, создаем новую сверху
                if (flake.y > canvas.height) {
                    snowflakes[index] = {
                        x: Math.random() * canvas.width,
                        y: -10,
                        radius: Math.random() * 3 + 1,
                        speed: Math.random() * 1 + 0.5,
                        sway: Math.random() * 2 - 1,
                        opacity: Math.random() * 0.5 + 0.3,
                        swaySpeed: Math.random() * 0.05 + 0.02
                    };
                }
                
                // Рисуем снежинку
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                ctx.fill();
                
                // Добавляем свечение
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 5;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
            // Продолжаем анимацию если снег активен
            if (isSnowActive) {
                requestAnimationFrame(animateSnow);
            }
        }
        
        createSnowflakes(50);
        
        // Запускаем анимацию
        snowInterval = requestAnimationFrame(animateSnow);
        console.log('✅ Снегопад запущен');
    }

    function stopSnowfall() {
        console.log('❄️ Остановка снегопада...');
        
        if (snowInterval) {
            cancelAnimationFrame(snowInterval);
            snowInterval = null;
        }
        
        snowflakes = [];
        
        // Очищаем canvas
        const canvas = document.getElementById('snowCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        console.log('✅ Снегопад остановлен');
    }


    function showSnowButton() {
        const snowControl = document.querySelector('.snow-control');
        const snowBtn = document.getElementById('toggleSnowBtn');
        
        if (!snowControl || !snowBtn) return;
        
        // Обновляем текст кнопки
        if (isSnowActive) {
            snowBtn.classList.add('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Выключить снегопад ✨</span>';
        } else {
            snowBtn.classList.remove('active');
            snowBtn.innerHTML = '<i class="fas fa-snowflake"></i><span>Включить снегопад 🎁</span>';
        }
    }

    function hideSnowButton() {
        const snowControl = document.querySelector('.snow-control');
        if (snowControl) {
            snowControl.style.display = 'none';
        }
    }
   
    // ===== ФУНКЦИЯ ПОКАЗА УВЕДОМЛЕНИЙ (если её нет) =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setTimeout(() => {
        document.querySelectorAll('.collapsible-section').forEach(section => {
            const toggleIcon = section.querySelector('.collapse-toggle');
            const content = section.querySelector('.section-content');
            if (toggleIcon && content) {
                toggleIcon.textContent = content.classList.contains('collapsed') ? '+' : '−';
            }
        });
        
        document.querySelectorAll('.category-header').forEach(header => {
            const toggleIcon = header.querySelector('.collapse-toggle');
            const emojiGroup = header.querySelector('.emoji-group');
            if (toggleIcon && emojiGroup) {
                toggleIcon.textContent = emojiGroup.classList.contains('collapsed') ? '+' : '−';
            }
        });
    }, 200);
    
    // Инициализация
    initSiteThemes();
    initSVGThemes();
    initCardStyles();
    initCollapsibleSections();
    initSectionControls();
    initEmojiCollapsibleControls();
    initAnimationControls();
    initSnow();
    initMusicControls();
    
    setTimeout(() => {
        updateSnowVisibility();
    }, 200);

    // Генерируем первую карточку
    generateCard();
});