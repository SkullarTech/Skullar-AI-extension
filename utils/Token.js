// utils/token.js

import { CONFIG } from "./config.js";
import { handleError } from '../utils/errorHandler.js';

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
            await handleError(response.status);
            
            if (response.status === 404) {
                return null; // токен не найден
            }

            return null;
        }

        return await response.json(); // вернёт объект токена

    } catch (error) {
        await handleError(error.message); // Показать ошибку в popup
        return null;
    }
}




