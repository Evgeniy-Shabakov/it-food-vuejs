<script setup>
import { ref, onMounted, onUpdated, watch } from 'vue'

import { company, categories, authUser } from '/src/store/axios-helper.js'
import { minusProductInCartForMenuPage, plusProductToCart } from '/src/store/client-helper.js'
import { activateSwipeController } from '/src/store/helpers/swipe-controller.js'
import {
  activateSelecteMenuController, activateMoveMenuController, getIndexCentrSection
} from '/src/store/client/client-menu.js'

import CartComponent from './cart-component.vue';

const categoriesMenu = ref()
const categoriesMenuInner = ref()
const contentInner = ref()
const categoriesItems = ref([])
const contentSections = ref([])

const btnBurgerMenu = ref(null)
const burgerMenu = ref(null)

onMounted(() => {
  activateSelecteMenuController(contentSections.value, categoriesItems.value)
  activateMoveMenuController(contentSections.value, categoriesItems.value, categoriesMenuInner.value)
  activateSwipeController(contentInner.value,
    () => {
      let index = getIndexCentrSection(contentSections.value)
      index++
      if (index < categoriesItems.value.length) scrollToCategory(index)
    },
    () => {
      let index = getIndexCentrSection(contentSections.value)
      index--
      if (index > 0) scrollToCategory(index)
      else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    })

  // Блок управления бургер меню - Start
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
  // Блок управления бургер меню - END
})

onUpdated(() => {
  //изменяем отступ при скролле для меню категорий в зависимости от высоты меню
  //высота меняется несколько раз при загрузке странице и категорий с продуктами

  setTimeout(() => { //таймаут так как DOM обновляется с задержкой
    if(categoriesMenu.value == null) return // чтобы избежать ошибок

    let scrollPaddingTop = categoriesMenu.value.offsetHeight + 20 + 'px'
    document.documentElement.style.setProperty('--scroll-padding-top', scrollPaddingTop)
  }, 0, 3 * 1000)
})


//функция вместо якорных ссылок, т.к. якорные ссылки не работают с moveMenu()
function scrollToCategory(index) {
  window.scrollTo({
    top: contentSections.value[index].offsetTop - categoriesMenu.value.offsetHeight - 20,
    behavior: "smooth",
  });
}

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
            <router-link v-if="authUser.employee && authUser.employee.hasAdminPanelAccess" to="/admin">Панель
              администратора</router-link>
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
      <div v-if="categories" ref="categoriesMenuInner" class="categories__inner">

        <a ref="categoriesItems" v-for="(category, index) in categories" :key="index" class="categories__item"
          @click.prevent="scrollToCategory(index)" :href="'#' + category.title">
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
      <div ref="contentInner" class="content__inner">

        <section v-for="category in categories" class="content__category-sections" ref="contentSections">

          <h2 :id="category.title" class="content__category-title">{{ category.title }}</h2>

          <div class="content__category-products">

            <article class="product-card" v-for="product in category.products">

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

            </article>

          </div>

        </section>

      </div>
    </div>

    <router-view></router-view> <!-- для popup окон  -->

  </main>
</template>
