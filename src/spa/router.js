// src/spa/router.js

const app = document.getElementById('app');
const Page_Not_Found = '<h1>Страница не найдена</h1>';

function renderRoute() {
    const route = location.hash.slice(1);
    if (route) {
        renderBlock(app, route);
    } else {
        app.innerHTML = Page_Not_Found;
    }
}

async function renderBlock(container, route) {
    try {
        const response = await fetch(`./${route}.html`);

        if (!response.ok) {
            container.innerHTML = Page_Not_Found;
            return;
        }

        const html = await response.text();
        container.innerHTML = html;

        const jsPath = `./${route}.js`;

        try {
            const module = await import(jsPath);
            if (typeof module.init === "function") {
                await module.init(container);
            }
        } catch {}

    } catch (error) {
        container.innerHTML = `<h1>Ошибка: ${error.message}</h1>`;
    }
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
