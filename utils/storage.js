// utils/storage.js

export function getTokenFromStorage(redirectUrl, closePopup = false) {
  return new Promise((resolve) => {
    chrome.storage.local.get("auth_token", (result) => {
      const token = result.auth_token;

      if (!token) {
        chrome.tabs.create({ url: redirectUrl });

        if (closePopup) {
          window.close();
        }

        resolve(null);
        
      } else {
        resolve(token);
      }
    });
  });
}