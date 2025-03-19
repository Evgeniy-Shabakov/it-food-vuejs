import { categories, ingredients, getModelsAxios } from '/src/store/axios-helper.js'

export async function initializeStopList() {
   await getModelsAxios('categories')

   //убираем из списка неактивные продукты и пустые категории чтобы не отображались
   categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
   })
   categories.value = categories.value.filter(category => category.products.length > 0)

   //убираем из списка неактивные ингредиенты 
   await getModelsAxios('ingredients')

   ingredients.value = ingredients.value.filter(ingredient => ingredient.is_active)
}