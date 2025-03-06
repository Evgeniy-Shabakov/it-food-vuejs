<script setup>
import { defineProps } from 'vue'

const props = defineProps(['baseIngredients', 'additionalIngredients'])

const additionalIngredients = props.additionalIngredients.filter(el => el.quantity > 0)
</script>

<template>

     <div>
          <div v-for="baseIngredient in baseIngredients"
               class="ingredients-mini__ingredient-container">
               <img class="ingredients-mini__ingredient-img"
                    :src="baseIngredient.image_url || baseIngredient.ingredient.image_url"
                    alt="">
               <img v-if="baseIngredient.isDelete"
                    class="ingredients-mini__ingredient-img ingredients-mini__ingredient-img-cross"
                    src="/src/assets/images/cross.png"
                    alt="">
          </div>
     </div>

     <div>
          <div v-for="additionalIngredient in additionalIngredients"
               class="ingredients-mini__ingredient-container">
               <img class="ingredients-mini__ingredient-img"
                    :src="additionalIngredient.ingredient.image_url"
                    alt="">
               <div class="ingredients-mini__count">
                    {{ additionalIngredient.quantity }}
               </div>
          </div>
     </div>

</template>