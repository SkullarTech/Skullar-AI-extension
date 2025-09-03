// popup/popup.js

import { animateTo, currentProgress } from './animation.js';
import { handleButtonClick } from '../utils/handleClick.js';
import { fetchToken } from "../utils/token.js";
import { getTokenFromStorage } from "../utils/storage.js";
import { handleError } from '../utils/errorHandler.js';

let attempts_count; // Кол-во оставшихся попыток
let max_attempts; // Макс кол-во попыток

const button = document.getElementById("send");
const attempts_block = document.getElementById("attempts-count");
const blur_block = document.getElementById("blur-block");

const notification = document.getElementById("notification");
const notification_btn = document.getElementById("notification-btn");

const settings = document.getElementById("settings");
const settings_btn = document.getElementById("settings-button");

const stealth_toggle = document.querySelector('#stealth-toggle input');
const stealth_item = document.getElementById('stealth-item');
const logout_item = document.getElementById('logout-item');


button.addEventListener("click", () => {
    if (currentProgress === 0 && attempts_count > 0) {
        handleButtonClick();
    }
});

notification_btn.addEventListener("click", () => {
    notification.classList.remove('active');
});

settings_btn.addEventListener("click", () => {
    settings.classList.add('active');
    settings_btn.classList.add('active');
});

settings.addEventListener("click", (event) => {
    if (event.target === settings) {
        settings.classList.remove('active');
        settings_btn.classList.remove('active');
    }
});

stealth_item.addEventListener("click", (event) => {
    stealth_toggle.checked = !stealth_toggle.checked;
    stealth_toggle.dispatchEvent(new Event('change'));
});

logout_item.addEventListener("click", async () => {
    chrome.storage.local.remove('auth_token');
    window.location.reload();
});


// Проверяем есть ли токен
document.addEventListener("DOMContentLoaded", async () => {
    const key = await getTokenFromStorage(true);
    if (!key) return;

    const token = await fetchToken(key);
    if (!token) return;

    attempts_count = token.daily_attempts;
    max_attempts = token.max_attempts;
    attempts_block.innerHTML = `${attempts_count}/${max_attempts}`;

    blur_block.classList.add('shrink-animation');
});



chrome.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'progress') {
        await animateTo(message.value);
    }

    else if (message.type === 'error') {
        await handleError(message.value);
    }
});

