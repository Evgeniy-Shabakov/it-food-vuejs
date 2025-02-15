<script setup>
import { defineProps, computed } from 'vue'
import { minusProductInCartForMenuPage, plusProductToCart } from '/src/store/client-helper.js'
import { rerecordProductWithUserConfigs } from '/src/store/client/save/user-configs-products.js'

const props = defineProps(['product', 'userConfig', 'index'])

const baseIngredients = computed(() => props.userConfig
    ? props.userConfig.baseIngredients
    : props.product.base_ingredients)

const additionalIngredients = computed(() => {
    if (!props.userConfig) return []

    return props.userConfig.additionalIngredients.filter(el => el.quantity > 0)
})

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

    return total
})

function deleteUserConfig() {
    props.product.userConfigs.splice(props.index, 1)

    rerecordProductWithUserConfigs(props.product)
}

</script>

<template>

    <!-- id нужен для прокрутки к новой карточке продукта после создания новой конфигурации -->
    <article :id="`${product.id}-${index}`"
             class="product-card">

        <div class="product-card__image-and-ingredients">

            <img class="product-card__product-image"
                 :src="product.image_url"
                 alt="">

            <div>
                <img v-for="baseIngredient in baseIngredients"
                     class="product-card__ingredient-image"
                     :class="{ 'product-card__ingredient-image--deleted': baseIngredient.isDelete }"
                     :src="baseIngredient.image_url || baseIngredient.ingredient.image_url"
                     alt="">
            </div>

            <div>
                <img v-for="additionalIngredient in additionalIngredients"
                     class="product-card__ingredient-image"
                     :src="additionalIngredient.ingredient.image_url"
                     alt="">
            </div>

            <router-link v-if="product.base_ingredients.length > 0 || product.additional_ingredients.length > 0"
                         class="product-card__btn-edit"
                         :to="{
                            name: 'client.menu.popup.product-card-full',
                            params:
                            {
                                id: product.id,
                                userConfigIndex: index >= 0 ? index : null
                            }
                        }">
                изменить
            </router-link>

            <!-- <button @click="console.log(product)">лог</button> -->

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
            <button v-if="product.countInCart == 0 || product.countInCart == undefined"
                    class="btn btn-submit"
                    @click="plusProductToCart(product)"
                    type="button">В корзину
            </button>
            <div v-else
                 class="product-card__plus-count-minus">
                <button class="btn btn-submit"
                        @click="minusProductInCartForMenuPage(product)">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <div>{{ product.countInCart }}</div>
                <button class="btn btn-submit"
                        @click="plusProductToCart(product)">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>

        </div>

    </article>

</template>