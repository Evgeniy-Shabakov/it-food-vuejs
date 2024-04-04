// Функция устанавливает динамическую высоту видимой области
function setViewportProperty() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh-mobile', `${vh}px`);
}

// Реагируем на изменение размеров экрана
window.addEventListener('resize', setViewportProperty);

// Выполняем инициализацию
setViewportProperty();