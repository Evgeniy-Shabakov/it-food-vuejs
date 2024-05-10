import { categories, countries, restaurants, getModelsAxios, getAuthUser } from '/src/store/axios-helper.js'
import { selectedCity, productsInCart, selectedRestaurant, selectedOrderOption } from '/src/store/client-helper.js'

export async function initialize() {

    await initializeCategories()

    initializeCart()

    initializeCity()

    initializeOrderOption()

    initializeRestaurant()

    getAuthUser()
}

function initializeOrderOption() {
    if (localStorage.getItem('order-option')) {
        selectedOrderOption.value = JSON.parse(localStorage.getItem('order-option'))
    }
}

async function initializeCity() {
    await getModelsAxios('countries')

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
}

async function initializeRestaurant() {
    await getModelsAxios('restaurants')

    for (let i = 0; i < restaurants.value.length; i++) {
        if (restaurants.value[i].city.title === selectedCity.value.title) {
            selectedRestaurant.value = restaurants.value[i]
            break
        }
    }
}

async function initializeCategories() {
    await getModelsAxios('categories')
        .then(() => {
            //убираем из списка неактивные продукты и пустые категории чтобы не отображались
            categories.value.forEach(category => {
                category.products = category.products.filter(product => product.is_active == true)
            })
            categories.value = categories.value.filter(category => category.products.length > 0)
        }
        )
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