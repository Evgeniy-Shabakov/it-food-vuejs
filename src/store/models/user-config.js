
export function createUserConfigForProduct(product, baseIngredients, additionalIngredients, userConfigID) {
   if (!product.userConfigs) product.userConfigs = []

   product.userConfigs.push({
      userConfigID: userConfigID || Date.now(),
      baseIngredients: JSON.parse(JSON.stringify(baseIngredients)),
      additionalIngredients: JSON.parse(JSON.stringify(additionalIngredients))
   })
}

// export function checkUserConfigAvailabilityForCart(userConfig) {
//    if (!userConfig) return false

//    userConfig.baseIngredients.forEach(ingredient => {
//       if (!ingredient.is_active) return false
//       if (ingredient.is_in_stop_list) return false
//    })

//    return true
// }