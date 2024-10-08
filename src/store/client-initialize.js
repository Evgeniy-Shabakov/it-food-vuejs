import { categories, cities } from '/src/store/axios-helper.js'
import { selectedCity, productsInCart, selectedRestaurant, selectedOrderType,
    selectedOrderInRestaurantType }
    from '/src/store/client-helper.js'
import {
    loadCompany, loadCurrentAuthUser, loadCities, loadCategories, loadRestaurants
} from '/src/store/loading-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { ORDER_TYPE } from '/src/store/data-types/order-type.js'
import { ORDER_IN_RESTAURANT_TYPE } from '/src/store/data-types/order-in-restaurant-type'
import { COOKIE_NAME } from '/src/store/strings/cookie-name.js'
import { restaurants } from './axios-helper'

export async function initialize() {

    try {
        await initializeCategories()

        initializeCity().then(() => initializeRestaurant())

        loadCompany()
        loadCurrentAuthUser()

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
    //обновляем массив для корзины, если есть данные в localStorage
    if (localStorage.getItem(COOKIE_NAME.CART) == null) return

    let oldProductsInCart = JSON.parse(localStorage.getItem(COOKIE_NAME.CART))

    oldProductsInCart.forEach(el => {
        categories.value.forEach(category => {
            category.products.forEach(product => {
                if (product.id == el.id) {
                    product.countInCart = el.countInCart
                    productsInCart.value.push(product)
                }
            })
        })
    })

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





