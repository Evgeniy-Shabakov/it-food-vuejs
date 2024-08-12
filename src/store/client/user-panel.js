import router from "/src/router.js"
import { getActiveOrdersForUser, categories } from '/src/store/axios-helper.js'
import { plusProductToCart, removeAllProductsFromCart }
    from '/src/store/client-helper.js'

//загрузка статусов активных заказов через запрос в бэк - START
export let intervalLoadActiveOrders

export async function loadActiveOrdersForUserAndRestartInterval(userID) {
    clearInterval(intervalLoadActiveOrders)

    await getActiveOrdersForUser(userID)

    intervalLoadActiveOrders = setInterval(() => {
        getActiveOrdersForUser(userID)
    }, 30000)
}
//загрузка статусов активных заказов через запрос в бэк - END

export function repeatOrder(order) {
    if (order == null) return

    removeAllProductsFromCart()

    order.products.forEach(productInOrder => {
        let product

        categories.value.forEach(category => {
            if (product) return
            product = category.products.find(el => el.id === productInOrder.id)
        })

        if (product)
            plusProductToCart(product, productInOrder.quantity)
    })

    //сделать окно корзины тоже попап, чтобы совпадало поведение на мониторе и мобиле
    router.push({ name: 'client.cart' })
}