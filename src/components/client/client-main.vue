<script setup>
import { ref, onMounted, computed } from 'vue';
import { company, categories, getModelAxios, getModelsAxios } from '/src/store/axios-helper.js'
import { setBrowserTitleForClient } from '/src/store/vue-use-helper'

setBrowserTitleForClient()

const categoriesMenu = ref()
const categoriesItems = ref([])
const contentSections = ref([])
const productsInCart = ref([])

getModelAxios('companies', 1)
getModelsAxios('categories')
  .then(() => {
    //убираем из списка неактивные продукты и пустые категории чтобы не отображались
    categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
    })
    categories.value = categories.value.filter(category => category.products.length > 0)

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

function addProductToCart(product) {
  if (productsInCart.value.includes(product)) {
    product.countInCart++
  }
  else {
    product.countInCart = 1
    productsInCart.value.push(product)
  }
}

function reduceCountProductInCart(product) {
  if (product.countInCart == 0) return
  product.countInCart--
}

function removeProductFromCart(product) {
  let index = productsInCart.value.indexOf(product)
  if (index !== -1) productsInCart.value.splice(index, 1);
}

const totalPrice = computed(() => {
  let total = 0
  productsInCart.value.forEach(element => {
    total += element.countInCart*element.price_default
  })
  return total
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
        <div class="header__inner__right">
          <button class="header__button">Войти</button>
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

    <button class="btn-cart">
      <i class="fa-solid fa-cart-shopping btn-cart-icon"></i>Корзина
    </button>
  </header>

  <nav class="categories" ref="categoriesMenu">
    <div class="container">
      <div class="categories__inner">

        <a ref="categoriesItems" v-for="category in categories" class="categories__item" :href="'#' + category.title">
          {{ category.title }}</a>

        <div class="cart-panel">
          <div class="cart-panel__header">Корзина</div>

          <div class="cart-panel__product-section" v-for="product in productsInCart">

            <img class="cart-panel__product-img" :src="product.image_url" alt="">
            <div class="cart-panel__product-title">{{ product.title }}</div>
            <button class="cart-panel__product-btn-helpers" @click="removeProductFromCart(product)">
              <i class="fa-solid fa-trash-can"></i></button>

            <div class="cart-panel__product-count-price">
              <button class="cart-panel__product-btn-helpers" @click="reduceCountProductInCart(product)">
                <i class="fa-solid fa-minus"></i></button>
              <div>{{ product.countInCart }}</div>
              <button class="cart-panel__product-btn-helpers" @click="addProductToCart(product)">
                <i class="fa-solid fa-plus"></i></button>
              <div>x {{ Number(product.price_default) }}р</div>
            </div>

            <div class="cart-panel__product-total">{{ Number(product.countInCart) * Number(product.price_default) }}р
            </div>

          </div>

        </div>
        <div class="cart-panel__total-order">
          <div class="cart-panel__total">Итого: {{ totalPrice }}р.</div>
          <button class="cart-panel__btn-order">Заказать</button>
        </div>
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
                <button class="product-card__btn-cart" @click="addProductToCart(product)" type="button">В корзину</button>
              </div>

            </div>
          </div>

        </section>

      </div>
    </div>
  </main>
</template>

