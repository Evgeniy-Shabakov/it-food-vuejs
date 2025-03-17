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