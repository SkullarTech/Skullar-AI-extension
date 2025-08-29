// utils/errorHandler.js

import { resetButton } from '../popup/animation.js';

export async function getErrorText(code) {
    console.log(code);
    const url = chrome.runtime.getURL('assets/errors.json');
    const response = await fetch(url);
    const errors = await response.json();
    return errors[code] || 'Неизвестная ошибка';
}

export async function handleError(error) {
    const notification_text = document.getElementById("notification-text");
    const notification = document.getElementById("notification");

    if (!notification_text || !notification) {
        return;
    }

    const code = String(error).match(/\d{3}/)?.[0] || String(error);

    await getErrorText(code).then(msg => {
        notification_text.innerText = msg;
        notification.classList.add('active');
        resetButton();
    });
}

