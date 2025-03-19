<script setup>
import { ingredients } from '/src/store/axios-helper.js'
import IngredientsStopListItem
   from '/src/components/order-manager/components/pages-components/stop-list/ingredients-stop-list-item.vue'
</script>

<template>
   <div>

      <h3 class="ingredients-stop-list__title">Ингредиенты</h3>

      <div class="ingredients-stop-list__items">
         <IngredientsStopListItem v-for="ingredient in ingredients"
                                  :key="ingredient.id"
                                  :ingredient="ingredient" />
      </div>

   </div>
</template>

<style scoped>
.ingredients-stop-list__items {
   display: grid;
   height: max-content;
   grid-template-columns: max-content 200px 100px 200px;
   align-items: center;
   gap: 15px;
}

.ingredients-stop-list__title {
   margin-bottom: 15px;
}
</style>