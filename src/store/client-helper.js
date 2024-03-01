import { ref, computed } from 'vue';

export const productsInCart = ref([])

export const totalCountInCart = computed(() => {
    let total = 0
    productsInCart.value.forEach(element => {
        total += element.countInCart
    })
    return total
})

export const totalPrice = computed(() => {
    let total = 0
    productsInCart.value.forEach(element => {
        total += element.countInCart * element.price_default
    })
    return total
})

export function addProductToCart(product) {
    if (productsInCart.value.includes(product)) {
        product.countInCart++
    }
    else {
        product.countInCart = 1
        productsInCart.value.push(product)
    }

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}

export function reduceCountProductInCart(product) {
    if (product.countInCart == 0) return
    product.countInCart--

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}

export function removeProductFromCart(product) {
    product.countInCart = 0;
    let index = productsInCart.value.indexOf(product)
    if (index !== -1) productsInCart.value.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(productsInCart.value))
}