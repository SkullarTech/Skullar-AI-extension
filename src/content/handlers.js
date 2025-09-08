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
    const xpath = getXPath(element);

    const object = {
        element: element.outerHTML, 
        xpath: xpath
    };

    filterItems(object, list);

    element.classList.toggle('selected-indicator');
    console.log('Элемент добавлен в список:', element, 'XPath:', xpath);
}