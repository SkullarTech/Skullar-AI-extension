// spa/guide.js

import { fetchToken } from "../utils/token.js";

export function renderGuide(container) {

  container.innerHTML = `
    <div class="auth-card">
        <div class = "img_block">
            <img src="../assets/skull-calc.png" alt="AutoSolve logo" class="auth-image" />
        </div>

        <p class="description">
            Для начала работы с расширением<br />
            запустите нашего Telegram-бота<br />
            и введите ваш токен:
        </p>

        <input type="text" id="token" placeholder="Ваш токен" class="token-input" />
        <button id="submit" class="submit-btn">Продолжить</button>

        <a href="https://t.me/skullar_bot" class="tg-link" target="_blank">
            Запустить Telegram-бота
        </a>
    </div>
  `;


    document.getElementById("submit").onclick = async () => {
        const token = document.getElementById("token").value.trim();

        const tokenData = await fetchToken(token);

        if (tokenData) {
            chrome.storage.local.set({ auth_token: token }, () => {
                alert("✅ Токен сохранён!");
                window.close();
            });
        } else {
            alert("❌ Неверный токен. Пожалуйста, попробуйте ещё раз.");
        }

    };
    
}
