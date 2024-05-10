<script setup>
import { useRoute } from 'vue-router'
import { totalCountInCart } from '/src/store/client-helper.js'
import { initialize } from '/src/store/client-initialize';
import { currentAuthenticatedUser } from '/src/store/axios-helper.js'

initialize()

</script>

<template>
  <router-view></router-view>

  <div class="bottom-device-menu">
    <div class="container">
      <div class="bottom-device-menu__inner">
        <router-link v-if="useRoute().name != 'client.menu'" :to="{ name: 'client.menu' }"><i
            class="fa-regular fa-circle-up bottom-device-menu__icon"></i>
        </router-link>
        <a v-else href="#"><i class="fa-regular fa-circle-up bottom-device-menu__icon"></i></a>


        <router-link v-if="currentAuthenticatedUser" :to="{ name: 'client.menu.popup.user-panel' }">
          <i class="fa-solid fa-user bottom-device-menu__icon"></i>
        </router-link>
        <router-link v-else :to="{ name: 'client.menu.popup.login-panel' }">
          <i class="fa-solid fa-user bottom-device-menu__icon"></i>
        </router-link>


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
