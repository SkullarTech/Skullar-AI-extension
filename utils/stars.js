// Настройка звёздного фона
let canvas;
let context;
let screenH;
let screenW;
let stars = [];

const fps = 20;         // Кадров в секунду
const numStars = 35;   // Кол-во звёзд

// Когда страница загрузилась
window.addEventListener("DOMContentLoaded", () => {
  // Размер экрана (или popup окна)
  screenH = window.innerHeight;
  screenW = window.innerWidth;

  // Получаем canvas
  canvas = document.getElementById("space");
  if (!canvas) return;

  // Устанавливаем размер и прозрачный фон
  canvas.height = screenH;
  canvas.width = screenW;
  canvas.style.background = "transparent";

  // Получаем контекст рисования
  context = canvas.getContext("2d");

  // Генерируем массив звёзд
  for (let i = 0; i < numStars; i++) {
    const x = Math.random() * screenW;
    const y = Math.random() * screenH;
    const length = 1 + Math.random() * 0.6; // * 1 ( размер )
    const opacity = Math.random();

    stars.push(new Star(x, y, length, opacity));
  }

  // Запускаем анимацию
  setInterval(animate, 1000 / fps);
});

// Основной цикл анимации
function animate() {
  context.clearRect(0, 0, screenW, screenH);

  // Отрисовываем каждую звезду
  stars.forEach((star) => {
    star.draw(context);
  });
}

// Конструктор звезды
function Star(x, y, length, opacity) {
  this.x = x;
  this.y = y;
  this.length = length;
  this.opacity = opacity;
  this.maxOpacity = 0.4 + Math.random() * 0.6; // случайный максимум: от 0.4 до 1.0
  this.factor = 1;
  this.increment = Math.random() * 0.03;
}


// Метод отрисовки звезды
Star.prototype.draw = function () {
  context.save();

  // Мерцание: изменяем прозрачность
  if (this.opacity > this.maxOpacity) this.factor = -1;
  else if (this.opacity <= 0) {
    this.factor = 1;
    this.x = Math.random() * screenW;
    this.y = Math.random() * screenH;
    this.maxOpacity = 0.4 + Math.random() * 0.6; // обновим максимум
  }

  this.opacity += this.increment * this.factor;

  // Рисуем круглую "точку-звезду"

  context.beginPath();
  context.arc(this.x, this.y, this.length, 0, Math.PI * 2, false);
  context.closePath();

  context.fillStyle = `rgba(134, 134, 255, ${this.opacity})`;
  context.shadowBlur = 8;
  context.shadowColor = 'rgba(134, 134, 255, 0.8)';
  context.fill();

  context.restore();
};


// // Метод отрисовки звезды
// Star.prototype.draw = function () {
//   context.save();
//   context.translate(this.x, this.y);
//   context.rotate((Math.PI * 1) / 10);

//   // Мерцание
//   if (this.opacity > 1) this.factor = -1;
//   else if (this.opacity <= 0) {
//     this.factor = 1;
//     this.x = Math.random() * screenW;
//     this.y = Math.random() * screenH;
//   }

//   this.opacity += this.increment * this.factor;

//   // Отрисовка формы звезды
//   context.beginPath();
//   for (let i = 5; i--;) {
//     context.lineTo(0, this.length);
//     context.translate(0, this.length);
//     context.rotate((Math.PI * 2) / 10);
//     context.lineTo(0, -this.length);
//     context.translate(0, -this.length);
//     context.rotate(-(Math.PI * 6) / 10);
//   }

//   context.lineTo(0, this.length);
//   context.closePath();

//   // Стиль звезды
//   context.fillStyle = `rgba(134, 134, 255, ${this.opacity})`;
//   context.shadowBlur = 5;
//   context.shadowColor = '#ffff33';
//   context.fill();

//   context.restore();
// };
