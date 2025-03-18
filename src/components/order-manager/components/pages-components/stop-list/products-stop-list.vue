<script setup>
import { categories } from '/src/store/axios-helper.js'
import { initializeStopList } from '/src/store/order-manager/stop-list'

import StopListItem from '/src/components/order-manager/components/pages-components/stop-list/stop-list-item.vue'

initializeStopList()

</script>

<template>
   <div class="products-stop-list">

      <div v-for="category in categories">

         <h3 class="products-stop-list__category-title">{{ category.title }}</h3>

         <div class="products-stop-list__items">

            <StopListItem v-for="product in category.products"
                          :key="product.id"
                          :product="product" />

         </div>

      </div>

   </div>
</template>

<style scoped>
.products-stop-list {
   display: flex;
   flex-direction: column;
   gap: 15px;
}

.products-stop-list__category-title {
   margin-bottom: 15px;
}

.products-stop-list__items {
   display: grid;
   grid-template-columns: max-content 300px 100px 200px;
   align-items: center;
   gap: 15px;
}
</style>