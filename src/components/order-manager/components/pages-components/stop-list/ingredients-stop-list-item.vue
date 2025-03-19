<script setup>
import { defineProps, ref } from 'vue'
import { toggleStopListForIngredient } from '/src/store/axios-helper.js'

const props = defineProps(['ingredient'])

const allowedChangeStopListStatus = ref(true)

async function changeStopListStatus() {
   if (allowedChangeStopListStatus.value == false) return
   allowedChangeStopListStatus.value = false

   try {
      await toggleStopListForIngredient(props.ingredient.id)
      
      props.ingredient.stop_list = !props.ingredient.stop_list
      
   } catch (error) {
      console.log(error)
   }

   allowedChangeStopListStatus.value = true
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
           @click="changeStopListStatus()">
      <span v-if="allowedChangeStopListStatus">
         {{ ingredient.stop_list ? 'Удалить из стоп-листа' : 'Добавить в стоп лист' }}
      </span>

      <div v-else
           class="ingredients-stop-list-item__spinner spinner"></div>

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