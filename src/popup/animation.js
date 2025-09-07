// popup/animation.js

export let button, text, bar, check, img;

// Инициализация элементов DOM после загрузки документа
document.addEventListener("DOMContentLoaded", () => {
    button = document.getElementById("send");
    if (button) {
        text = button.querySelector(".text");
        bar = button.querySelector(".progress-bar");
        check = button.querySelector(".checkmark");
        img = button.querySelector("img");
    }
});

let animationCanceled = false;
export let currentProgress = 0;

export async function animateTo(percent, speed = 70) { // async - чтобы не останавливать процесс, а заполнять шакалу параллельно
    animationCanceled = false;
    
    text.style.opacity = "0";
    button.style.borderRadius = "100px";
    button.style.width = "220px"; // 200 / 220 / 300
    button.style.height = "10px";

    setTimeout(() => {
        const interval = setInterval(() => {

            if (animationCanceled) {
                clearInterval(interval);
                return;
            }

            if (currentProgress >= percent) {
                clearInterval(interval);

                if (percent === 100) {
                    button.style.width = "40px";
                    button.style.height = "40px";
                    // button.style.padding = "0px";
                    button.style.borderRadius = "80px";
                    bar.style.width = "100%";
                    check.style.transform = "scale(1)";
                    setTimeout(() => resetButton(), 2000);
                }
                return;
            }
            currentProgress += 1;
            bar.style.width = currentProgress + "%";

        }, speed); // 70
    }, 300);
}

export function resetButton() {
    animationCanceled = true;
    currentProgress = 0;

    bar.style.width = "0%";
    check.style.transform = "scale(0)";
    button.style.width = "200px";
    button.style.height = "60px";
    button.style.borderRadius = "16px";

    setTimeout(() => {
        text.style.opacity = "1";
    }, 300);
}