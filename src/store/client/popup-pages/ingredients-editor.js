
export function initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex = null) {
    const temporaryArray = []

    product.base_ingredients.forEach(element => {

        temporaryArray.push(
            {
                ingredient: JSON.parse(JSON.stringify(element)), //иначе оборачивает объект в Proxy
                minPrice: element.price_default,
                isDelete: false
            }
        )

        const currentIngredient = temporaryArray[temporaryArray.length - 1]

        //дополнительная цена ингредиента до замены
        //поле additionalPrice в lastUserBaseIngredient.ingredient и replace.additionalPrice
        //должно называться одинаково для правильной замены в replace-base-ingredient.vue
        currentIngredient.ingredient.additionalPrice = 0

        //добавляем сам ингредиент в список замен для удобного отображения и замены в 
        //окне для замены ингредиентов
        currentIngredient.ingredient.replacements.unshift(JSON.parse(JSON.stringify(element)))

        //удаляем лишние поля, они не нужны в массиве замен
        delete currentIngredient.ingredient.replacements[0].can_delete
        delete currentIngredient.ingredient.replacements[0].can_replace
        delete currentIngredient.ingredient.replacements[0].replacements

        //считаем дополнительную цену для каждой замены
        //поле additionalPrice в lastUserBaseIngredient.ingredient и replace.additionalPrice
        //должно называться одинаково для правильной замены в replace-base-ingredient.vue
        currentIngredient.ingredient.replacements.forEach(replace => {
            replace.additionalPrice =
                (currentIngredient.minPrice > replace.price_default)
                    ? 0 : replace.price_default - currentIngredient.minPrice;
        })
    })

    if (userConfigIndex !== null && userConfigIndex !== '') {
        temporaryArray.length = 0

        product.userConfigs[userConfigIndex].baseIngredients.forEach(el => {
            temporaryArray.push(JSON.parse(JSON.stringify(el)))
        })

    }

    product.userBaseIngredientsTemporary = temporaryArray
}

export function initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex = null) {
    const temporaryArray = []
    
    product.additional_ingredients.forEach(element => {
        temporaryArray.push(
            {
                ingredient: JSON.parse(JSON.stringify(element)), //иначе оборачивает объект в Proxy
                quantity: 0
            }
        )
    })

    if (userConfigIndex !== null && userConfigIndex !== '') {
        temporaryArray.length = 0

        product.userConfigs[userConfigIndex].additionalIngredients.forEach(el => {
            temporaryArray.push(JSON.parse(JSON.stringify(el)))
        })

    }

    product.userAdditionalIngredientsTemporary = temporaryArray
}

export function resetCurrentConfig(product, userConfigIndex = null) {
    initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
    initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex)
}
