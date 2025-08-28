// utils/checkToken.js

import { CONFIG } from "./config.js";

const SERVER_URL_CHECK = `${CONFIG.API_BASE_URL}/check-token`;
const SERVER_URL_GET = `${CONFIG.API_BASE_URL}/get-token`;



export async function fetchToken(token) {
    try {
        const response = await fetch(SERVER_URL_GET, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: token }) // поле 'key', как ждёт сервер
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // токен не найден
            }
            console.warn("Ошибка при запросе:", response.status);
            return null;
        }

        return await response.json(); // вернёт объект токена

    } catch (error) {
        console.error("Ошибка при получении токена:", error);
        return null;
    }
}



export function getTokenFromStorage(redirectUrl, closePopup = false) {
  return new Promise((resolve) => {
    chrome.storage.local.get("auth_token", (result) => {
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




