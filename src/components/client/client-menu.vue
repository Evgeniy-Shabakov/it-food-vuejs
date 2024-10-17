<script setup>
import { ref, onMounted, onUpdated } from 'vue'

import { company, categories, authUser } from '/src/store/axios-helper.js'
import { minusProductInCartForMenuPage, plusProductToCart } from '/src/store/client-helper.js'
import { activateSwipeController } from '/src/store/helpers/swipe-controller.js'
import {
  activateSelecteMenuController, activateMoveMenuController, getIndexCentrSection
} from '/src/store/client/client-menu.js'

import CartPanel from '/src/components/client/modules/client-menu-cart-panel.vue'
import CitySelecte from '/src/components/client/modules/city-selecte-component.vue'

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
    if (categoriesMenu.value == null) return // чтобы избежать ошибок

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

function formatPhone(value) {
  if (!value) return ''

  const phoneNumber = value.replace(/\D/g, '')

  return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9)}`
}


</script>

<template>
  <header class="header">

    <section class="info">
      <div class="container">
        <div class="info__inner">
          <!-- <a class="info__item"
             href="#">О нас</a>
          <a class="info__item"
             href="#">Контакты</a> -->
          <router-link class="info__item"
                       :to="{ name: 'client.menu.popup.pravo' }">
            Правовая информация
          </router-link>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="header__inner">
        <div class="header__inner__left">
          <img v-if="company"
               class="header__logo"
               :src="company.logo_url"
               alt="">
          <div>
            <h1 v-if="company"
                class="header__company-name">{{ company.brand_title }}</h1>
            <div v-if="company"
                 class="header__tagline">{{ company.tagline }}</div>
          </div>
        </div>
        <div>
          <div v-if="authUser"
               class="header__inner__right">
            <router-link v-if="authUser.employee && authUser.employee.hasAdminPanelAccess"
                         to="/admin">Панель
              администратора</router-link>
            <router-link to="/popup/user-panel">Личный кабинет</router-link>
          </div>
          <div v-else>
            <router-link :to="{ name: 'client.menu.popup.login-panel' }">
              <button class="header__button">Войти</button>
            </router-link>
          </div>
          <button ref="btnBurgerMenu"
                  class="header__btn-burger-menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>

    <nav ref="burgerMenu"
         class="burger-menu">

      <div class="burger-menu__inner">

        <city-selecte></city-selecte>

        <!-- <a class="burger-menu__item" href="#">О нас</a>
        <a class="burger-menu__item" href="#">Контакты</a> -->

        <div v-if="company"
             class="burger-menu__item">
          <div class="burger-menu__icon-and-text">

            <svg width="25px"
                 height="25px"
                 viewBox="0 0 24 24"
                 fill="none">
              <path class="burger-menu__icon"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13 11.5858V6Z"
                    fill="#000000" />
            </svg>

            <span>
              <template v-if="company.open_time && company.close_time">
                {{ company.open_time }} - {{ company.close_time }}
              </template>
              <template v-else>
                Круглосуточно
              </template>
            </span>

          </div>
        </div>

        <a v-if="company && company.phone"
           :href="`tel:${company.phone}`"
           class="burger-menu__item burger-menu__item--phone"
           target="_blank">
          <div class="burger-menu__icon-and-text">

            <svg class="burger-menu__icon"
                 fill="#000000"
                 width="25px"
                 height="25px"
                 viewBox="0 0 32 32"
                 version="1.1">
              <title>phone-volume</title>
              <path
                    d="M19.373 11.831c-0.138-0.154-0.337-0.25-0.559-0.25-0.414 0-0.75 0.336-0.75 0.75 0 0.195 0.074 0.373 0.197 0.506l-0-0.001c0.819 0.92 1.32 2.139 1.32 3.476 0 1.602-0.719 3.035-1.852 3.996l-0.008 0.006c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22v0c1.396-1.251 2.27-3.060 2.27-5.072 0-1.717-0.636-3.285-1.685-4.481l0.007 0.008zM22.428 8.776c-0.138-0.152-0.336-0.247-0.557-0.247-0.414 0-0.75 0.336-0.75 0.75 0 0.194 0.073 0.37 0.194 0.503l-0.001-0.001c1.445 1.629 2.328 3.786 2.328 6.149 0 2.819-1.256 5.345-3.24 7.047l-0.012 0.010c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22v0c2.244-2.002 3.65-4.901 3.65-8.129 0-2.741-1.014-5.245-2.686-7.158l0.011 0.013zM25.273 5.524c-0.137-0.146-0.331-0.236-0.546-0.236-0.414 0-0.75 0.336-0.75 0.75 0 0.198 0.077 0.378 0.202 0.512l-0-0c2.215 2.36 3.575 5.544 3.575 9.046 0 3.986-1.763 7.561-4.551 9.986l-0.016 0.014c-0.136 0.136-0.22 0.324-0.22 0.531 0 0.415 0.336 0.751 0.751 0.751 0.207 0 0.395-0.084 0.531-0.22v0c10.635-10.637 1.121-21.030 1.023-21.134zM12.378 11.725c0 0 0 0 0 0 0.248 0 0.469-0.121 0.605-0.307l0.001-0.002 4.282-5.897c0.090-0.122 0.143-0.275 0.143-0.44 0-0.064-0.008-0.127-0.023-0.187l0.001 0.005c-0.141-0.532-0.367-0.997-0.664-1.407l0.008 0.012c-0.178-0.272-0.374-0.509-0.593-0.723l-0.001-0.001-0.004-0.004c-0.952-0.94-2.261-1.52-3.706-1.52-1.446 0-2.757 0.582-3.71 1.524l0-0c-3.379 3.386-5.468 8.060-5.468 13.222s2.089 9.836 5.469 13.222l-0-0c0.943 0.942 2.245 1.525 3.683 1.525 0.006 0 0.012 0 0.018-0h-0.001c0.003 0 0.007 0 0.010 0 1.445 0 2.754-0.581 3.706-1.522l-0.001 0c0.211-0.203 0.399-0.427 0.56-0.671l0.009-0.015c0.301-0.408 0.536-0.886 0.676-1.404l0.007-0.030c0.014-0.055 0.022-0.117 0.022-0.182 0-0.166-0.054-0.319-0.145-0.443l0.001 0.002-4.282-5.899c-0.138-0.188-0.358-0.309-0.606-0.309v0c-0.798 0.001-1.553 0.187-2.224 0.517l0.030-0.013c-0.599-1.412-0.948-3.055-0.948-4.779s0.348-3.367 0.979-4.862l-0.031 0.082c0.641 0.317 1.396 0.502 2.194 0.504h0.001zM9.652 9.428c-0.216 0.057-0.39 0.202-0.485 0.393l-0.002 0.004c-0.902 1.802-1.43 3.927-1.43 6.174s0.528 4.372 1.467 6.256l-0.037-0.081c0.097 0.195 0.271 0.34 0.481 0.397l0.005 0.001c0.055 0.014 0.118 0.022 0.183 0.022 0.162 0 0.313-0.050 0.438-0.135l-0.003 0.002c0.489-0.351 1.081-0.589 1.723-0.664l0.017-0.002 3.818 5.26c-0.108 0.249-0.232 0.464-0.377 0.662l0.007-0.009c-0.113 0.17-0.237 0.317-0.375 0.45l-0.001 0.001c-0.681 0.674-1.618 1.091-2.652 1.091s-1.969-0.416-2.65-1.089l0 0c-3.108-3.114-5.030-7.413-5.030-12.161s1.922-9.047 5.030-12.161l-0 0c0.673-0.671 1.601-1.086 2.626-1.086 0.005 0 0.010 0 0.014 0h-0.001c0.002 0 0.004 0 0.006 0 1.034 0 1.972 0.415 2.655 1.088l-0-0c0.15 0.146 0.284 0.308 0.399 0.483l0.007 0.011c0.129 0.177 0.244 0.378 0.335 0.592l0.008 0.020-3.818 5.259c-0.659-0.076-1.251-0.315-1.75-0.674l0.011 0.008c-0.12-0.085-0.268-0.136-0.429-0.136-0.067 0-0.132 0.009-0.194 0.025l0.005-0.001z">
              </path>
            </svg>

            <span>{{ formatPhone(company.phone) }}</span>
          </div>
        </a>

        <router-link class="burger-menu__link"
                     :to="{ name: 'client.menu.popup.pravo' }"
                     @click="burgerMenu.hidden=true">
          Правовая информация
        </router-link>

      </div>

    </nav>

  </header>

  <nav class="categories"
       ref="categoriesMenu">
    <div class="container">
      <div v-if="categories"
           ref="categoriesMenuInner"
           class="categories__inner">

        <a ref="categoriesItems"
           v-for="(category, index) in categories"
           :key="index"
           class="categories__item"
           @click.prevent="scrollToCategory(index)"
           :href="'#' + category.title">
          {{ category.title }}</a>

        <div class="client-menu__cart-panel">
          <CartPanel></CartPanel>
        </div>
      </div>
      <div v-else
           class="spinner-centr-display">
        <div class="spinner"></div>
      </div>

    </div>
  </nav>

  <main class="content">
    <div class="container">
      <div ref="contentInner"
           class="content__inner">

        <section v-for="category in categories"
                 class="content__category-sections"
                 ref="contentSections">

          <h2 :id="category.title"
              class="content__category-title">{{ category.title }}</h2>

          <div class="content__category-products">

            <article class="product-card"
                     v-for="product in category.products">

              <img class="product-card__image"
                   :src="product.image_url"
                   alt="">
              <p class="product-card__title"> {{ product.title }}</p>
              <p class="product-card__description-short"> {{ product.description_short }}</p>
              <div class="product-card__price-and-btn">
                <p class="product-card__price"> {{ Number(product.price_default) }} р.</p>
                <button v-if="product.countInCart == 0 || product.countInCart == undefined"
                        class="btn btn-submit"
                        @click="plusProductToCart(product)"
                        type="button">В корзину
                </button>
                <div v-else
                     class="product-card__plus-count-minus">
                  <button class="btn btn-submit"
                          @click="minusProductInCartForMenuPage(product)">
                    <i class="fa-solid fa-minus"></i></button>
                  <div>{{ product.countInCart }}</div>
                  <button class="btn btn-submit"
                          @click="plusProductToCart(product)">
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
