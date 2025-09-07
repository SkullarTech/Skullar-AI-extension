// src/utils/events/handleClick.js

import { sendError } from "../messaging/message-sender.js";

// Основной обработчик кнопки
export async function handleButtonClick() {
    try {
        
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: 'start-action' }, (response) => {

                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                if (response?.status === 'completed') {
                    console.log('Процесс успешно запущен в фоне');
                    resolve(response);
                } 
                
                else if (response?.status === 'error') {
                    console.error('Ошибка в процессе:', response.error);
                    reject(new Error(response.error));
                } 
                
                else {
                    resolve(response);
                }
            });
        });

        // Обновление попыток на странице
        const attemptsBlock = document.getElementById("attempts-count");
        if (attemptsBlock) {
            const text = attemptsBlock.textContent;          // например "3/5"
            const parts = text.split("/");                   // ["3", "5"]
            const current = parseInt(parts[0]) || 0;         // 3
            const max = parseInt(parts[1]) || 0;             // 5

            const newCurrent = Math.max(current - 1, 0);     // уменьшить, но не меньше 0
            attemptsBlock.innerHTML = `${newCurrent}/${max}`; // обновить счётчик
        }

    } catch (error) {
        sendError(error.message); // Показать ошибку в popup
    }
}