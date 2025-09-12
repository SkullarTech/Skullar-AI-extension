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

    const cloned_element = element.cloneNode(true);
    cloned_element.classList.remove('highlighted');
    removeAttributesRecursive(cloned_element, ['class', 'style']) // Удаляем лишнее

    const object = {
        element: cloned_element.outerHTML, 
        xpath: xpath
    };

    filterItems(object, list);

    const totalChars = list.reduce((sum, obj) => sum + obj.element.length, 0);

    console.log(`object length: ${object.element.length}`);
    console.log(`totalChars: ${totalChars}`);

    if (totalChars > CONFIG.MAX_HTML_SIZE) {
        filterItems(object, list); // Вызываем еще раз, чтобы удалить элемент
        alert("Превышен максимальный размер выбранных элементов. Пожалуйста, удалите некоторые элементы.");
        return; // не добавляем элемент
    }

    element.classList.toggle('selected-indicator');
    console.log('Элемент (добавлен в / удален из) список(a):', cloned_element, 'XPath:', xpath);
}