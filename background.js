import { getTokenFromStorage } from "./utils/storage.js";
import { CONFIG } from "./utils/config.js";

function openGuide() {
    const guideUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_GUIDE}`;
    getTokenFromStorage(guideUrl);
}

chrome.runtime.onInstalled.addListener(openGuide);
chrome.action.onClicked.addListener(openGuide);
