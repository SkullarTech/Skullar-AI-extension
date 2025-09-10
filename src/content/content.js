const list = [];
let isHighlightingEnabled = false;

function addButton() {
    const infoBlock = document.createElement('button');
    infoBlock.id = 'launch-button';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('assets/images/select.png');
    infoBlock.appendChild(img);

    document.body.appendChild(infoBlock); // Исправлено с button на infoBlock

    return infoBlock;
}

// Основная логика
async function main() {

    const configModuleUrl = chrome.runtime.getURL('src/constants/config.js');
    const { CONFIG } = await import(configModuleUrl);
    window.CONFIG = CONFIG;

    initializeHandlers(list, () => isHighlightingEnabled);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        
        if (request.action === "enableSelection") {
            isHighlightingEnabled = true;

            const block = addButton();

            block.addEventListener('click', () => {
                if (list.length === 0) {
                    alert("Пожалуйста, выберите хотя бы один элемент на странице.");
                    return;
                }

                block.remove();

                isHighlightingEnabled = false;
                const selectedList = [...list];
                clearSelectedIndicators(list);

                sendResponse({ result: "selection complete", selectedItems: selectedList });
            });

            return true;  // чтобы держать порт открытым для асинхронного sendResponse
        }

    });

}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', main);
