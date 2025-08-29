// spa/new-user/auth.js

export async function init(container) {
    const submitBtn = container.querySelector("#submit");
    const tokenInput = container.querySelector("#token");

    // Динамически импортируем модуль токена
    const tokenModuleUrl = chrome.runtime.getURL('utils/token.js');
    const { fetchToken } = await import(tokenModuleUrl);

    submitBtn.onclick = async () => {
        const token = tokenInput.value.trim();

        const tokenData = await fetchToken(token);

        if (tokenData) {
            chrome.storage.local.set({ auth_token: token }, () => {
                alert("✅ Токен сохранён!");
                window.close();
            });
        } else {
            alert("❌ Неверный токен. Пожалуйста, попробуйте ещё раз.");
        }

    };
}