import { company } from '/src/store/axios-helper.js'
import { activateDialogMini } from '/src/store/client/block/dialog-mini'

function isTimeForRestaurantIsOpen() {
    if (!company.value.open_time || !company.value.close_time) return true

    const openTime = company.value.open_time; // '09:00'
    const closeTime = company.value.close_time; // '21:00'

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // текущее время в минутах

    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

    const openTimeInMinutes = openHours * 60 + openMinutes; // время открытия в минутах
    const closeTimeInMinutes = closeHours * 60 + closeMinutes; // время закрытия в минутах
        
    if(openTimeInMinutes < closeTimeInMinutes) {
        return currentTime >= openTimeInMinutes && currentTime < closeTimeInMinutes;
    }
    else {
        return currentTime >= openTimeInMinutes || currentTime < closeTimeInMinutes;
    }
}

export function checkTimeAndActivateDialog() {
    if (isTimeForRestaurantIsOpen()) return true

    activateDialogMini(['Мы принимаем заказы',
        `с ${company.value.open_time} до ${company.value.close_time}`,
        'Пока вы можете добавить их в корзину'])
        
    return false
}
