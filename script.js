// script.js

// 語言包
const translations = {
    'zh-TW': {
        navBrand: '陳兆臨',
        navAbout: '關於我',
        navSkills: '技能',
        navProjects: '專案',
        navContact: '聯絡我',
        heroTitle: '陳兆臨',
        heroSubtitle: '一位熱愛學習與挑戰的工程師',
        aboutTitle: '關於我',
        aboutContent: '哈囉！我是陳兆臨，目前就讀於國立臺北科技大學智慧自動化工程系五年一貫學程二年級。我喜歡在不同領域中挑戰自己學習，從前端開發到資訊安全，甚至是3D建模與語言學習都是我探索的範圍。透過不斷的練習與嘗試，我希望能將程式設計、創意與工程思維結合，創造出兼具功能性與美學的作品，並持續拓展自己的可能性。',
        aboutMission: '我的目標是成為一位全方位且具備解決問題能力的工程師，持續精進技術，並將所學應用於實際專案中，創造價值。',
        skillsTitle: '技能',
        skillCat1: '程式語言與框架',
        skillCat2: '工具與技術',
        skillCat3: '軟實力',
        projectsTitle: '專案',
        project1Title: '個人網站建置',
        project1Content: '這個網站就是我的第一個主要專案，透過 HTML, CSS 和 JavaScript 從零開始建置，學習了網頁基本結構、樣式設計與互動功能。',
        project2Title: '3D建模與列印',
        project2Content: '利用 Fusion 360 進行多項零件設計與組裝，並結合 3D 列印技術將設計實體化，從中學習了產品設計流程與機械結構。',
        project3Title: '基礎資訊安全實踐',
        project3Content: '參與資訊安全社團並學習基本資安概念，包含弱點掃描、滲透測試基礎等，提升了對網路安全的認識與實作能力。',
        project4Title: '更多專案...',
        project4Content: '未來將會持續更新更多有趣且具挑戰性的專案，敬請期待！',
        contactTitle: '聯絡我',
        contactDescription: '期待與您交流！如果您有任何問題、合作機會或只是想打個招呼，歡迎透過 Email 與我聯繫。',
        contactBtn: '寄送 Email',
        footerText: '&copy; 2023 陳兆臨. All rights reserved.',
    },
    en: {
        navBrand: 'Chen Chao-Lin',
        navAbout: 'About',
        navSkills: 'Skills',
        navProjects: 'Projects',
        navContact: 'Contact',
        heroTitle: 'Chen Chao-Lin',
        heroSubtitle: 'An Engineer Passionate About Learning and Challenges',
        aboutTitle: 'About Me',
        aboutContent: 'Hi, I’m Chen Chao-Lin, currently studying in the second year of a five-year integrated program in Intelligent Automation Engineering at National Taipei University of Technology. I enjoy challenging myself across various fields, from front-end development to information security, and even 3D modeling and language learning. Through continuous practice and experimentation, I aim to integrate programming, creativity, and engineering thinking to create works that balance both functionality and aesthetics, continuously expanding my capabilities.',
        aboutMission: 'My goal is to become a versatile and problem-solving engineer, continually refining my skills and applying my knowledge to real-world projects to create value.',
        skillsTitle: 'Skills',
        skillCat1: 'Languages & Frameworks',
        skillCat2: 'Tools & Technologies',
        skillCat3: 'Soft Skills',
        projectsTitle: 'Projects',
        project1Title: 'Personal Website Development',
        project1Content: 'This website is my first major project, built from scratch using HTML, CSS, and JavaScript, where I learned basic web structure, style design, and interactive functionalities.',
        project2Title: '3D Modeling and Printing',
        project2Content: 'Designed and assembled multiple parts using Fusion 360, combining with 3D printing technology to bring designs to life, learning product design processes and mechanical structures.',
        project3Title: 'Basic Information Security Practices',
        project3Content: 'Participated in an information security club, learning fundamental concepts such as vulnerability scanning and basic penetration testing, enhancing my knowledge and practical skills in network security.',
        project4Title: 'More Projects...',
        project4Content: 'Stay tuned for more exciting and challenging projects in the future!',
        contactTitle: 'Contact Me',
        contactDescription: 'I look forward to connecting with you! If you have any questions, collaboration opportunities, or just want to say hello, feel free to reach out via Email.',
        contactBtn: 'Send Email',
        footerText: '&copy; 2023 Chen Chao-Lin. All rights reserved.',
    }
};

// 設置或獲取當前語言
let currentLang = localStorage.getItem('lang') || 'zh-TW';
// 設置或獲取當前主題模式，預設為深色模式 (false 代表深色)
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
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        body.classList.remove('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    isLightMode = isLight;
    localStorage.setItem('lightMode', isLight);
}

// 漢堡選單切換函數
function toggleHamburgerMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    // 更改漢堡圖標為關閉圖標或反之
    const hamburgerIcon = document.querySelector('.hamburger-menu i');
    if (navLinks.classList.contains('active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
    } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // 初始化語言和主題
    setLanguage(currentLang);
    setTheme(isLightMode);

    // Email 按鈕功能
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            const recipient = 'mmmax.tw@gmail.com'; // 請替換為您的 Email
            const subject = encodeURIComponent(translations[currentLang].contactDescription); // 使用翻譯內容作為預設主旨
            const body = encodeURIComponent(
                (currentLang === 'zh-TW' ?
                '您好,\n' +
                '我從您的個人網站上看到這個聯絡方式, 特此與您聯繫。\n\n' +
                '此致,\n' +
                '[您的名字]' :
                'Hello,\n' +
                'I found your contact information on your personal website and would like to get in touch.\n\n' +
                'Sincerely,\n' +
                '[Your Name]')
            );
            const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
        });
    }

    // 語言切換功能
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
            // 點擊後關閉下拉菜單
            document.querySelector('.language-dropdown').classList.remove('active');
        });
    });

    // 點擊語言按鈕時切換 active 狀態，方便 CSS 控制顯示/隱藏
    const langDropdownBtn = document.querySelector('.language-dropdown > .icon-button');
    if (langDropdownBtn) {
        langDropdownBtn.addEventListener('click', () => {
            document.querySelector('.language-dropdown').classList.toggle('active');
        });
        // 點擊其他地方關閉下拉菜單
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-dropdown')) {
                document.querySelector('.language-dropdown').classList.remove('active');
            }
        });
    }


    // 主題模式切換功能
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTheme(!isLightMode);
        });
    }

    // 平滑滾動到錨點 (如果瀏覽器不支援 scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // 關閉漢堡選單 (如果開啟的話)
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                toggleHamburgerMenu();
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 漢堡選單功能
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleHamburgerMenu);
    }


    // 滾動動畫效果 (Intersection Observer API)
    const revealItems = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一旦可見，停止觀察
            }
        });
    }, {
        threshold: 0.1, // 元素可見度達到 10% 時觸發
        rootMargin: '0px 0px -50px 0px' // 底部提早 50px 觸發
    });

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // 針對英雄區塊的特殊處理，確保頁面加載後直接觸發動畫
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // 使用 setTimeout 確保在 DOM 和 CSS 渲染完成後觸發
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'scale(1)';
        }, 100);
    }

    // 導覽列品牌名稱滾動時回到頂部
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // 關閉漢堡選單 (如果開啟的話)
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                toggleHamburgerMenu();
            }
        });
    }

});
