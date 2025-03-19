<script setup>
import { defineProps } from 'vue'
import { toggleStopListForIngredient } from '/src/store/axios-helper.js'
import { useBlockBtnForAsyncRequest } from '/src/store/composables/useBlockBtnForAsyncRequest'

const props = defineProps(['ingredient'])

const { isRequestRunning, controlClick } = useBlockBtnForAsyncRequest()

async function handleClick() {
   try {
      await toggleStopListForIngredient(props.ingredient.id)

      props.ingredient.stop_list = !props.ingredient.stop_list

   } catch (error) {
      console.log(error)
   }
}
</script>

<template>

   <img class="ingredients-stop-list-item__img"
        :src="ingredient.image_url">

   <h5 class="ingredients-stop-list-item__title"
       :class="ingredient.stop_list ? 'ingredients-stop-list-item__title--in-stop-list' : ''">
      {{ ingredient.title }}
   </h5>

   <span>{{ Number(ingredient.price_default) }} р.</span>

   <button class="btn"
           :class="ingredient.stop_list ? 'btn-view' : 'btn-delete'"
           @click="controlClick(handleClick)">

      <div v-if="isRequestRunning"
           class="ingredients-stop-list-item__spinner spinner"></div>
      <span v-else>
         {{ ingredient.stop_list ? 'Удалить из стоп-листа' : 'Добавить в стоп лист' }}
      </span>

   </button>

</template>

<style scoped>
.ingredients-stop-list-item__img {
   width: 50px;
   height: 50px;
}

.ingredients-stop-list-item__title {
   padding: 5px;
}

.ingredients-stop-list-item__title--in-stop-list {
   background-color: rgb(255, 0, 0, 0.5);
   border-radius: 5px;
}

.ingredients-stop-list-item__spinner {
   margin: 0 auto;
   height: 16px;
   width: 16px;
}
</style>