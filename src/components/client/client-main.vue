<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router'

import router from "/src/router.js"
import { totalCountInCart } from '/src/store/client-helper.js'
import { initialize } from '/src/store/client-initialize';
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { setBrowserTitleForClient } from '/src/store/vue-use-helper.js'

import Cookies from '/src/components/client/block/cookies.vue'
import DialogMini from '/src/components/client/block/dialog-mini.vue'

const route = useRoute()

const dataForComponentLoadingType = ref(LOADING_TYPE.loading)

onBeforeMount(async () => {
  try {
    await initialize()
    dataForComponentLoadingType.value = LOADING_TYPE.complete
    setBrowserTitleForClient()
  }
  catch (error) {
    dataForComponentLoadingType.value = error
  }

})

function reloadPage() {
  location.reload()
}

//функция вместо якорных ссылок, т.к. якорные ссылки не работают с контроллером меню
function btnTopPressed() {
  if (route.name == 'client.menu') {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  else {
    router.push({ name: 'client.menu' })
  }
}

</script>

<template>

  <cookies></cookies>

  <router-view v-if="dataForComponentLoadingType === LOADING_TYPE.complete"></router-view>

  <div v-else-if="dataForComponentLoadingType === LOADING_TYPE.loading"
       class="spinner-centr-display">
    <div class="spinner"></div>
  </div>

  <div v-else
       class="error-loading">
    <p class="error-loading__text">Ошибка загрузки данных. Попробуйте обновить страницу</p>
    <p class="error-loading__description">{{ dataForComponentLoadingType }}</p>
    <button class="btn btn-submit"
            @click.prevent="reloadPage()"
            type="button">Обновить</button>
  </div>

  <div class="bottom-device-menu">
    <div class="container">
      <div class="bottom-device-menu__inner">

        <a @click.prevent="btnTopPressed()"
           href="#"
           class="bottom-device-menu__item bottom-device-menu__item-1">
          <i class="fa-regular fa-circle-up bottom-device-menu__icon"></i>
        </a>

        <router-link :to="{ name: 'client.menu.popup.user-panel' }"
                     class="bottom-device-menu__item bottom-device-menu__item-2">
          <i class="fa-solid fa-user bottom-device-menu__icon"></i>
        </router-link>

        <router-link :to="{ name: 'client.menu.popup.cart' }"
                     class="bottom-device-menu__item bottom-device-menu__item-3">
          <i class="fa-solid fa-cart-shopping bottom-device-menu__icon">
            <div v-if="totalCountInCart"
                 class="bottom-device-menu__product-count-in-cart">
              {{ totalCountInCart }}
            </div>
          </i>
        </router-link>

      </div>
    </div>
  </div>

  <DialogMini />

</template>
