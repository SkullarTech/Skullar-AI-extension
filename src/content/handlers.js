// src/content/handlers.js

function initializeHandlers(list, getHighlightingState) {
    window.addEventListener('mouseover', function(e) {
        if (getHighlightingState() && !e.target.closest('#launch-button')) {
            e.target.classList.add('highlighted');
        }
    });

    window.addEventListener('mouseout', function(e) {
        if (getHighlightingState() && !e.target.closest('#launch-button')) {
            e.target.classList.remove('highlighted');
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('highlighted') && getHighlightingState() && !e.target.closest('#launch-button')) {
            e.preventDefault();
            e.stopPropagation();
            handleClick(e.target, list);
        }
    }, true);
}

function handleClick(element, list) {
    element.classList.remove('highlighted');

    const xpath = getXPath(element);
    const object = {
        element: element.outerHTML, 
        xpath: xpath
    };

    filterItems(object, list);

    const totalChars = list.reduce((sum, obj) => sum + obj.element.length, 0);
    const newTotalChars = totalChars + object.element.length;

    if (newTotalChars > CONFIG.MAX_HTML_SIZE) {
        filterItems(object, list);
        alert("Превышен максимальный размер выбранных элементов. Пожалуйста, удалите некоторые элементы.");
        return; // не добавляем элемент
    }

    element.classList.toggle('selected-indicator');
    console.log('Элемент добавлен в список:', element, 'XPath:', xpath);
}