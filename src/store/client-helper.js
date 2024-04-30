import { ref, computed } from 'vue';

export const selectedCity = ref()

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
    return total
})

export const deliveryPrice = computed(() => {
    if (totalProductPrice.value >= selectedCity.value.order_value_for_free_delivery)
        return 0;

    return selectedCity.value.delivery_price
})

export const totalPrice = computed(() => {
    return totalProductPrice.value + deliveryPrice.value
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