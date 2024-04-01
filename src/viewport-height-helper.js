function adjustViewportHeight() {
  // Приводим в соответствие высоту видимой области
  document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
}

adjustViewportHeight();

// Обрабатываем изменение ориентации экрана
window.addEventListener('orientationchange', adjustViewportHeight);