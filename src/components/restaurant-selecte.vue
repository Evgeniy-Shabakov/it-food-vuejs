<script setup>
import { ref, watch } from 'vue';
import { cities } from '/src/store/axios-helper.js'
import { selectedCity } from '/src/store/client-helper.js'
import { selectedRestaurant } from '/src/store/client-helper.js'

const cityForSelecteRestaurant = ref(null) // selectedCity не использую т.к. в нем нет ресторанов

watch([cities, selectedCity], () => {
  if (cities.value == null || selectedCity.value == null) return

  cityForSelecteRestaurant.value = cities.value.find(city => city.id === selectedCity.value.id)

  if (selectedRestaurant.value == null) return
  if (selectedRestaurant.value.city.id === cityForSelecteRestaurant.value.id) return

  selectedRestaurant.value = cityForSelecteRestaurant.value.restaurants[0]
})

</script>

<template>

  <select v-if="cityForSelecteRestaurant" class="city-selecte" v-model="selectedRestaurant">
    <option v-for="restaurant in cityForSelecteRestaurant.restaurants" :value="restaurant">

      <span>{{ restaurant.street }}</span>
      <span> - {{ restaurant.house_number }}</span>
      <span v-if="restaurant.corps_number">/{{ restaurant.corps_number }}</span>

    </option>
  </select>

  <div v-else class="city-selecte__spinner-hight">
    <div class="spinner"></div>
  </div>

</template>
