// 主題切換
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// 初始主題設定
function setInitialTheme() {
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        // 預設為淺色模式，或從 localStorage 讀取 'light'
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "light"); // 確保預設值也寫入 localStorage
    }
}

// 預設語言
let currentLang = localStorage.getItem('lang') || 'zh-TW';

// 讀 JSON 並替換所有有 data-lang-key 的元素
function loadTranslations(lang) {
    // ✅ 修正 GitHub Pages 的 JSON 路徑
    fetch(`/Max98122/locales/${lang}.json`)
        .then(res => res.json())
        .then(translations => {
            // 更新 <title>
            if (translations['pageTitle']) {
                document.title = translations['pageTitle'];
            }

            // 更新語言下拉選單文字
            if (translations['langZh']) {
                const zhBtn = document.querySelector('.lang-option[data-lang="zh-TW"]');
                if (zhBtn) zhBtn.innerText = translations['langZh'];
            }
            if (translations['langEn']) {
                const enBtn = document.querySelector('.lang-option[data-lang="en"]');
                if (enBtn) enBtn.innerText = translations['langEn'];
            }

            // 更新頁面中其他元素
            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.getAttribute('data-lang-key');
                if (translations[key]) {
                    el.innerText = translations[key];
                }
            });
        })
        .catch(err => console.error('載入翻譯失敗:', err));
}

// 切換語言
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    loadTranslations(lang);
}

// 頁面載入時
window.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    loadTranslations(currentLang);

    // 綁定語言切換按鈕
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});

// 主題切換事件監聽
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

// Email 按鈕
document.getElementById("sendEmailBtn").addEventListener("click", () => {
    // *** 請務必將此處替換為您的實際 Email 地址 ***
    window.location.href = "mailto:your-email@example.com";
});
