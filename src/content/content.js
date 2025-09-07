const list = [];
let isHighlightingEnabled = false;

window.addEventListener('mouseover', function(e) {
    if (isHighlightingEnabled && !e.target.closest('#launch-button')) {
        e.target.classList.add('highlighted'); 
    }
});

window.addEventListener('mouseout', function(e) {
    if (isHighlightingEnabled && !e.target.closest('#launch-button')) {
        e.target.classList.remove('highlighted'); 
    }
});

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('highlighted') && isHighlightingEnabled && !e.target.closest('#launch-button')) {
        e.preventDefault();       // отменить действие клика
        e.stopPropagation();      // остановить распространение события
        handleClick(e.target);    
    }
}, true);

function addButton() {
    const infoBlock = document.createElement('button');
    infoBlock.id = 'launch-button';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('assets/images/select.png');
    infoBlock.appendChild(img);

    document.body.appendChild(infoBlock); // Исправлено с button на infoBlock

    return infoBlock;
}

function handleClick(element) {
    let xpath = getXPath(element);

    const object = {
        element: element.outerHTML, 
        xpath: xpath
    };

    filterItems(object, list);

    element.classList.toggle('selected-indicator');
    console.log('Элемент добавлен в список:', element, 'XPath:', xpath);
}

function filterItems(object, list) {
    const exists = list.some(item => item.xpath === object.xpath);

    if (!exists) {
        list.push(object);
        console.log('Текущий список:', list);
        return;
    }

    const index = list.findIndex(item => item.xpath === object.xpath);
    if (index !== -1) {
        list.splice(index, 1);
    }
    console.log('Текущий список:', list);
}

function clearSelectedIndicators() {
    document.querySelectorAll('.selected-indicator').forEach(el => {
        el.classList.remove('selected-indicator');
    });

    list.length = 0;
}


function getXPath(element) {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }

    if (element === document.body) {
        return '/html/body';
    }

    let ix = 0;
    let siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
            ix++;
            if (sibling === element) {
                return getXPath(element.parentNode) + '/' + element.nodeName.toLowerCase() + '[' + ix + ']';
            }
        }
    }
}


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
            clearSelectedIndicators();

            sendResponse({ result: "selection complete", selectedItems: selectedList });
        });

        return true;  // чтобы держать порт открытым для асинхронного sendResponse
    }

});
