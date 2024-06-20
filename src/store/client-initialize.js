import { categories, countries, restaurants } from '/src/store/axios-helper.js'
import { selectedCity, productsInCart, selectedRestaurant, selectedOrderType } from '/src/store/client-helper.js'
import {
    loadCurrentAuthUser, loadCountries, loadCategories, loadRestaurants
} from '/src/store/loading-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'

export async function initialize() {

    try {
        await Promise.all([
            initializeCategories(),
            initializeCity(),
            initializeRestaurant(),
            loadCurrentAuthUser(),
        ])

        initializeCart()
        initializeOrderType()
        return LOADING_TYPE.complete

    } catch (err) {
        console.log(err);
        return LOADING_TYPE.error;
    }
}

async function initializeCategories() {
    const loadinType = await loadCategories()

    if (loadinType === LOADING_TYPE.error) return LOADING_TYPE.error

    //убираем из списка неактивные продукты и пустые категории чтобы не отображались
    categories.value.forEach(category => {
        category.products = category.products.filter(product => product.is_active == true)
    })
    categories.value = categories.value.filter(category => category.products.length > 0)

    return LOADING_TYPE.complete
}

export async function initializeCity() {
    const loadinType = await loadCountries()

    if (loadinType === LOADING_TYPE.error) return LOADING_TYPE.error

    if (localStorage.getItem('city')) {
        selectedCity.value = JSON.parse(localStorage.getItem('city'))
    }

    else {
        for (let i = 0; i < countries.value.length; i++) {
            if (countries.value[i].cities.length) {
                selectedCity.value = countries.value[i].cities[0]
                break
            }
        }
    }

    return LOADING_TYPE.complete
}

async function initializeRestaurant() {
    const loadinType = await loadRestaurants()

    if (loadinType === LOADING_TYPE.error) return LOADING_TYPE.error

    for (let i = 0; i < restaurants.value.length; i++) {
        if (restaurants.value[i].city.title === selectedCity.value.title) {
            selectedRestaurant.value = restaurants.value[i]
            break
        }
    }

    return LOADING_TYPE.complete
}

function initializeCart() {
    //обновляем массив для корзины, если есть данные в localStorage
    if (localStorage.getItem('cart') == null) return

    let oldProductsInCart = JSON.parse(localStorage.getItem('cart'))
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
    if (localStorage.getItem('order-type')) {
        selectedOrderType.value = JSON.parse(localStorage.getItem('order-type'))
    }
}





