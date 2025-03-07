import { COOKIE_NAME } from '/src/store/strings/cookie-name'
import {
    getProductById,
    initializeUserBaseIngredientsForProductTemporary,
    initializeUserAdditonalIngredientsForProductTemporary,
} from '/src/store/client/popup-pages/ingredients-editor'

const productsWithUserConfigsForCookies = []

export function initializeUserConfigsForProducts() {
    if (localStorage.getItem(COOKIE_NAME.PRODUCTS_WITH_USER_CONFIGS) == null) return

    const savedProductsWithUserConfigs = JSON.parse(localStorage.getItem(COOKIE_NAME.PRODUCTS_WITH_USER_CONFIGS))

    for (let savedProduct of savedProductsWithUserConfigs) {
        const product = getProductById(savedProduct.id)

        if (!product) continue

        product.userConfigs = []

        for (let savedUserConfig of savedProduct.userConfigs) {

            let needContinue = false
            initializeUserAdditonalIngredientsForProductTemporary(product)

            for (let ingredient of savedUserConfig.additionalIngredients) {
                const additionalIngredient =
                    product.userAdditionalIngredientsTemporary.find(el => el.ingredient.id == ingredient.id)

                if (additionalIngredient) {
                    additionalIngredient.quantity = ingredient.quantity
                }
                else {
                    needContinue = true //если нет хотя бы одного дополнительного ингредиента
                    break            //то не добавляем savedUserConfig в product.userConfigs
                }
            }

            if (needContinue) continue

            initializeUserBaseIngredientsForProductTemporary(product)

            //если изменилось количество базовых ингредиентов, то сохраненный конфиг также невалиден
            if (product.userBaseIngredientsTemporary.length != savedUserConfig.baseIngredients.length) {
                continue
            }

            for (let [index, ingredient] of savedUserConfig.baseIngredients.entries()) {
                if (!product.userBaseIngredientsTemporary[index].ingredient.replacements
                    .find(el => el.id == ingredient.id)) {
                    needContinue = true //если сохраненного ингредиента больше нет в списке замен по этой позиции
                    break               //то не добавляем savedUserConfig в product.userConfigs
                }

                product.userBaseIngredientsTemporary[index].isDelete = ingredient.isDelete

                if (product.userBaseIngredientsTemporary[index].ingredient != ingredient.id) {

                    const replace = product.userBaseIngredientsTemporary[index].ingredient.replacements
                        .find(el => el.id == ingredient.id)

                    Object.keys(replace).forEach(key => {
                        if (product.userBaseIngredientsTemporary[index].ingredient.hasOwnProperty(key)) {
                            product.userBaseIngredientsTemporary[index].ingredient[key] = replace[key];
                        }
                    })

                }
            }

            if (needContinue) continue

            product.userConfigs.push({
                id: savedUserConfig.id,
                productID: product.id,
                baseIngredients: JSON.parse(JSON.stringify(product.userBaseIngredientsTemporary)),
                additionalIngredients: JSON.parse(JSON.stringify(product.userAdditionalIngredientsTemporary))
            })

        }
    }
}

export function rerecordProductWithUserConfigs(product) {
    const index = productsWithUserConfigsForCookies.findIndex(item => item.id == product.id)

    if (index >= 0) productsWithUserConfigsForCookies.splice(index, 1)

    if (product.userConfigs.length > 0) {
        productsWithUserConfigsForCookies.push(
            {
                id: product.id,
                userConfigs: prepareUserConfigsForCookies(product)
            }
        )
    }

    localStorage.setItem(COOKIE_NAME.PRODUCTS_WITH_USER_CONFIGS, JSON.stringify(productsWithUserConfigsForCookies))
}

function prepareUserConfigsForCookies(product) {
    const userConfigs = []

    product.userConfigs.forEach(userConfig => {

        const baseIngredients = []
        const additionalIngredients = []

        userConfig.baseIngredients.forEach(ingredient => {
            baseIngredients.push({
                id: ingredient.ingredient.id,
                isDelete: ingredient.isDelete
            })
        })

        userConfig.additionalIngredients.forEach(ingredient => {
            if (ingredient.quantity) {
                additionalIngredients.push({
                    id: ingredient.ingredient.id,
                    quantity: ingredient.quantity
                })
            }
        })

        userConfigs.push({ 
            id: userConfig.id,
            productID: product.id,
            baseIngredients, 
            additionalIngredients 
        })
    })

    return userConfigs
}