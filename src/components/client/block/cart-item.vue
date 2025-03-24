<script setup>
import { defineProps } from 'vue'
import {
    minusProductInCartForCartPanel,
    plusProductToCart, removeProductFromCart,
} from '/src/store/client-helper.js'

import IngredientsMini from '/src/components/client/block/ingredients-mini.vue'

defineProps(['productOrUserConfig'])

</script>

<template>

    <div class="cart-item">

        <section class="cart-item__imgs-section">

            <img class="cart-item__product-img"
                 :src="productOrUserConfig.image_url"
                 alt="">

            <IngredientsMini v-if="productOrUserConfig.userConfigID"
                             :baseIngredients="productOrUserConfig.baseIngredients"
                             :additionalIngredients="productOrUserConfig.additionalIngredients" />

        </section>

        <div>{{ productOrUserConfig.title }}</div>
        <button class="cart-item__btn-helpers"
                @click="removeProductFromCart(productOrUserConfig)">
            <i class="fa-solid fa-trash-can"></i></button>

        <div class="cart-item__count-price">
            <button class="cart-item__btn-helpers"
                    @click="minusProductInCartForCartPanel(productOrUserConfig)">
                <i class="fa-solid fa-minus"></i></button>
            <div>{{ productOrUserConfig.countInCart }}</div>
            <button class="cart-item__btn-helpers"
                    @click="plusProductToCart(productOrUserConfig)">
                <i class="fa-solid fa-plus"></i></button>
            <div>x {{ Number(productOrUserConfig.price_default) }}р</div>
        </div>

        <div class="cart-item__total">
            {{ Number(productOrUserConfig.countInCart) * Number(productOrUserConfig.price_default) }}р
        </div>

    </div>

</template>