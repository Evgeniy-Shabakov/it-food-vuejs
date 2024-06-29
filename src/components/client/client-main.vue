<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import { totalCountInCart } from '/src/store/client-helper.js'
import { initialize } from '/src/store/client-initialize';
import { authUser } from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { setBrowserTitleForClient } from '/src/store/vue-use-helper'

const dataForComponentLoadingType = ref(LOADING_TYPE.loading)

setBrowserTitleForClient()

onMounted(async () => {
  dataForComponentLoadingType.value = await initialize()
})

</script>

<template>
  <router-view v-if="dataForComponentLoadingType === LOADING_TYPE.complete"></router-view>

  <div v-else-if="dataForComponentLoadingType === LOADING_TYPE.loading" class="spinner-centr-display">
    <div class="spinner"></div>
  </div>

  <div v-else class="admin-view-model-load">
    Ошибка загрузки данных. Попробуйте обновить страницу
  </div>

  <div class="bottom-device-menu">
    <div class="container">
      <div class="bottom-device-menu__inner">

        <router-link v-if="useRoute().name != 'client.menu'" :to="{ name: 'client.menu' }"
          class="bottom-device-menu__item bottom-device-menu__item-1">
          <i class="fa-regular fa-circle-up bottom-device-menu__icon"></i>
        </router-link>
        <a v-else href="#" class="bottom-device-menu__item bottom-device-menu__item-1">
          <i class="fa-regular fa-circle-up bottom-device-menu__icon"></i>
        </a>

        <router-link v-if="authUser" :to="{ name: 'client.menu.popup.user-panel' }"
          class="bottom-device-menu__item bottom-device-menu__item-2">
          <i class="fa-solid fa-user bottom-device-menu__icon"></i>
        </router-link>
        <router-link v-else :to="{ name: 'client.menu.popup.login-panel' }"
          class="bottom-device-menu__item bottom-device-menu__item-2">
          <i class="fa-solid fa-user bottom-device-menu__icon"></i>
        </router-link>

        <router-link :to="{ name: 'client.cart' }" class="bottom-device-menu__item bottom-device-menu__item-3">
          <i class="fa-solid fa-cart-shopping bottom-device-menu__icon">
            <div v-if="totalCountInCart" class="bottom-device-menu__product-count-in-cart">
              {{ totalCountInCart }}
            </div>
          </i>
        </router-link>

      </div>
    </div>
  </div>
</template>
