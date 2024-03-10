<script setup>
import { ref } from 'vue';
import {
  productsInCart, totalPrice,
  minusProductInCartForCartPanel,
  plusProductToCart, removeProductFromCart
} from '/src/store/client-helper.js'

const orderPanel = ref(null)

function openOrderPanel() {
  orderPanel.value.show()
  document.body.classList.add('lock')

  setTimeout(() => {
    document.addEventListener('click', checkClickAndCloseOrderPanel)
  }, 1000)
}

function closeOrderPanel() {
  document.body.classList.remove('lock')
  if (orderPanel.value) orderPanel.value.close()

  document.removeEventListener('click', checkClickAndCloseOrderPanel)
}

function checkClickAndCloseOrderPanel(e) {
  if (e.composedPath().includes(orderPanel.value)) return //если клик по панели, то ничего не делать
  else closeOrderPanel()
}

</script>

<style>
.lock {
  overflow: hidden;
}
</style>

<template>

  <div class="cart-panel-device">
    <div class="cart-panel__header">Корзина</div>

    <div class="cart-panel__product-section" v-for="product in productsInCart">

      <img class="cart-panel__product-img" :src="product.image_url" alt="">
      <div class="cart-panel__product-title">{{ product.title }}</div>
      <button class="cart-panel__product-btn-helpers" @click="removeProductFromCart(product)">
        <i class="fa-solid fa-trash-can"></i></button>

      <div class="cart-panel__product-count-price">
        <button class="cart-panel__product-btn-helpers" @click="minusProductInCartForCartPanel(product)">
          <i class="fa-solid fa-minus"></i></button>
        <div>{{ product.countInCart }}</div>
        <button class="cart-panel__product-btn-helpers" @click.prevent="plusProductToCart(product)">
          <i class="fa-solid fa-plus"></i></button>
        <div>x {{ Number(product.price_default) }}р</div>
      </div>

      <div class="cart-panel__product-total">{{ Number(product.countInCart) * Number(product.price_default) }}р
      </div>

    </div>

  </div>
  <div class="cart-panel__total-order-device">
    <div class="cart-panel__total">Итого: {{ totalPrice }}р.</div>
    <button class="cart-panel__btn-order" @click.prevent="openOrderPanel()">Заказать</button>
  </div>

  <dialog class="order-panel" ref="orderPanel">
    Привет мир!
  </dialog>
</template>
