<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from "/src/router.js"
import { getProductById, initializeUserAdditonalIngredientsForProductTemporary }
    from '/src/store/client/popup-pages/product-card-full'

const productID = Number(useRoute().params.id)
const userConfigIndex = useRoute().params.userConfigIndex
    ? Number(useRoute().params.userConfigIndex)
    : useRoute().params.userConfigIndex
const product = getProductById(productID)

if (!product.userAdditionalIngredientsTemporary) {
    initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex)
}

const userAdditionalIngredientsForPage = ref(JSON.parse(JSON.stringify(product.userAdditionalIngredientsTemporary)))

function minusUserAdditionalIngredient(userAdditionalIngredient) {
    if (userAdditionalIngredient.quantity <= 0) return
    userAdditionalIngredient.quantity--
}

function plusUserAdditionalIngredient(userAdditionalIngredient) {
    if (userAdditionalIngredient.quantity >= userAdditionalIngredient.ingredient.max_quantity) return
    userAdditionalIngredient.quantity++
}

function save() {
    product.userAdditionalIngredientsTemporary = userAdditionalIngredientsForPage.value
    router.go(-1)
}

</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">
            Дополнительные ингредиенты
        </h1>

        <div class="adding-additional-ingredients">

            <section v-if="product.additional_ingredients.length > 0"
                     class="adding-additional-ingredients__additional-ingredients">

                <div v-for="additonalIngredient in userAdditionalIngredientsForPage"
                     class="adding-additional-ingredients__additional-ingredients-item">
                    <div class="adding-additional-ingredients__additional-ingredients-item-image-and-title">
                        <img class="adding-additional-ingredients__additional-ingredients-item-image"
                             :src="additonalIngredient.ingredient.image_url"
                             alt="">
                        <span>{{ additonalIngredient.ingredient.price_default }}р.</span>
                        <span class="adding-additional-ingredients__additional-ingredients-item-title ">
                            {{ additonalIngredient.ingredient.title }}
                        </span>
                    </div>

                    <div class="product-card__plus-count-minus">
                        <button class="btn btn-submit"
                                @click="minusUserAdditionalIngredient(additonalIngredient)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <div> {{ additonalIngredient.quantity }} </div>
                        <button class="btn btn-submit"
                                @click="plusUserAdditionalIngredient(additonalIngredient)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>

            </section>

        </div>

    </div>

    <div class="client-popup-page-layout__btn-section">
        <button class="adding-additional-ingredients__btn-save  btn btn-submit"
                @click=save()>
            Сохранить
        </button>
    </div>

</template>


<style scoped>
.adding-additional-ingredients__additional-ingredients {
    margin-top: 10px;
    font-size: 16px;
    margin-bottom: 25px;
}

.adding-additional-ingredients__additional-ingredients-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
}

.adding-additional-ingredients__additional-ingredients-item-image-and-title {
    display: flex;
    align-items: center;
    gap: 5px;
}

.adding-additional-ingredients__additional-ingredients-item-image {
    width: 25px;
    aspect-ratio: 1/1;
}

.adding-additional-ingredients__additional-ingredients-item-title {
    font-size: 14px;
    color: grey;
}

.adding-additional-ingredients__additional-ingredients-item-btn-edit {
    display: inline-block;
    text-decoration: none;
    border: 2px solid var(--brand-color);
    border-radius: 15px;
    background-color: var(--text-color-on-brand-color);
    color: var(--brand-color);
    font-size: 14px;
    padding: 5px;
}

@media (hover: hover) {
    .adding-additional-ingredients__additional-ingredients-item-btn-edit:hover {
        color: var(--brand-color-hover);
        border-color: var(--brand-color-hover);
    }
}

.adding-additional-ingredients__additional-ingredients-item-btn-edit:active {
    color: var(--brand-color-hover);
    border-color: var(--brand-color-hover);
}

.adding-additional-ingredients__additional-ingredients-item-btn-delete {
    display: inline-block;
    text-decoration: none;
    border: 2px solid red;
    border-radius: 15px;
    background-color: white;
    color: red;
    font-size: 14px;
    padding: 5px;
    margin-right: 5px;
}

@media (hover: hover) {
    .adding-additional-ingredients__additional-ingredients-item-btn-delete:hover {
        color: var(--brand-color-hover);
        border-color: var(--brand-color-hover);
    }
}

.adding-additional-ingredients__additional-ingredients-item-btn-delete:active {
    color: var(--brand-color-hover);
    border-color: var(--brand-color-hover);
}

.adding-additional-ingredients__btn-save {
    width: 100%;
}
</style>