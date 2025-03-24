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

export function cheсkProductAvailabilityForCart(product){
   if (!product.is_active) return false
   if (product.is_in_stop_list) return false

   return true
}