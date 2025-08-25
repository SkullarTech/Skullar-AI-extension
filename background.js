import { getTokenFromStorage } from "./utils/Token.js";
import { CONFIG } from "./utils/config.js";


chrome.runtime.onInstalled.addListener(() => {
  const guideUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_GUIDE}`;
  getTokenFromStorage(guideUrl);
});

chrome.action.onClicked.addListener(() => {
  const guideUrl = `chrome-extension://${chrome.runtime.id}${CONFIG.PATH_TO_GUIDE}`;
  getTokenFromStorage(guideUrl);
});

