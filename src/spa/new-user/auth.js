// src/spa/new-user/auth.js

export async function init(container) {
    const submitBtn = container.querySelector("#submit");
    const tokenInput = container.querySelector("#token");

    // Динамически импортируем модуль токена
    const tokenModuleUrl = chrome.runtime.getURL('src/utils/api/token.js');
    const configModuleUrl = chrome.runtime.getURL('src/constants/config.js');
    const { fetchToken } = await import(tokenModuleUrl);
    const { CONFIG } = await import(configModuleUrl);

    submitBtn.onclick = async () => {
        const token = tokenInput.value.trim();

        const tokenData = await fetchToken(token);

        if (tokenData) {
            chrome.storage.local.set({ [CONFIG.TOKEN_KEY]: token }, () => {
                alert("✅ Токен сохранён!");
                window.close();
            });
        } else {
            alert("❌ Неверный токен. Пожалуйста, попробуйте ещё раз.");
        }

    };
}