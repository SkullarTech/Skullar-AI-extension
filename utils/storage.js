// utils/storage.js

import { CONFIG } from "../utils/config.js";

export function getTokenFromStorage(closePopup = false) {
    return new Promise((resolve) => {

        // URL страницы с инструкцией
        const redirectUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_START}`;

        chrome.storage.local.get(CONFIG.TOKEN_KEY, (result) => {
            const token = result.auth_token;

            if (!token) {
                chrome.tabs.create({ url: redirectUrl });

                if (closePopup) {
                    window.close();
                }

                resolve(null);
                
            } else {
                resolve(token);
            }
        });
    });
}