<script setup>
import { selectedCity } from '/src/store/client-helper.js'
import { countries } from '/src/store/axios-helper.js'

</script>

<template>

  <select class="city-selecte" v-model="selectedCity">
    <optgroup v-for="country in countries" :label="country.title">
      <option v-for="city in country.cities" :value="city">{{ city.title }}</option>
    </optgroup>
  </select>

</template>
