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
let currentLang = 'zh-TW';

// 讀 JSON 並替換所有有 data-lang-key 的元素
function loadTranslations(lang) {
  fetch(`locales/${lang}.json`)
    .then(res => res.json())
    .then(translations => {
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
  loadTranslations(lang);
}

// 頁面載入時先載入預設語言
window.addEventListener('DOMContentLoaded', () => {
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


// Email 按鈕
document.getElementById("sendEmailBtn").addEventListener("click", () => {
    // *** 請務必將此處替換為您的實際 Email 地址 ***
    window.location.href = "mailto:your-email@example.com";
});
