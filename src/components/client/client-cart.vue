<script setup>
import {
  productsInCart, totalPrice,
  minusProductInCartForCartPanel,
  plusProductToCart, removeProductFromCart
} from '/src/store/client-helper.js'

</script>

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
        <button class="cart-panel__product-btn-helpers" @click="plusProductToCart(product)">
          <i class="fa-solid fa-plus"></i></button>
        <div>x {{ Number(product.price_default) }}р</div>
      </div>

      <div class="cart-panel__product-total">{{ Number(product.countInCart) * Number(product.price_default) }}р
      </div>

    </div>

  </div>
  <div class="cart-panel__total-order-device">
    <div class="cart-panel__total">Итого: {{ totalPrice }}р.</div>
    <button class="cart-panel__btn-order">Заказать</button>
  </div>
</template>

