<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from "/src/router.js"
import { getProductById, initializeUserBaseIngredientsForProductTemporary }
    from '/src/store/client/popup-pages/ingredients-editor'

const productID = Number(useRoute().params.id)
const position = Number(useRoute().params.position)
const userConfigIndex = useRoute().params.userConfigIndex
    ? Number(useRoute().params.userConfigIndex)
    : useRoute().params.userConfigIndex

const product = getProductById(productID)

if (!product.userBaseIngredientsTemporary) {
    initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
}

const userBaseIngredient = product.userBaseIngredientsTemporary[position]

const selectedIngredientID = ref(userBaseIngredient.ingredient.id)

function save() {
    if (userBaseIngredient.ingredient.id != selectedIngredientID.value) {

        const replace = userBaseIngredient.ingredient.replacements
            .find(el => el.id == selectedIngredientID.value)

        Object.keys(replace).forEach(key => {
            if (userBaseIngredient.ingredient.hasOwnProperty(key)) {
                userBaseIngredient.ingredient[key] = replace[key];
            }
        })
    }

    router.go(-1)
}

</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">
            Выбирите замену для <br> {{ userBaseIngredient.ingredient.title }}
        </h1>

        <div>

            <div v-for="ingredient in userBaseIngredient.ingredient.replacements"
                 class="flex items-center justify-between mb-15px text-16px">

                <label class="flex items-center gap-10px grow"
                       :for="ingredient.id + ' - id-base-ingredient'">
                    <img class="w-50px aspect-square"
                         :src="ingredient.image_url"
                         alt="">
                    <span>(+{{ ingredient.additionalPrice }}р.)</span>
                    <span>{{ ingredient.title }}</span>
                </label>

                <input class="w-25px aspect-square"
                       type="radio"
                       :id="ingredient.id + ' - id-base-ingredient'"
                       :value="ingredient.id"
                       v-model="selectedIngredientID">

            </div>

        </div>

    </div>

    <div class="client-popup-page-layout__btn-section">

        <button @click="save"
                class="btn btn-submit w-full text-center no-underline">
            Сохранить
        </button>

    </div>

</template>