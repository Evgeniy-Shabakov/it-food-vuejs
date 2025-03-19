<script setup>
import { defineProps } from 'vue'
import { toggleStopListForProduct } from '/src/store/axios-helper.js'
import { useBlockBtnForAsyncRequest } from '/src/store/composables/useBlockBtnForAsyncRequest'

const props = defineProps(['product'])

const { isRequestRunning, controlClick } = useBlockBtnForAsyncRequest()

async function handleClick() {
   try {
      await toggleStopListForProduct(props.product.id)

      props.product.stop_list = !props.product.stop_list

   } catch (error) {
      console.log(error)
   }
}
</script>

<template>

   <img class="products-stop-list-item__img"
        :src="product.image_url">

   <h5 class="products-stop-list-item__title"
       :class="product.stop_list ? 'products-stop-list-item__title--in-stop-list' : ''">
      {{ product.title }}
   </h5>

   <span>{{ Number(product.price_default) }} р.</span>

   <button class="btn"
           :class="product.stop_list ? 'btn-view' : 'btn-delete'"
           @click="controlClick(handleClick)">

      <div v-if="isRequestRunning"
           class="products-stop-list-item__spinner spinner"></div>
      <span v-else>
         {{ product.stop_list ? 'Удалить из стоп-листа' : 'Добавить в стоп лист' }}
      </span>

   </button>

</template>

<style scoped>
.products-stop-list-item__img {
   width: 50px;
   height: 50px;
}

.products-stop-list-item__title {
   padding: 5px;
}

.products-stop-list-item__title--in-stop-list {
   background-color: rgb(255, 0, 0, 0.5);
   border-radius: 5px;
}

.products-stop-list-item__spinner {
   margin: 0 auto;
   height: 16px;
   width: 16px;
}
</style>