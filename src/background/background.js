import { getTokenFromStorage } from "../utils/storage/storage.js";
import { performActions } from '../utils/dom/performActions.js';
import { sendHTMLToServer } from '../utils/api/sendToServer.js';
import { getPageHTML } from '../utils/dom/getPageHTML.js';
import { sendProgress, sendError } from '../utils/messaging/message-sender.js';
import { fetchToken } from "../utils/api/token.js";


async function handleGetToken() {
    try {

        const key = await getTokenFromStorage();
        if (!key) {
            return { token: null };  
        }

        const token = await fetchToken(key);
        return { token: token ?? null }; 

    } catch (error) {
        console.error('Ошибка при получении токена:', error); 
        sendError(error.message);  // Показать ошибку в popup
        return { token: null };
    }

}


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

    else if (message.type === 'get-token') {
        (async () => {
            const result = await handleGetToken();
            sendResponse(result);
        })();
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
