
export function createUserConfigForProduct(product, baseIngredients, additionalIngredients, userConfigID) {
   if (!product.userConfigs) product.userConfigs = []

   product.userConfigs.push({
      userConfigID: userConfigID || Date.now(),
      baseIngredients: JSON.parse(JSON.stringify(baseIngredients)),
      additionalIngredients: JSON.parse(JSON.stringify(additionalIngredients))
   })
}