<script setup>
import { ref } from 'vue'
import { categories, getModelsAxios, updateStopListForProduct } from '/src/store/axios-helper.js'

const allowedChangeStopListStatus = ref(true)

initialize()

async function initialize() {
   await getModelsAxios('categories')

   //убираем из списка неактивные продукты и пустые категории чтобы не отображались
   categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
   })
   categories.value = categories.value.filter(category => category.products.length > 0)
}

async function changeStopListStatus(product) {
   if (allowedChangeStopListStatus.value == false) return
   allowedChangeStopListStatus.value = false

   try {
      await updateStopListForProduct(product.id, !product.stop_list)
      await initialize()
   } catch (error) {
      console.log(error)
   }

   allowedChangeStopListStatus.value = true
}
</script>

<template>
   <div class="stop-list">

      <div v-for="category in categories">

         <h3 class="stop-list__category-title">{{ category.title }}</h3>

         <div class="stop-list__items">
            <template v-for="product in category.products"
                      :key="product.id">

               <img class="stop-list__img"
                    :src="product.image_url">

               <h5 class="stop-list__product-title"
                   :class="product.stop_list ? 'stop-list__product-title--in-stop-list' : ''">
                  {{ product.title }}
               </h5>

               {{ Number(product.price_default) }} р.

               <button class="btn"
                       :class="product.stop_list ? 'btn-view' : 'btn-delete'"
                       @click="changeStopListStatus(product)">
                  {{ product.stop_list ? 'Удалить из стоп-листа' : 'Добавить в стоп лист' }}
               </button>

            </template>
         </div>

      </div>

   </div>

   <div v-if="allowedChangeStopListStatus == false"
        class="spinner-centr-display">
      <div class="spinner"></div>
   </div>

</template>

<style scoped>
.stop-list {
   padding: 10px 25px;
   display: flex;
   flex-direction: column;
   gap: 15px;
}

.stop-list__category-title {
   margin-bottom: 15px;
}

.stop-list__items {
   display: grid;
   grid-template-columns: max-content 300px 100px 200px;
   align-items: center;
   gap: 15px;
}

.stop-list__img {
   width: 50px;
   height: 50px;
}

.stop-list__product-title {
   padding: 5px;
}

.stop-list__product-title--in-stop-list {
   background-color: rgb(255, 0, 0, 0.5);
   border-radius: 5px;
}
</style>