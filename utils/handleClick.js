// utils/handleClick.js

import { getPageHTML } from './getPageHTML.js';
import { sendHTMLToServer } from './sendToServer.js';
import { performActions } from './performActions.js';
import { animateTo } from '../popup/animation.js';


// Основной обработчик кнопки
export async function handleButtonClick() {
    try {
        await animateTo(5);
        const { html, tabId } = await getPageHTML(); // 1s

        await animateTo(75);
        const actions = await sendHTMLToServer(html); // тратит больше всего времени

        await animateTo(90); 
        await performActions(tabId, actions);

        animateTo(95);
        console.log("Действия успешно выполнены");   // 1s

        await animateTo(100);  // КОНЕЦ ???

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
        console.error("Ошибка выполнения:", error.message);
    }
}