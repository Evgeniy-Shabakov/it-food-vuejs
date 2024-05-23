import { ref, computed, watch } from 'vue';
import { restaurants } from '/src/store/axios-helper.js'
import { OrderType } from '/src/store/order-type';

export const selectedCity = ref()
export const selectedRestaurant = ref()
export const selectedOrderType = ref(OrderType.Delivery)
export const selectedAddressForDelivery = ref()

watch(selectedCity, () => {
    localStorage.setItem('city', JSON.stringify(selectedCity.value))
})

watch(selectedOrderType, () => {
    localStorage.setItem('order-type', JSON.stringify(selectedOrderType.value))
})

watch(selectedAddressForDelivery, () => {
    localStorage.setItem('address-for-delivery', JSON.stringify(selectedAddressForDelivery.value))
})

export const pickUpAvailableInSelectedCity = computed(() => {
    if (restaurants.value == null) return false

    for (let i = 0; i < restaurants.value.length; i++) {
        if (restaurants.value[i].city.title === selectedCity.value.title) {
            if (restaurants.value[i].pick_up_available)
                return true
        }
    }
    return false
})

export const deliveryAvailableInSelectedCity = computed(() => {
    if (restaurants.value == null) return false

    for (let i = 0; i < restaurants.value.length; i++) {
        if (restaurants.value[i].city.title === selectedCity.value.title) {
            if (restaurants.value[i].delivery_available)
                return true
        }
    }
    return false
})

export const restaurantAvailableInSelectedCity = computed(() => {
    if (restaurants.value == null) return false

    for (let i = 0; i < restaurants.value.length; i++) {
        if (restaurants.value[i].city.title === selectedCity.value.title) {
            if (restaurants.value[i].pick_up_available_at_the_restaurant_counter ||
                restaurants.value[i].delivery_available_at_the_restaurant_to_the_table ||
                restaurants.value[i].pick_up_available_at_the_car_window ||
                restaurants.value[i].delivery_available_in_the_parking_to_car
            )
                return true
        }
    }
    return false
})

//при смене города сменить способ доставки на первый доступный
watch([selectedCity, pickUpAvailableInSelectedCity, deliveryAvailableInSelectedCity, restaurantAvailableInSelectedCity], () => {
    if (localStorage.getItem('order-option')) {
        //если способ доставки выбран и не поддерживается в новом городе, то сменить на первый доступный
        if (selectedOrderType.value == OrderType.Delivery && deliveryAvailableInSelectedCity.value == false ||
            selectedOrderType.value == OrderType.PickUp && pickUpAvailableInSelectedCity.value == false ||
            selectedOrderType.value == OrderType.InRestaurant && restaurantAvailableInSelectedCity.value == false
        ) {
            if (deliveryAvailableInSelectedCity.value) {
                selectedOrderType.value = OrderType.Delivery
            }
            else if (pickUpAvailableInSelectedCity.value) {
                selectedOrderType.value = OrderType.PickUp
            }
            else if (restaurantAvailableInSelectedCity.value) {
                selectedOrderType.value = OrderType.InRestaurant
            }
        }
    }
    else {
        if (deliveryAvailableInSelectedCity.value) {
            selectedOrderType.value = OrderType.Delivery
        }
        else if (pickUpAvailableInSelectedCity.value) {
            selectedOrderType.value = OrderType.PickUp
        }
        else if (restaurantAvailableInSelectedCity.value) {
            selectedOrderType.value = OrderType.InRestaurant
        }
    }
})

export const productsInCart = ref([])

export const totalCountInCart = computed(() => {
    let total = 0
    productsInCart.value.forEach(element => {
        total += element.countInCart
    })
    return total
})

export const totalProductPrice = computed(() => {
    let total = 0
    productsInCart.value.forEach(element => {
        total += element.countInCart * element.price_default
    })
    return Number(total)
})

export const deliveryPrice = computed(() => {
    if (selectedOrderType.value != OrderType.Delivery)
        return 0;

    if (totalProductPrice.value >= selectedCity.value.order_value_for_free_delivery)
        return 0;

    return Number(selectedCity.value.delivery_price)
})

export const totalPrice = computed(() => {
    return Number(totalProductPrice.value + deliveryPrice.value)
})

export function plusProductToCart(product) {
    if (productsInCart.value.includes(product)) {
        product.countInCart++
    }
    else {
        product.countInCart = 1
        productsInCart.value.push(product)
    }

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}

export function minusProductInCartForCartPanel(product) {
    if (product.countInCart == 0) return
    product.countInCart--

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}

export function minusProductInCartForMenuPage(product) {
    product.countInCart--

    if (product.countInCart <= 0) removeProductFromCart(product)

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}

export function removeProductFromCart(product) {
    product.countInCart = 0;
    let index = productsInCart.value.indexOf(product)
    if (index !== -1) productsInCart.value.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}