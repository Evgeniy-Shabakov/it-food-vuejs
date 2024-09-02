<script setup>
import { ref } from 'vue'

import { ORDER_TYPE } from '/src/store/data-types/order-type'
import { cities } from '/src/store/axios-helper.js'
import { selectedCity, selectedOrderType } from '/src/store/client-helper.js'
import { selectedRestaurant } from '/src/store/client-helper.js'

const cityForSelecteRestaurant = ref(null) // selectedCity не использую т.к. в нем нет ресторанов

const restaurantsForSelecte = ref(null)

initialize()

function initialize() {
  cityForSelecteRestaurant.value = cities.value.find(city => city.id === selectedCity.value.id)

  if (selectedOrderType.value == ORDER_TYPE.pickUp) {
    restaurantsForSelecte.value = cityForSelecteRestaurant.value.restaurants
      .filter(restaurant => restaurant.pick_up_at_counter_available == true)
  }

  if (selectedOrderType.value == ORDER_TYPE.inRestaurant) {
    restaurantsForSelecte.value = cityForSelecteRestaurant.value.restaurants
      .filter(restaurant => restaurant.at_restaurant_at_counter_available == true
        || restaurant.at_restaurant_to_table_available == true)
  }

  const idsArray = restaurantsForSelecte.value.map(rest => rest.id)

  //при обновлении страницы selectedRestaurant.value не успевает инициализироваться
  // в client-initialize.js и selectedRestaurant.value сбрасывается
  if (selectedRestaurant.value && idsArray.includes(selectedRestaurant.value.id)) return

  selectedRestaurant.value = restaurantsForSelecte.value[0]
}

</script>

<template>

  <select v-if="cityForSelecteRestaurant" class="city-selecte" v-model="selectedRestaurant">
    <option v-for="restaurant in restaurantsForSelecte" :value="restaurant">

      <span>{{ restaurant.street }}</span>
      <span> - {{ restaurant.house_number }}</span>
      <span v-if="restaurant.corps_number">/{{ restaurant.corps_number }}</span>

    </option>
  </select>

  <div v-else class="city-selecte__spinner-hight">
    <div class="spinner"></div>
  </div>

</template>
