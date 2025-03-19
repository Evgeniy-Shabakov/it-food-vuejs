<script setup>
import { initializeStopList } from '/src/store/order-manager/stop-list'

import ProductsStopList
   from '/src/components/order-manager/components/pages-components/stop-list/products-stop-list.vue'
import IngredientsStopList
   from '/src/components/order-manager/components/pages-components/stop-list/ingredients-stop-list.vue'

initializeStopList()

</script>

<template>
   <div class="stop-list">

      <ProductsStopList />

      <IngredientsStopList />

   </div>

</template>

<style scoped>
.stop-list {
   padding: 10px 25px;
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 25px;
}
</style>