<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import {
  company, categories, getModelAxios,
  authUser, getAuthUser, logout
} from '/src/store/axios-helper.js'
import { setBrowserTitleForClient } from '/src/store/vue-use-helper'
import { minusProductInCartForMenuPage, plusProductToCart } from '/src/store/client-helper.js'

import CartComponent from './cart-component.vue';

setBrowserTitleForClient()

const categoriesMenu = ref()
const categoriesItems = ref([])
const contentSections = ref([])

getModelAxios('companies', 1)

const btnBurgerMenu = ref(null)
const burgerMenu = ref(null)

onMounted(() => {
  burgerMenu.value.hidden = true

  btnBurgerMenu.value.addEventListener('click', function () {
    if (burgerMenu.value.hidden) burgerMenu.value.hidden = false
    else burgerMenu.value.hidden = true
  })

  document.addEventListener('click', function (event) {
    if (burgerMenu.value == null) return
    if (btnBurgerMenu.value.contains(event.target)) return

    if (!burgerMenu.value.contains(event.target)) {
      burgerMenu.value.hidden = true
    }
  })

  window.onscroll = function () {
    if (burgerMenu.value == null) return
    if (burgerMenu.value.hidden) return
    burgerMenu.value.hidden = true
  }
})

onUpdated(() => {
  //изменяем отступ при скролле для меню категорий в зависимости от высоты меню
  //высота меняется несколько раз при загрузке странице и категорий с продуктами

  setTimeout(() => { //таймаут так как DOM обновляется с задержкой
    let scrollPaddingTop = categoriesMenu.value.offsetHeight + 20 + 'px'
    document.documentElement.style.setProperty('--scroll-padding-top', scrollPaddingTop)
  }, 0, 3 * 1000)

  //Блок выделения меню категорий - Start
  selectMenu() //выделение меню при старте

  categoriesItems.value.forEach((el, i) => {
    el.addEventListener('click', () => {
      categoriesItems.value.forEach(el => el.classList.remove('active'))
      categoriesItems.value[i].classList.add('active')
      window.removeEventListener('scroll', selectMenu) //чтобы не выделялись пункты меню во время автоскролле
    })
  })

  window.addEventListener('scroll', selectMenu) //выделение пункта меню при скролле
  //активация прослушивания скролла после клика по меню
  window.addEventListener('scrollend', () => window.addEventListener('scroll', selectMenu))

  function selectMenu() {
    let scrollDistance = window.scrollY
    contentSections.value.forEach((el, i) => {
      if (el.offsetTop <= scrollDistance + 400) {
        categoriesItems.value.forEach(el => el.classList.remove('active'))
        categoriesItems.value[i].classList.add('active')
      }
    })
  }
  //Блок выделения меню категорий - End
})
</script>

<template>
  <header class="header">
    <section class="info">
      <div class="container">
        <div class="info__inner">
          <a class="info__item" href="#">О нас</a>
          <a class="info__item" href="#">Контакты</a>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="header__inner">
        <div class="header__inner__left">
          <img v-if="company" class="header__logo" :src="company.logo_url" alt="">
          <div>
            <h1 v-if="company" class="header__company-name">{{ company.brand_title }}</h1>
            <div v-if="company" class="header__tagline">{{ company.tagline }}</div>
          </div>
        </div>
        <div>
          <div v-if="authUser" class="header__inner__right">
            <router-link
              v-if="authUser.employee && authUser.employee.hasAdminPanelAccess"
              to="/admin">Панель администратора</router-link>
            <router-link to="/popup/user-panel">{{ authUser.phone }}</router-link>
            <!-- <button @click.prevent="logout()" class="header__button">Выйти</button> -->
          </div>
          <div v-else>
            <router-link :to="{ name: 'client.menu.popup.login-panel' }">
              <button class="header__button">Войти</button>
            </router-link>
          </div>
          <button ref="btnBurgerMenu" class="header__btn-burger-menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>

    <nav ref="burgerMenu" class="burger-menu">
      <div class="container">
        <div class="burger-menu__inner">
          <a class="burger-menu__item" href="#">Москва (изменить город)</a>
          <a class="burger-menu__item" href="#">Войти</a>
          <a class="burger-menu__item" href="#">О нас</a>
          <a class="burger-menu__item" href="#">Контакты</a>
        </div>
      </div>
    </nav>

  </header>

  <nav class="categories" ref="categoriesMenu">
    <div class="container">
      <div v-if="categories" class="categories__inner">

        <a ref="categoriesItems" v-for="category in categories" class="categories__item" :href="'#' + category.title">
          {{ category.title }}</a>

        <div class="cart-panel">
          <cart-component></cart-component>
        </div>
      </div>
      <div v-else class="spinner-centr-display">
        <div class="spinner"></div>
      </div>

    </div>
  </nav>

  <main class="content">
    <div class="container">
      <div class="content__inner">

        <section v-for="category in categories" class="content__category-sections" ref="contentSections">

          <h2 :id="category.title" class="content__category-title">{{ category.title }}</h2>

          <div class="content__category-products">
            <div class="product-card" v-for="product in category.products">

              <img class="product-card__image" :src="product.image_url" alt="">
              <p class="product-card__title"> {{ product.title }}</p>
              <p class="product-card__description-short"> {{ product.description_short }}</p>
              <div class="product-card__price-and-btn">
                <p class="product-card__price"> {{ Number(product.price_default) }} р.</p>
                <button v-if="product.countInCart == 0 || product.countInCart == undefined" class="btn btn-submit"
                  @click="plusProductToCart(product)" type="button">В корзину
                </button>
                <div v-else class="product-card__plus-count-minus">
                  <button class="btn btn-submit" @click="minusProductInCartForMenuPage(product)">
                    <i class="fa-solid fa-minus"></i></button>
                  <div>{{ product.countInCart }}</div>
                  <button class="btn btn-submit" @click="plusProductToCart(product)">
                    <i class="fa-solid fa-plus"></i></button>
                </div>
              </div>

            </div>
          </div>

        </section>

      </div>
    </div>

    <router-view></router-view>
  </main>
</template>
