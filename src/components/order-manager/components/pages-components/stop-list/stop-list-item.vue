<script setup>
import { defineProps, ref } from 'vue'
import { toggleStopListForProduct } from '/src/store/axios-helper.js'

defineProps(['product'])

const allowedChangeStopListStatus = ref(true)

async function changeStopListStatus(product) {
   if (allowedChangeStopListStatus.value == false) return
   allowedChangeStopListStatus.value = false

   try {
      await toggleStopListForProduct(product.id)
      // лучше синхронизировать с БД с помощью await initializeStopList(), но так быстрее и меньше запросов
      // через response не всегда отрабытывает, т.к. при заходе на страницу и быстром клике categories обновляются
      // и product переданный в функцию, уже не тот product который в новом списке категорий
      product.stop_list = !product.stop_list 
   } catch (error) {
      console.log(error)
   }

   allowedChangeStopListStatus.value = true
}
</script>

<template>

   <img class="stop-list-item__img"
        :src="product.image_url">

   <h5 class="stop-list-item__product-title"
       :class="product.stop_list ? 'stop-list-item__product-title--in-stop-list' : ''">
      {{ product.title }}
   </h5>

   {{ Number(product.price_default) }} р.

   <button class="btn"
           :class="product.stop_list ? 'btn-view' : 'btn-delete'"
           @click="changeStopListStatus(product)">
      <span v-if="allowedChangeStopListStatus">
         {{ product.stop_list ? 'Удалить из стоп-листа' : 'Добавить в стоп лист' }}
      </span>

      <!-- <div v-if="allowedChangeStopListStatus == false" class="spinner"></div> -->
      <div v-else class="stop-list-item__spinner spinner"></div>

   </button>

</template>

<style scoped>
.stop-list-item__img {
   width: 50px;
   height: 50px;
}

.stop-list-item__product-title {
   padding: 5px;
}

.stop-list-item__product-title--in-stop-list {
   background-color: rgb(255, 0, 0, 0.5);
   border-radius: 5px;
}

.stop-list-item__spinner {
   margin: 0 auto;
   height: 16px;
   width: 16px;
}
</style>