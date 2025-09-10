// src/utils/dom/getPageHTML.js

import { CONFIG } from "../../constants/config.js";

// Получение HTML страницы
export async function getPageHTML() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    let [{ result: html }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML,
    });

    const length = html.length;

    if (length > CONFIG.MAX_HTML_SIZE) {
        html = null;
    }
    
    return { html, tabId: tab.id };
}
