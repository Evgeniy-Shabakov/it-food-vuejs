<script setup>
import { selectedCity } from '/src/store/client-helper.js'
import { cities } from '/src/store/axios-helper.js'

</script>

<template>

  <select v-if="cities" class="city-selecte" v-model="selectedCity">
      <option v-for="city in cities" :value="city">{{ city.title }}</option>
  </select>

  <!-- оставил на будущее, когда будет несколько стран -->

  <!-- <select v-if="countries" class="city-selecte" v-model="selectedCity">
    <optgroup v-for="country in countries" :label="country.title">
      <option v-for="city in country.cities" :value="city.id">{{ city.title }}</option>
    </optgroup>
  </select> -->

  <div v-else class="city-selecte__spinner-hight">
    <div class="spinner"></div>
  </div>


</template>
