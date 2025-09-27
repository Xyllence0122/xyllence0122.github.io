// script.js

// 語言包
const translations = {
    'zh-TW': {
        navAbout: '關於我',
        navProjects: '專案',
        navContact: '聯絡我',
        heroTitle: '陳兆臨',
        heroSubtitle: '一位熱愛學習與挑戰的工程師',
        aboutTitle: '關於我',
        aboutContent: '哈囉！我是陳兆臨，目前就讀於國立臺北科技大學智慧自動化工程系五年一貫學程二年級。我喜歡在不同領域中挑戰自己學習，從前端開發到資訊安全，甚至是3D建模與語言學習都是我探索的範圍。透過不斷的練習與嘗試，我希望能將程式設計、創意與工程思維結合，創造出兼具功能性與美學的作品，並持續拓展自己的可能性。',
        projectsTitle: '專案',
        project1Title: '個人網站建置',
        project1Content: '這個網站就是我的第一個主要專案，透過 HTML, CSS 和 JavaScript 從零開始建置，學習了網頁基本結構、樣式設計與互動功能。',
        project2Title: '3D建模與列印',
        project2Content: '利用 Fusion 360 進行多項零件設計與組裝，並結合 3D 列印技術將設計實體化，從中學習了產品設計流程與機械結構。',
        project3Title: '基礎資訊安全實踐',
        project3Content: '參與資訊安全社團並學習基本資安概念，包含弱點掃描、滲透測試基礎等，提升了對網路安全的認識與實作能力。',
        contactTitle: '聯絡我',
        contactDescription: '歡迎透過 Email 與我聯繫！',
        contactBtn: '寄送 Email',
        footerText: '&copy; 2023 陳兆臨. All rights reserved.',
    },
    en: {
        navAbout: 'About Me',
        navProjects: 'Projects',
        navContact: 'Contact',
        heroTitle: 'Chen Chao-Lin',
        heroSubtitle: 'An Engineer Passionate About Learning and Challenges',
        aboutTitle: 'About Me',
        aboutContent: 'Hi, I’m Chen Chao-Lin, currently studying in the five-year program of Intelligent Automation Engineering at National Taipei University of Technology, now in my second year. I enjoy challenging myself in different fields of learning — from front-end development to information security, and even 3D modeling and language learning are areas I explore. Through continuous practice and experimentation, I hope to combine programming, creativity, and engineering thinking to create works that balance both functionality and aesthetics, while constantly expanding my possibilities.',
        projectsTitle: 'Projects',
        project1Title: 'Personal Website Development',
        project1Content: 'This website is my first major project, built from scratch using HTML, CSS, and JavaScript, where I learned basic web structure, style design, and interactive functionalities.',
        project2Title: '3D Modeling and Printing',
        project2Content: 'Designed and assembled multiple parts using Fusion 360, combining with 3D printing technology to bring designs to life, learning product design processes and mechanical structures.',
        project3Title: 'Basic Information Security Practices',
        project3Content: 'Participated in an information security club, learning fundamental concepts such as vulnerability scanning and basic penetration testing, enhancing my knowledge and practical skills in network security.',
        contactTitle: 'Contact Me',
        contactDescription: 'Feel free to contact me via Email!',
        contactBtn: 'Send Email',
        footerText: '&copy; 2023 Chen Chao-Lin. All rights reserved.',
    }
};

// 設置或獲取當前語言
let currentLang = localStorage.getItem('lang') || 'zh-TW';
// 設置或獲取當前主題模式，預設為深色模式
let isLightMode = localStorage.getItem('lightMode') === 'true';

// 翻譯函數
function setLanguage(lang) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang; // 設定 HTML 的 lang 屬性
}

// 主題模式切換函數
function setTheme(isLight) {
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggle');
    const icon = themeToggleBtn.querySelector('i');

    if (isLight) {
        body.classList.add('light-mode');
        // 在淺色模式下顯示月亮圖標，表示點擊可以切換到深色模式
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.classList.remove('light-mode');
        // 在深色模式下顯示太陽圖標，表示點擊可以切換到淺色模式
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    isLightMode = isLight;
    localStorage.setItem('lightMode', isLight);
}


document.addEventListener('DOMContentLoaded', () => {
    // 初始化語言和主題
    setLanguage(currentLang);
    // 注意這裡調用 setTheme 時，isLightMode 的值應為從 localStorage 讀取到的狀態
    setTheme(isLightMode);

    // Email 按鈕功能
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            const recipient = 'mmmax.tw@gmail.com';
            const subject = encodeURIComponent('來自個人網站的聯絡');
            const body = encodeURIComponent(
                '您好,\n' +
                '我從您的個人網站上看到這個聯絡方式, 特此與您聯繫。\n\n' +
                '此致,\n' +
                '[您的名字]'
            );
            const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            console.log('嘗試打開 Email 客戶端...');
        });
    }

    // 語言切換功能
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 主題模式切換功能
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // 切換模式時，將當前模式的反向值傳入 setTheme
            setTheme(!isLightMode);
        });
    }
});
