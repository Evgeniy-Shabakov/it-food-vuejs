<script setup>
import { ref } from 'vue';
import {
  selectedCity, productsInCart, totalProductPrice, deliveryPrice, totalPrice,
  minusProductInCartForCartPanel,
  plusProductToCart, removeProductFromCart
} from '/src/store/client-helper.js'
import { cities, getModelsAxios } from '/src/store/axios-helper.js'

if (selectedCity.value == null) {
  getModelsAxios('cities')
    .then(res => {
      selectedCity.value = cities.value[0]
    })
}

</script>

<template>
  <div v-if="selectedCity">
    <div class="cart-panel-device">
      <div class="cart-panel__header">
        <span>Корзина </span>
        <span>({{ selectedCity.title }})</span>
      </div>

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

      <div class="cart-panel__product-section cart-panel__delivery-section">
        <i class="cart-panel__icon-delivery fa-solid fa-truck"></i>
        <div class="cart-panel__product-title">Доставка</div>
        <div class="cart-panel__product-total">{{ deliveryPrice }}р</div>
      </div>
    </div>

    <div class="cart-panel__total-order-device">

      <div class="cart-panel__block-total">
        <span class="cart-panel__total">Товары: </span>
        <span class="cart-panel__total">{{ totalProductPrice }}р.</span>
        <span class="cart-panel__total">Доставка: </span>
        <span class="cart-panel__total">{{ deliveryPrice }}р.</span>
        <span class="cart-panel__total">Итого: </span>
        <span class="cart-panel__total">{{ totalPrice }}р.</span>
      </div>

      <div class="cart-panel__preview-order-message">
        <div v-if="totalProductPrice < selectedCity.min_order_value_for_delivery">
          Минимальная сумма товаров для заказа {{ selectedCity.min_order_value_for_delivery }}р.
        </div>
        <div v-else-if="totalProductPrice < selectedCity.order_value_for_free_delivery">
          Бесплатная доставка от {{ selectedCity.order_value_for_free_delivery }}р.
        </div>
        <div v-else-if="totalProductPrice >= selectedCity.order_value_for_free_delivery" class="cart-panel__text-free-delivery">
          Бесплатная доставка!!!
        </div>
      </div>

      <div>
        <template v-if="totalProductPrice <= selectedCity.min_order_value_for_delivery">
          <button class="cart-panel__btn-order btn-inactive">Заказать</button>
        </template>
        <template v-else>
          <router-link :to="{ name: 'client.order-panel' }">
            <button class="cart-panel__btn-order">Заказать</button>
          </router-link>
        </template>
      </div>

    </div>
  </div>
</template>
