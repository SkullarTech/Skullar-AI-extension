// src/utils/dom/getPageHTML.js

// Получение HTML страницы
export async function getPageHTML() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    let [{ result: html }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML,
    });

    const length = html.length;

    if (length > 1000) {
        html = null;
    }
    
    return { html, tabId: tab.id };
}
