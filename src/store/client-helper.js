import { ref, computed, watch } from 'vue';
import { restaurants, logout, lastOrderForUser } from '/src/store/axios-helper.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type.js'
import { COOKIE_NAME } from '/src/store/strings/cookie-name.js'
import { cheсkProductAvailabilityForCart } from '/src/store/models/product'

export const selectedCity = ref()
export const selectedRestaurant = ref()
export const selectedOrderType = ref()
export const selectedOrderInRestaurantType = ref()
export const selectedAddressForDelivery = ref(null)
export const productsInCart = ref([])
export const currentOrder = ref()

watch(selectedCity, () => {
   localStorage.setItem(COOKIE_NAME.CITY_ID, selectedCity.value.id)
})

watch(selectedRestaurant, () => {
   localStorage.setItem(COOKIE_NAME.RESTAURANT_ID, selectedRestaurant.value.id)
})

watch(selectedOrderType, () => {
   localStorage.setItem(COOKIE_NAME.ORDER_TYPE, selectedOrderType.value)
})

watch(selectedOrderInRestaurantType, () => {
   localStorage.setItem(COOKIE_NAME.ORDER_IN_RESTAURANT_TYPE, selectedOrderInRestaurantType.value)
})

watch(selectedAddressForDelivery, () => {
   // не перезаписывать куки, когда не удалость установть адрес
   // установка адреса происходит в order-panel.vue
   if (selectedAddressForDelivery.value == null) return

   localStorage.setItem(COOKIE_NAME.ADDRESS_DELIVERY_ID, selectedAddressForDelivery.value.id)
})

export function logoutClient() {
   logout()

   lastOrderForUser.value = null

   removeAllProductsFromCart()
   localStorage.removeItem(COOKIE_NAME.ADDRESS_DELIVERY_ID)
   localStorage.removeItem(COOKIE_NAME.CART)
}

export const deliveryAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.title === selectedCity.value.title) {
         if (restaurants.value[i].delivery_available)
            return true
      }
   }
   return false
})

export const pickUpAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.title === selectedCity.value.title) {
         if (restaurants.value[i].pick_up_at_counter_available ||
            restaurants.value[i].pick_up_at_car_window_available)
            return true
      }
   }
   return false
})

export const restaurantAvailableInSelectedCity = computed(() => {
   if (restaurants.value == null) return false
   if (selectedCity.value == null) return false

   for (let i = 0; i < restaurants.value.length; i++) {
      if (restaurants.value[i].city.title === selectedCity.value.title) {
         if (restaurants.value[i].at_restaurant_at_counter_available ||
            restaurants.value[i].at_restaurant_to_table_available ||
            restaurants.value[i].at_restaurant_to_parking_available
         )
            return true
      }
   }
   return false
})

//при смене города сменить способ доставки на первый доступный
watch([selectedCity, pickUpAvailableInSelectedCity, deliveryAvailableInSelectedCity, restaurantAvailableInSelectedCity], () => {
   if (selectedOrderType.value) {
      //если способ доставки выбран и не поддерживается в новом городе, то сменить на первый доступный
      if (selectedOrderType.value == ORDER_TYPE.delivery && deliveryAvailableInSelectedCity.value == false ||
         selectedOrderType.value == ORDER_TYPE.pickUp && pickUpAvailableInSelectedCity.value == false ||
         selectedOrderType.value == ORDER_TYPE.inRestaurant && restaurantAvailableInSelectedCity.value == false
      ) {
         if (deliveryAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.delivery
         }
         else if (pickUpAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.pickUp
         }
         else if (restaurantAvailableInSelectedCity.value) {
            selectedOrderType.value = ORDER_TYPE.inRestaurant
         }
      }
   }
   else {
      if (deliveryAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.delivery
      }
      else if (pickUpAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.pickUp
      }
      else if (restaurantAvailableInSelectedCity.value) {
         selectedOrderType.value = ORDER_TYPE.inRestaurant
      }
   }
})

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
   if (selectedOrderType.value != ORDER_TYPE.delivery)
      return 0;

   if (totalProductPrice.value >= selectedCity.value.order_value_for_free_delivery)
      return 0;

   return Number(selectedCity.value.delivery_price)
})

export const totalPrice = computed(() => {
   return Number(totalProductPrice.value + deliveryPrice.value)
})

export function plusProductToCart(product, userConfig, quantity = 1) {
   if(!cheсkProductAvailabilityForCart(product)) return

   if (userConfig) {
      if (productsInCart.value.includes(userConfig)) {
         userConfig.countInCart += quantity
      }
      else {
         userConfig.countInCart = quantity

         userConfig.id = product.id //для передачи на бэк и нициализации

         userConfig.title = product.title
         userConfig.image_url = product.image_url
         // userConfig.isUserConfig = true

         productsInCart.value.push(userConfig)
      }
   }
   else {
      if (productsInCart.value.includes(product)) {
         product.countInCart += quantity
      }
      else {
         product.countInCart = quantity
         productsInCart.value.push(product)
      }
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function minusProductInCartForCartPanel(product, userConfig) {
   if (userConfig) {
      if (userConfig.countInCart == 0) return
      userConfig.countInCart--
   }
   else {
      if (product.countInCart == 0) return
      product.countInCart--
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function minusProductInCartForMenuPage(product, userConfig) {
   if (userConfig) {
      userConfig.countInCart--

      if (userConfig.countInCart <= 0) removeProductFromCart(product, userConfig)
   }
   else {
      product.countInCart--

      if (product.countInCart <= 0) removeProductFromCart(product)
   }


   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function removeProductFromCart(product, userConfig) {
   if (userConfig) {
      userConfig.countInCart = 0;
      let index = productsInCart.value.indexOf(userConfig)
      if (index !== -1) productsInCart.value.splice(index, 1);
   }
   else {
      product.countInCart = 0;
      let index = productsInCart.value.indexOf(product)
      if (index !== -1) productsInCart.value.splice(index, 1);
   }

   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

export function removeAllProductsFromCart() {
   productsInCart.value.forEach(el => el.countInCart = 0)

   productsInCart.value.length = 0
   localStorage.setItem(COOKIE_NAME.CART, JSON.stringify(productsInCart.value))
}

