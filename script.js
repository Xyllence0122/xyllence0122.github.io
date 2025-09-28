// 主題切換
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// 初始語言設定 (將這部分提到主題切換之前，確保主題在語言載入前正確設定)
const savedLang = localStorage.getItem("lang") || "zh-TW";
updateLanguage(savedLang); // 確保在其他元素被翻譯之前，footer 年份可以更新

// 修正：初始主題設定
function setInitialTheme() {
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode"); // 確保移除潛在的 light-mode
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        // 預設為淺色模式，或從 localStorage 讀取 'light'
        body.classList.add("light-mode"); // 預設新增 light-mode
        body.classList.remove("dark-mode"); // 確保移除潛在的 dark-mode
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "light"); // 確保預設值也寫入 localStorage
    }
}

setInitialTheme(); // 載入時設定初始主題

themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
        body.classList.replace("light-mode", "dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.replace("dark-mode", "light-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "light");
    }
});

// ... (Translations and other parts of your script)

// Footer 年份 (修正為使用 updateLanguage 中的邏輯，或直接在這裡處理)
// 因為 footerText 是透過 updateLanguage 處理的，所以這個單獨的設定需要移除
// document.getElementById("footerYear").innerHTML = `© ${new Date().getFullYear()} 陳兆臨. All rights reserved.`;

// 語言切換
const translations = {
    "zh-TW": {
        navAbout: "關於我",
        navProjects: "專案",
        navContact: "聯絡我",
        heroTitle: "陳兆臨",
        heroSubtitle: "一位熱愛學習與挑戰的工程師",
        aboutTitle: "關於我",
        aboutContent: "哈囉！我是陳兆臨，目前就讀於國立臺北科技大學智慧自動化工程系五年一貫學程二年級。 我喜歡在不同領域中挑戰自己學習，從前端開發到資訊安全，甚至是3D建模與語言學習都是我探索的範圍。 透過不斷的練習與嘗試，我希望能將程式設計、創意與工程思維結合，創造出兼具功能性與美學的作品，並持續拓展自己的可能性。",
        projectsTitle: "專案",
        project1Title: "個人網站建置",
        project1Content: "這個網站就是我的第一個主要專案，透過 HTML, CSS 和 JavaScript 從零開始建置， 學習了網頁基本結構、樣式設計與互動功能。",
        project2Title: "3D建模與列印",
        project2Content: "利用 Fusion 360 進行多項零件設計與組裝，並結合 3D 列印技術將設計實體化， 從中學習了產品設計流程與機械結構。",
        project3Title: "基礎資訊安全實踐",
        project3Content: "參與資訊安全社團並學習基本資安概念，包含弱點掃描、滲透測試基礎等， 提升了對網路安全的認識與實作能力。",
        contactTitle: "聯絡我",
        contactDescription: "歡迎透過 Email 與我聯繫！",
        contactBtn: "寄送 Email",
        footerText: "© YEAR 陳兆臨. All rights reserved."
    },
    "en": {
        navAbout: "About",
        navProjects: "Projects",
        navContact: "Contact",
        heroTitle: "Chen Chao-Lin",
        heroSubtitle: "An engineer who loves learning and challenges",
        aboutTitle: "About Me",
        aboutContent: "Hi! I'm Chen Chao-Lin, a second-year student in the Five-Year Program of Intelligent Automation Engineering at National Taipei University of Technology. I enjoy challenging myself in various fields, from frontend development to cybersecurity, as well as 3D modeling and language learning. Through continuous practice and exploration, I aim to combine programming, creativity, and engineering thinking to create works that balance functionality and aesthetics.",
        projectsTitle: "Projects",
        project1Title: "Personal Website",
        project1Content: "This website is my first major project, built from scratch using HTML, CSS, and JavaScript, where I learned about basic web structure, design, and interactivity.",
        project2Title: "3D Modeling & Printing",
        project2Content: "Using Fusion 360 to design and assemble multiple parts, combined with 3D printing technology to bring designs into reality, I gained experience in product design processes and mechanical structures.",
        project3Title: "Cybersecurity Basics",
        project3Content: "Participated in cybersecurity club and learned fundamental concepts such as vulnerability scanning and basic penetration testing, enhancing my knowledge and hands-on skills in network security.",
        contactTitle: "Contact",
        contactDescription: "Feel free to reach me via Email!",
        contactBtn: "Send Email",
        footerText: "© YEAR Chen Chao-Lin. All rights reserved."
    }
};

function updateLanguage(lang) {
    document.querySelectorAll("[data-lang-key]").forEach(el => {
        const key = el.getAttribute("data-lang-key");
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key].replace("YEAR", new Date().getFullYear());
        }
    });
}

document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = option.getAttribute("data-lang");
        localStorage.setItem("lang", lang);
        updateLanguage(lang);
    });
});

// 初始語言設定
const savedLang = localStorage.getItem("lang") || "zh-TW";
updateLanguage(savedLang);

// Email 按鈕
document.getElementById("sendEmailBtn").addEventListener("click", () => {
    window.location.href = "mailto:your-email@example.com";
});

// Footer 年份
document.getElementById("footerYear").innerHTML = 
    `© ${new Date().getFullYear()} 陳兆臨. All rights reserved.`;
