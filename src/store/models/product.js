import { categories } from '/src/store/axios-helper.js'

export function findProductById(id) {
   for (const category of categories.value) {
      const product = category.products.find(product => product.id === id)
      if (product) {
         return product
      }
   }
   return null;
}

export function setStatusAllIngredientsIsAvailableForProdacts() {
   categories.value.forEach(category => {
      category.products.forEach(product => {
         product.allIngredientIsAvailable = checkAvailabilityIngredientsForProduct(product)
      })
   })
}

export function checkProductAvailabilityForCart(product) {
   if (!product) return false
   if (!product.is_active) return false
   if (product.is_in_stop_list) return false
   if (!product.allIngredientIsAvailable) return false

   return true
}

function checkAvailabilityIngredientsForProduct(product) {
   if (!product) return false

   for (let ingredient of product.base_ingredients) {
      if (!ingredient.is_active) return false
      if (ingredient.is_in_stop_list) return false
   }

   return true
}