// utils/performActions.js

/**
 * Выполняет действия на странице в указанной вкладке.
 *    tabId - ID вкладки Chrome.
 *    actions - Массив действий, каждое содержит xpath, action и text.
 */

export async function performActions(tabId, actions) {
	await chrome.scripting.executeScript({
		target: { tabId },

		// Эта функция будет выполнена в контексте страницы
		func: async (actions) => {
			// Задержка (пауза)
			const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

			// Находит DOM-элемент по XPath.
			function getElementByXPath(xpath) {
				return document
					.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
					.singleNodeValue;
			}

			// Имитирует клик по элементу.
			// el - DOM-элемент для клика.
			function simulateClick(el) {
				const event = new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					view: window,
				});
				el.dispatchEvent(event);
			}

			// Проходим по всем действиям
			for (const act of actions) {
				const el = getElementByXPath(act.xpath);

				// Если элемент не найден — пропускаем действие
				if (!el) {
					console.warn("Элемент не найден для действия:", act);
					continue;
				}

				// Ввод текста в поле (например, input)
				if (act.action === "print" && act.text !== null) {
					el.focus();
					el.value = act.text;

					// Важно для корректной работы с фреймворками (React/Vue)
					el.dispatchEvent(new Event("input", { bubbles: true }));

				// Симуляция клика по элементу
				} else if (act.action === "click") {
					el.focus();
					simulateClick(el);
				}

				// Пауза между действиями (например, 500 мс)
				await sleep(300);
			}
		},

		// Аргументы, передающиеся внутрь `func`
		args: [actions],
	});
}
