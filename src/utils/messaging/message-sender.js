// src/utils/messaging/message-sender.js

export function sendError(value) {
    chrome.runtime.sendMessage({ type: 'error', value });
}

export function sendProgress(value) {
    chrome.runtime.sendMessage({ type: 'progress', value });
}

export function closePopup() {
    chrome.runtime.sendMessage({ type: 'close-popup' });
}