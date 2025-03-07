<script setup>
import { defineProps, computed } from 'vue'
import { minusProductInCartForMenuPage, plusProductToCart, removeProductFromCart } from '/src/store/client-helper.js'
import { rerecordProductWithUserConfigs } from '/src/store/client/save/user-configs-products.js'

import IngredientsMini from '/src/components/client/block/ingredients-mini.vue'

const props = defineProps(['product', 'userConfig', 'index'])

const baseIngredients = props.userConfig ? props.userConfig.baseIngredients : props.product.base_ingredients

const additionalIngredients = props.userConfig ? props.userConfig.additionalIngredients : []

const price = computed(() => {
    if (!props.userConfig) return props.product.price_default

    let total = 0

    props.userConfig.additionalIngredients.forEach(element => {
        total += Number(element.ingredient.price_default) * element.quantity
    })

    props.userConfig.baseIngredients.forEach(element => {
        total += Number(element.ingredient.additionalPrice)
    })

    total += Number(props.product.price_default)

    props.userConfig.price_default = total //записываем цену в userConfig для корзины

    return total
})

function deleteUserConfig() {
    removeProductFromCart(null, props.userConfig)

    const index = props.product.userConfigs.findIndex(config => config.id == props.userConfig.id)
    props.product.userConfigs.splice(index, 1)

    rerecordProductWithUserConfigs(props.product)
}

</script>

<template>

    <!-- id нужен для прокрутки к новой карточке продукта после создания новой конфигурации -->
    <article :id="`${product.id}${userConfig ? '-' + userConfig.id : ''}`"
             class="product-card">

        <div class="product-card__image-and-ingredients">

            <img class="product-card__product-image"
                 :src="product.image_url"
                 alt="">

            <IngredientsMini :baseIngredients="baseIngredients"
                             :additionalIngredients="additionalIngredients" />

            <router-link v-if="product.base_ingredients.length > 0 || product.additional_ingredients.length > 0"
                         class="product-card__btn-edit"
                         :to="{
                            name: 'client.menu.popup.ingredients-editor',
                            params:
                            {
                                id: product.id,
                                userConfigIndex: index >= 0 ? index : null
                            }
                        }">
                изменить
            </router-link>

            <!-- <button class="product-card__btn-in-cart"
                    @click="console.log(product, userConfig)">log</button> -->

        </div>

        <p class="product-card__title-btn-delete">
            <span class="product-card__title">{{ product.title }}</span>

            <button class="product-card__btn-delete"
                    v-if="userConfig"
                    @click=deleteUserConfig>
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </p>

        <p class="product-card__description-short"
           :class="{ 'product-card__description-short--user-config': userConfig }">
            <span v-if="userConfig">
                {{ product.title }} с Вашей конфигурацией. Можно удалить или создать новую
            </span>
            <span v-else>{{ product.description_short }}</span>
        </p>

        <div class="product-card__price-and-btn">

            <p class="product-card__price"> {{ Number(price) }} р.</p>

            <button v-if="
                (userConfig && (userConfig.countInCart == 0 || userConfig.countInCart == undefined))
                ||
                (!userConfig && (product.countInCart == 0 || product.countInCart == undefined))"
                    class="product-card__btn-in-cart btn btn-submit"
                    @click="plusProductToCart(product, userConfig)"
                    type="button">В корзину
            </button>

            <div v-else
                 class="product-card__plus-count-minus">
                <button class="product-card__btn-plus-minus btn btn-submit"
                        @click="minusProductInCartForMenuPage(product, userConfig)">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <div v-if="userConfig">{{ userConfig.countInCart }}</div>
                <div v-else>{{ product.countInCart }}</div>
                <button class="product-card__btn-plus-minus btn btn-submit"
                        @click="plusProductToCart(product, userConfig)">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>

        </div>

    </article>

</template>