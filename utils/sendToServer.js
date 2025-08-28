// utils/sendToServer.js

import { CONFIG } from "./config.js";
import { getTokenFromStorage } from "./storage.js";
import { handleError } from '../utils/errorHandler.js';

const SERVER_URL = `${CONFIG.API_BASE_URL}/process`;

// Отправка HTML на сервер
export async function sendHTMLToServer(html) {
    const key = await getTokenFromStorage(); 

    if (!key) {
        await handleError("404"); // Показать ошибку в popup
        throw new Error("Токен не найден в хранилище");
    }

    const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ html, key }),
    });

    if (!response.ok) {
        await handleError(response.status); // Показать ошибку в popup
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    console.log("Ответ сервера:", JSON.stringify(data, null, 2));
    return data.actions;
}
