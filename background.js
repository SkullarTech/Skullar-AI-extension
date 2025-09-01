import { getTokenFromStorage } from "./utils/storage.js";

async function openGuide() {
    try {
        await getTokenFromStorage();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

chrome.runtime.onInstalled.addListener(openGuide);
chrome.action.onClicked.addListener(openGuide);
