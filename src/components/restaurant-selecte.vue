<script setup>
import { selectedCity } from '/src/store/client-helper.js'
import { selectedRestaurant } from '/src/store/client-helper.js'

</script>

<template>

  <select v-if="selectedCity" class="city-selecte" v-model="selectedRestaurant">
    <option v-for="restaurant in selectedCity.restaurants" :value="restaurant">
      {{ restaurant.title }}
    </option>
  </select>

  <div v-else class="city-selecte__spinner-hight">
    <div class="spinner"></div>
  </div>


</template>
