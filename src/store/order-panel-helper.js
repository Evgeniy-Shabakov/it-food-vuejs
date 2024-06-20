import { selectedCity, selectedAddressForDelivery } from '/src/store/client-helper.js'
import { authUser } from '/src/store/axios-helper.js'

export function setAddressForDelivery() {
    if (localStorage.getItem('address-for-delivery')) {
        let savedAddress = JSON.parse(localStorage.getItem('address-for-delivery'))
        if (savedAddress.city.id === selectedCity.value.id)
            selectedAddressForDelivery.value = savedAddress
        else
            setAddressForDeliveryByDefault()

        return
    }

    setAddressForDeliveryByDefault()
}

function setAddressForDeliveryByDefault() {
    authUser.value.addresses.forEach((address) => {
        if (selectedCity.value.id === address.city.id) {
            selectedAddressForDelivery.value = address
        }
    })
}