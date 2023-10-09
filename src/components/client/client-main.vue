<script setup>
import { categories, getModelsAxios } from '/src/store/axios-helper.js'
getModelsAxios('categories')
</script>

<template>
  <div class="container">
    <div class="menu">
      <ul class="menu-nav">
        <li v-for="category in categories" class="menu-nav-item">
          <a class="menu-nav-item-link" href="#">{{ category.title }}</a>
        </li>
      </ul>
      <button class="menu-btn-card">Корзина</button>
    </div>
  </div>
</template>

