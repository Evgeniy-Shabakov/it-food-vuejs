import { selectedCity, selectedAddressForDelivery } from '/src/store/client-helper.js'
import { authUser } from '/src/store/axios-helper.js'
import { COOKIE_NAME } from '/src/store/strings/cookie-name.js'

export function setAddressForDelivery() {
    let id = localStorage.getItem(COOKIE_NAME.ADDRESS_DELIVERY_ID)

    if (id)
        selectedAddressForDelivery.value = authUser.value.addresses.find(address => address.id == id)

    // если город выбранного адреса не совпадает с текущим городом или не установлен
    // то найти первый адрес в текущем городе
    // иначе selectedAddressForDelivery.value присвоить undefined 
    if (selectedAddressForDelivery.value == null
        || selectedAddressForDelivery.value.city.id != selectedCity.value.id) {

        selectedAddressForDelivery.value = authUser.value.addresses
            .find(address => address.city.id === selectedCity.value.id)
    }
}