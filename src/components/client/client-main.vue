<script setup>
import { ref, onMounted } from 'vue';
import { company, categories, getModelAxios, getModelsAxios } from '/src/store/axios-helper.js'
import { setBrowserTitleForClient } from '/src/store/vue-use-helper'

setBrowserTitleForClient()

getModelAxios('companies', 1)
getModelsAxios('categories')
  .then(() => {
    let divCategories = document.querySelector('.categories');
    let scrollPaddingTop = divCategories.offsetHeight + 20 +'px'
    console.log(scrollPaddingTop);
    document.documentElement.style.setProperty('--scroll-padding-top', scrollPaddingTop);
  })

const btnBurgerMenu = ref(null)
const burgerMenu = ref(null)

onMounted(() => {
  burgerMenu.value.hidden = true

  btnBurgerMenu.value.addEventListener('click', function () {
    if (burgerMenu.value.hidden) burgerMenu.value.hidden = false
    else burgerMenu.value.hidden = true
  })

  document.addEventListener('click', function (event) {
    if (btnBurgerMenu.value.contains(event.target)) return

    if (!burgerMenu.value.contains(event.target)) {
      burgerMenu.value.hidden = true
    }
  })

  window.onscroll = function () {
    if (burgerMenu.value.hidden) return
    burgerMenu.value.hidden = true
  }
})

</script>

<template>
  <section class="info">
    <div class="container">
      <div class="info__inner">
        <a class="info__item" href="#">О нас</a>
        <a class="info__item" href="#">Контакты</a>
      </div>
    </div>
  </section>

  <header class="header">
    <div class="container">
      <div class="header__inner">
        <div class="header__inner__left">
          <img v-if="company" class="header__logo" :src="company.logo_url" alt="">
          <div>
            <h1 v-if="company" class="header__company-name">{{ company.brand_title }}</h1>
            <div v-if="company" class="header__tagline">{{ company.tagline }}</div>
          </div>
        </div>
        <div class="header__inner__right">
          <button class="header__button">Войти</button>
          <button ref="btnBurgerMenu" class="header__btn-burger-menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>
  </header>

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

  <nav class="categories">
    <div class="container">
      <div class="categories__inner">

        <a v-for="category in categories" class="categories__item" :href="'#' + category.title">
          {{ category.title }}</a>

        <div class="cart">
          <h2>Корзина</h2>
          <div>Пицца 1</div>
          <div>Пицца 1</div>
          <div>Пицца 1</div>
          <div>Пицца 1</div>
          <div>Итого</div>
          <button>Заказать</button>
        </div>
      </div>

    </div>
  </nav>

  <button class="btn-cart">
    <i class="fa-solid fa-cart-shopping btn-cart-icon"></i>Корзина
  </button>

  <main class="content">
    <div class="container">
      <div class="content__inner">

        <template v-for="category in categories">
          <template v-if="category.products.length > 0">

            <h2 :id="category.title" class="content__category-title">{{ category.title }}</h2>

            <section class="content__category-products">
              <div class="product-card" v-for="product in category.products">

                <div>
                  <img class="product-card__image" :src="product.image_url" alt="">
                  <p class="product-card__title"> {{ product.title }}</p>
                  <p class="product-card__description-short"> {{ product.description_short }}</p>
                </div>

                <div class="product-card__price-and-btn">
                  <p class="product-card__price"> {{ Number(product.price_default) }} р.</p>
                  <button type="button" class="product-card__btn-cart">В корзину</button>
                </div>

              </div>
            </section>

          </template>
        </template>

      </div>
    </div>
  </main>
</template>

