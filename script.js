// script.js

// 當 DOMContentLoaded 事件觸發時（即 HTML 文件完全載入並解析後），執行此函數
document.addEventListener('DOMContentLoaded', () => {
    // 獲取 ID 為 'sendEmailBtn' 的按鈕元素
    const sendEmailBtn = document.getElementById('sendEmailBtn');

    // 檢查按鈕是否存在，以防止在 HTML 中找不到元素時出錯
    if (sendEmailBtn) {
        // 為按鈕添加點擊事件監聽器
        sendEmailBtn.addEventListener('click', () => {
            // 定義 Email 相關資訊
            const recipient = 'mmmax.tw@gmail.com'; // 收件人 Email 地址
            
            // Email 主旨，使用 encodeURIComponent 進行 URL 編碼，確保特殊字元正確傳遞
            const subject = encodeURIComponent('來自個人網站的聯絡'); 
            
            // Email 內文，同樣使用 encodeURIComponent 進行 URL 編碼
            // \n 代表換行符，在郵件內文中會被解析為新的一行
            const body = encodeURIComponent(
                '您好,\n' +
                '我從您的個人網站上看到這個聯絡方式, 特此與您聯繫。\n\n' +
                '此致,\n' +
                '[您的名字]' // 您可以根據需要替換或移除
            );

            // 組裝完整的 mailto 連結
            // mailto:收件人?subject=主旨&body=內文
            const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

            // 透過設置 window.location.href 來觸發瀏覽器開啟郵件客戶端
            window.location.href = mailtoLink;

            // 您可以在這裡添加一些用戶反饋，例如一個彈出提示
            // alert('即將打開您的 Email 客戶端，請確認發送。');
            
            // 或者在控制台輸出訊息，方便開發調試
            console.log('嘗試打開 Email 客戶端...');
        });
    }
});
