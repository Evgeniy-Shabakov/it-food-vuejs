<script setup>
import { defineProps } from 'vue'

const props = defineProps(['baseIngredients', 'additionalIngredients'])

const additionalIngredients = props.additionalIngredients.filter(el => el.quantity > 0)
</script>

<template>
    <div>

        <div v-if="baseIngredients.length > 0">
            <div class="ingredients-description__type-title">Базовые игредиенты</div>

            <div v-for="baseIngredient in baseIngredients">
                <span>{{ baseIngredient.ingredient.title }}</span>
                <span v-if="baseIngredient.isDelete"
                      class="ingredients-description__deleting-ingredient"> - УДАЛЕНО</span>
            </div>
        </div>

        <div v-if="additionalIngredients.length > 0">
            <div class="ingredients-description__type-title">Дополнительные игредиенты</div>

            <div v-for="additionalIngredient in additionalIngredients">
                <span>{{ additionalIngredient.ingredient.title }}</span>
                <span> - {{ additionalIngredient.quantity }} шт.</span>
            </div>
        </div>

    </div>
</template>

<style scoped>
.ingredients-description__type-title {
    color: green;
}

.ingredients-description__deleting-ingredient {
    color: red;
}
</style>