import router from "/src/router.js"
import { getActiveOrdersForUser, categories } from '/src/store/axios-helper.js'
import { plusProductToCart, removeAllProductsFromCart, productsInCart }
   from '/src/store/client-helper.js'
import { activateDialogMini } from '/src/store/client/block/dialog-mini'
import { findProductById, cheсkProductAvailabilityForCart } from '/src/store/models/product'

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

   for (const productInOrder of order.products) {

      const product = findProductById(productInOrder.id)

      if (!product) continue
      if (!cheсkProductAvailabilityForCart(product)) continue

      if (!productInOrder.user_config_id) {
         plusProductToCart(product, null, productInOrder.quantity)
      }

      if (productInOrder.user_config_id && product.userConfigs) {
         let userConfig = product.userConfigs.find(el => el.userConfigID == productInOrder.user_config_id)

         if (userConfig) {
            plusProductToCart(product, userConfig, productInOrder.quantity)
         }
      }

   }

   if (productsInCart.value.length == order.products.length) {
      router.push({ name: 'client.menu.popup.cart' })
   }

   else if (productsInCart.value.length > 0) {
      router.push({ name: 'client.menu.popup.cart' })

      activateDialogMini(['Не все товары добавлены в корзину, возможно некоторые товары временно недоступны, попробуйте добавить их из меню'])
   }

   else {
      activateDialogMini(['Товары не добавлены в корзину, возможно они временно недоступны, попробуйте добавить их из меню'])
   }
}