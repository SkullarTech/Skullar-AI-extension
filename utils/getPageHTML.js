// utils/getPageHTML.js

// Получение HTML страницы
export async function getPageHTML() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const [{ result: html }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML,
    });
    
    return { html, tabId: tab.id };
}
