// src/content/utils.js

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

function removeAttributesRecursive(element, attrList) {
    attrList.forEach(attr => element.removeAttribute(attr));
    for (let child of element.children) {
        removeAttributesRecursive(child, attrList);
    }
}

function clearSelectedIndicators(list) {
    document.querySelectorAll('.selected-indicator').forEach(el => {
        el.classList.remove('selected-indicator');
    });

    list.length = 0;
}

