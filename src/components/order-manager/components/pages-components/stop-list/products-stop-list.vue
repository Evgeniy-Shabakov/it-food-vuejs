<script setup>
import { categories } from '/src/store/axios-helper.js'
import ProductsStopListItem from '/src/components/order-manager/components/pages-components/stop-list/products-stop-list-item.vue'

</script>

<template>
   <div class="products-stop-list">

      <div v-for="category in categories">

         <h3 class="products-stop-list__category-title">{{ category.title }}</h3>

         <div class="products-stop-list__items">

            <ProductsStopListItem v-for="product in category.products"
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
   height: max-content;
   grid-template-columns: max-content 300px 100px 200px;
   align-items: center;
   gap: 15px;
}
</style>