// spa/router.js

import { renderGuide } from './guide.js';

const app = document.getElementById('app');

function renderRoute() {
  const route = location.hash.slice(1);
  if (route === '/new-user/guide') {
    renderGuide(app);
  } else {
    app.innerHTML = '<h1>Страница не найдена</h1>';
  }
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);
