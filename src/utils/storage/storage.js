// src/utils/storage/storage.js

import { CONFIG } from "../../constants/config.js";

export function getTokenFromStorage() {
    return new Promise((resolve) => {

        // URL страницы с инструкцией
        const redirectUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_START}`;

        chrome.storage.local.get(CONFIG.TOKEN_KEY, (result) => {
            const token = result.auth_token;

            if (!token) {
                chrome.tabs.create({ url: redirectUrl });

                resolve(null);
                
            } else {
                resolve(token);
            }
        });
    });
}