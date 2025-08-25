// popup/popup.js

import { animateTo, currentProgress } from './animation.js';
import { handleButtonClick } from '../utils/handleClick.js';
import { fetchToken, getTokenFromStorage } from "../utils/Token.js";
import { CONFIG } from "../utils/config.js";

let attempts_count; // Кол-во оставшихся попыток
let max_attempts; // Макс кол-во попыток

const button = document.getElementById("send");
const attempts_block = document.getElementById("attempts-count");

button.addEventListener("click", () => {
    if (currentProgress === 0 && attempts_count > 0) {
        handleButtonClick();
    }
});

// Проверяем есть ли токен
document.addEventListener("DOMContentLoaded", async () => {
    const guideUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_GUIDE}`;
    const key = await getTokenFromStorage(guideUrl, true);

    if (!key) return;

    const token = await fetchToken(key);
    if (!token) return;

    attempts_count = token.daily_attempts;
    max_attempts = token.max_attempts;
    attempts_block.innerHTML = `${attempts_count}/${max_attempts}`;
});

