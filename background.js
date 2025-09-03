import { getTokenFromStorage } from "./utils/storage.js";
import { performActions } from './utils/performActions.js';
import { sendHTMLToServer } from './utils/sendToServer.js';
import { getPageHTML } from './utils/getPageHTML.js';
import { sendProgress, sendError } from './utils/message-sender.js';

export async function handleButtonClickBackground() {
    try {
        sendProgress(5);

        const { html, tabId } = await getPageHTML();

        sendProgress(75);

        const actions = await sendHTMLToServer(html);

        sendProgress(90);

        await performActions(tabId, actions);

        sendProgress(95);

        console.log('Действия успешно выполнены');

        sendProgress(100);  // КОНЕЦ ???

    } catch (error) {
        sendError(error.message); // Показать ошибку в popup
    }
}

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    
    if (message.type === 'start-action') {
        handleButtonClickBackground();
        sendResponse({ status: 'completed' });
    }

    return true; 
});



async function openGuide() {
    try {
        await getTokenFromStorage();
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

chrome.runtime.onInstalled.addListener(openGuide);
chrome.action.onClicked.addListener(openGuide);
