import { categories, cities, activeDesign, company } from '/src/store/axios-helper.js'
import {
   selectedCity, selectedRestaurant, selectedOrderType,
   selectedOrderInRestaurantType, plusProductToCart
}
   from '/src/store/client-helper.js'
import {
   loadCompany, loadCurrentAuthUser, loadCities, loadCategories, loadRestaurants, loadActiveDesign
} from '/src/store/loading-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type.js'
import { ORDER_IN_RESTAURANT_TYPE } from '/src/store/data-types/order-in-restaurant-type'
import { COOKIE_NAME } from '/src/store/strings/cookie-name.js'
import { restaurants } from './axios-helper'
import { adjustColor } from '/src/store/color'
import { initializeUserConfigsForProducts } from '/src/store/client/save/user-configs-products'
import { checkOperatingModeAndActivateDialog } from '/src/store/client/open-close-time'
import { findProductById } from '/src/store/models/product'

export async function initialize() {

   try {
      await initializeCategories()

      initializeDesign()

      initializeCity().then(() => initializeRestaurant())

      loadCompany().then(() => checkOperatingModeAndActivateDialog())

      loadCurrentAuthUser()

      initializeUserConfigsForProducts()

      initializeCart()
      initializeOrderType()
      initializeOrderInRestaurantType()

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

async function initializeCategories() {
   try {
      await loadCategories()

      //убираем из списка неактивные продукты и пустые категории чтобы не отображались
      categories.value.forEach(category => {
         category.products = category.products.filter(product => product.is_active == true)
      })
      categories.value = categories.value.filter(category => category.products.length > 0)

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

export async function initializeCity() {
   try {
      await loadCities()

      let id = localStorage.getItem(COOKIE_NAME.CITY_ID)

      if (id)
         selectedCity.value = cities.value.find(city => city.id == id)

      if (selectedCity.value == null)
         selectedCity.value = cities.value[0]

      return LOADING_TYPE.complete
   }
   catch (error) {
      console.log(error)
      throw error
   }
}

export async function initializeRestaurant() {
   try {
      await loadRestaurants()

      let id = localStorage.getItem(COOKIE_NAME.RESTAURANT_ID)

      if (id)
         selectedRestaurant.value = restaurants.value.find(restaurant => restaurant.id == id)

      //добавить проверку на соотвествие ресторана городу
      if (selectedRestaurant.value == null)
         selectedRestaurant.value = restaurants.value[0]

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}

function initializeCart() {
   if (localStorage.getItem(COOKIE_NAME.CART) == null) return

   let oldProductsInCart = JSON.parse(localStorage.getItem(COOKIE_NAME.CART))

   //т.к. инициализация корзины сложный процесс, учитывая изменения в товарах и ингредиентах
   //то оборачиваем в try catch
   try {
      oldProductsInCart.forEach(oldProduct => {

         if (!oldProduct.isUserConfig) {
               const product = findProductById(oldProduct.id) 

               if (product) plusProductToCart(product, null, oldProduct.countInCart)
         }
         else {
               const product = findProductById(oldProduct.productID) 

               if (product && Array.isArray(product.userConfigs)) {
                  let userConfig = product.userConfigs.find(el => el.id == oldProduct.id)

                  if (userConfig) {
                     plusProductToCart(product, userConfig, oldProduct.countInCart)
                  }
               }
         }

      })
   }
   catch (error) {
      console.log(error)
      localStorage.removeItem(COOKIE_NAME.CART)
      //throw error - ошибку не выбрасываем, чтобы не прерывать работу приложения, 
      //а просто удаляем все с корзины
   }
}

function initializeOrderType() {
   selectedOrderType.value = localStorage.getItem(COOKIE_NAME.ORDER_TYPE)

   if (selectedOrderType.value == null)
      selectedOrderType.value = ORDER_TYPE.delivery
}

function initializeOrderInRestaurantType() {
   selectedOrderInRestaurantType.value = localStorage.getItem(COOKIE_NAME.ORDER_IN_RESTAURANT_TYPE)

   if (selectedOrderInRestaurantType.value == null)
      selectedOrderInRestaurantType.value = ORDER_IN_RESTAURANT_TYPE.COUNTER
}

export async function initializeDesign() {
   try {
      await loadActiveDesign()

      // Получаем корневой элемент документа
      const root = document.documentElement

      // Устанавливаем новое значение для CSS переменной
      root.style.setProperty('--background_page_main_color', activeDesign.value.background_page_main_color)
      root.style.setProperty('--background_page_elements_color', activeDesign.value.background_page_elements_color)
      root.style.setProperty('--brand-color', activeDesign.value.brand_color)
      root.style.setProperty('--text_color_main', activeDesign.value.text_color_main)
      root.style.setProperty('--text-color-on-brand-color', activeDesign.value.text_color_on_brand_color)
      root.style.setProperty('--text_color_accent', activeDesign.value.text_color_accent)
      root.style.setProperty('--bottom_nav_color', activeDesign.value.bottom_nav_color)

      root.style.setProperty('--brand-color-hover', adjustColor(activeDesign.value.brand_color, -20))
      root.style.setProperty('--brand-color-active', adjustColor(activeDesign.value.brand_color, 20))
      root.style.setProperty('--background-active-category', adjustColor(activeDesign.value.brand_color, 125))
      root.style.setProperty('--border-color-order-settings', adjustColor(activeDesign.value.background_page_main_color, -70))

      return LOADING_TYPE.complete
   }
   catch (err) {
      console.log(err)
      throw err
   }
}





