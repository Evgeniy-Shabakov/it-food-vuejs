export function adjustColor(hex, amount) {
    // Преобразуем HEX в число.
    let color = parseInt(hex.startsWith("#") ? hex.slice(1) : hex, 16);
    // Регулируем каждый компонент RGB в пределах 0-255.
    let r = Math.min(255, Math.max(0, (color >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((color & 0x00FF00) >> 8) + amount));
    let b = Math.min(255, Math.max(0, (color & 0x0000FF) + amount));
    // Возвращаем исправленный цвет в HEX-формате.
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }