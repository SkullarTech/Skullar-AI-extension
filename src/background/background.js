import { getTokenFromStorage } from "../utils/storage/storage.js";
import { performActions } from '../utils/dom/performActions.js';
import { sendHTMLToServer } from '../utils/api/sendToServer.js';
import { getPageHTML } from '../utils/dom/getPageHTML.js';
import { sendProgress, sendError, closePopup } from '../utils/messaging/message-sender.js';
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

function openExtensionPopup() {
    return new Promise((resolve, reject) => {
        chrome.windows.getLastFocused({}, ({ focused }) => {
            if (!focused) {
                return setTimeout(() => openExtensionPopup().then(resolve, reject), 500);
            }
            chrome.action.openPopup(() =>
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve()
            );
        });
    });
}


export async function handleButtonClickBackground() {
    try {
        let { html, tabId } = await getPageHTML();

        if (!html) {
            closePopup();

            const selectedItems = await new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "enableSelection" }, (response) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve(response.selectedItems);
                            }
                        });
                    } else {
                        reject(new Error("No active tab found"));
                    }
                });
            });

            html = JSON.stringify(selectedItems, null, 2);
            console.log('Selected items HTML:', html);

            await openExtensionPopup();
        }

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
