
export function createUserConfigForProduct(product, baseIngredients, additionalIngredients, id) {
   if (!product.userConfigs) product.userConfigs = []

   product.userConfigs.push({
      id: id || Date.now(),
      productID: product.id,
      baseIngredients: JSON.parse(JSON.stringify(baseIngredients)),
      additionalIngredients: JSON.parse(JSON.stringify(additionalIngredients))
   })
}