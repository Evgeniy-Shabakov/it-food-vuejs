<script setup>
import { totalCountInCart } from '/src/store/client-helper.js'
import { useRoute } from 'vue-router'
import { categories, getModelsAxios } from '/src/store/axios-helper.js'
import { productsInCart } from '/src/store/client-helper.js'

if (categories.value == null) getModelsAxios('categories')
  .then(() => {
    //убираем из списка неактивные продукты и пустые категории чтобы не отображались
    categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
    })
    categories.value = categories.value.filter(category => category.products.length > 0)

    //обновляем массив для корзины, если есть данные в localStorage
    if (localStorage.getItem('cart') != null) {
      let oldProductsInCart = JSON.parse(localStorage.getItem('cart'))
      oldProductsInCart.forEach(el => {
        categories.value.forEach(category => {
          category.products.forEach(product => {
            if (product.id == el.id) {
              product.countInCart = el.countInCart
              productsInCart.value.push(product)
            }
          })
        })
      })
    }
  })

</script>

<template> 
  <router-view></router-view>

  <div class="bottom-device-menu">
    <div class="container">
      <div class="bottom-device-menu__inner">
        <router-link v-if="useRoute().name != 'client.menu'" :to="{ name: 'client.menu' }"><i
            class="fa-regular fa-circle-up bottom-device-menu__icon"></i></router-link>
        <a v-else href="#"><i class="fa-regular fa-circle-up bottom-device-menu__icon"></i></a>
        <a><i class="fa-solid fa-user bottom-device-menu__icon"></i></a>
        <router-link :to="{ name: 'client.cart' }"><i class="fa-solid fa-cart-shopping bottom-device-menu__icon">
            <div v-if="totalCountInCart" class="bottom-device-menu__product-count-in-cart">
              {{ totalCountInCart }}
            </div>
          </i>
        </router-link>
      </div>
    </div>
  </div>
</template>

