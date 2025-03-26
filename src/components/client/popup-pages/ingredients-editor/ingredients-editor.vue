<script setup>
import { computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import router, { previousRoute } from "/src/router.js"
import {
   initializeUserBaseIngredientsForProductTemporary,
   initializeUserAdditonalIngredientsForProductTemporary,
   resetCurrentConfig
} from '/src/store/client/popup-pages/ingredients-editor.js'
import { rerecordProductWithUserConfigs } from '/src/store/client/save/user-configs-products.js'
import { findProductById } from '/src/store/models/product'
import { createUserConfigForProduct } from '/src/store/models/user-config'
import DialogMiniInfo from '/src/components/client/block//dialog-mini-info.vue'

const productID = Number(useRoute().params.id)
const userConfigIndex = useRoute().params.userConfigIndex
   ? Number(useRoute().params.userConfigIndex)
   : useRoute().params.userConfigIndex

const product = findProductById(productID)

//нужно если переход происходит с обновленной страницы добавления доп ингредиентов
if (!product.userBaseIngredientsTemporary) {
   initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
}

if (previousRoute.path == '/') {
   initializeUserBaseIngredientsForProductTemporary(product, userConfigIndex)
   initializeUserAdditonalIngredientsForProductTemporary(product, userConfigIndex)
}

const totalPrice = computed(() => {
   let total = 0

   if (product.userAdditionalIngredientsTemporary) {
      product.userAdditionalIngredientsTemporary.forEach(element => {
         total += Number(element.ingredient.price_default) * element.quantity
      })
   }

   if (product.userBaseIngredientsTemporary) {
      product.userBaseIngredientsTemporary.forEach(element => {
         total += Number(element.ingredient.additionalPrice)
      })
   }

   total += Number(product.price_default)

   return total
})

async function saveConfig() {
   createUserConfigForProduct(product, product.userBaseIngredientsTemporary, product.userAdditionalIngredientsTemporary)

   rerecordProductWithUserConfigs(product)

   resetCurrentConfig(product, userConfigIndex);

   await router.push('/')

   // один nextTick не успевает
   await nextTick()
   await nextTick()

   scrollToNewProductUserConfig()
}

function scrollToNewProductUserConfig() {
   const element = document
      .getElementById(`${product.id}-${product.userConfigs[product.userConfigs.length - 1].userConfigID}`)

   if (!element) return

   element.scrollIntoView({ block: "center" })
}

</script>

<template>
   <div class="client-popup-page-layout__main-section">

      <h1 class="client-popup-page-layout__h1 ingredients-editor__h1">
         <span>{{ product.title }} </span>
         <br>

      </h1>
      <div class="ingredients-editor__h1-description">(редактор ингредиентов)</div>

      <article class="ingredients-editor">

         <img class="ingredients-editor__product-image"
              :src="product.image_url"
              alt="">
         <p class="ingredients-editor__description">
            Настрой ингредиенты по своему вкусу
         </p>

         <div class="ingredients-editor__btn-reset-and-btn-info">
            <button class="btn--secondary"
                    @click="resetCurrentConfig(product, userConfigIndex)">
               Сбросить изменения
            </button>

            <button class="ingredients-editor__btn-info">
               <i class="fas fa-info-circle"></i>
               <DialogMiniInfo right=0>
                  Базовые игредиенты - ингредиенты, которые уже есть в продуке и которые можно удалить или заменить.
                  Изменение ингредиентов может повлиять на стоимость продукта.
               </DialogMiniInfo>
            </button>
         </div>


         <section v-if="product.userBaseIngredientsTemporary.length > 0"
                  class="ingredients-editor__base-ingredients">
            <div class="ingredients-editor__base-ingredients-title">Базовые ингредиенты</div>
            <div v-for="(baseIngredient, index) in product.userBaseIngredientsTemporary"
                 class="ingredients-editor__base-ingredients-item">
               <div class="ingredients-editor__base-ingredients-item-image-and-title">
                  <img class="ingredients-editor__base-ingredients-item-image"
                       :class="{
                        'image-gray': baseIngredient.isDelete
                           || baseIngredient.ingredient.is_in_stop_list
                           || !baseIngredient.ingredient.is_active
                     }"
                       :src="baseIngredient.ingredient.image_url"
                       alt="">
                  <span class="ingredients-editor__base-ingredients-item-title"
                        :class="{ 'text-line-through': baseIngredient.isDelete }">
                     {{ baseIngredient.ingredient.title }}
                     <span v-if="baseIngredient.ingredient.is_in_stop_list">(будет позже)</span>
                     <span v-if="!baseIngredient.ingredient.is_active">(недоступен)</span>
                  </span>
               </div>

               <div class="ingredients-editor__base-ingredients-item-btns-section">
                  <button v-if="baseIngredient.ingredient.can_delete"
                          class="ingredients-editor__base-ingredients-item-btn-delete"
                          @click="baseIngredient.isDelete = !baseIngredient.isDelete">
                     <span v-if="baseIngredient.isDelete">восстановить</span>
                     <span v-else>удалить</span>
                  </button>

                  <router-link v-if="baseIngredient.ingredient.can_replace && !baseIngredient.isDelete"
                               :to="{
                                 name: 'client.menu.popup.ingredients-editor.replacing-base-ingredient',
                                 params: {
                                    id: productID,
                                    userConfigIndex: userConfigIndex,
                                    position: index
                                 }
                              }"
                               class="ingredients-editor__base-ingredients-item-btn-edit">
                     заменить
                  </router-link>

               </div>
            </div>
         </section>

         <section v-if="product.additional_ingredients.length > 0"
                  class="ingredients-editor__additional-ingredients">
            <router-link :to="{
               name: 'client.menu.popup.ingredients-editor.adding-additional-ingredients',
               params: {
                  id: productID,
                  userConfigIndex: userConfigIndex,
               }
            }"
                         class="ingredients-editor__additional-ingredients-btn-add btn--secondary">
               Добавить дополнительные ингредиенты
            </router-link>

            <div class="ingredients-editor__additional-ingredients-list">
               <template v-for="additionalIngredient in product.userAdditionalIngredientsTemporary">
                  <div v-if="additionalIngredient.quantity > 0"
                       class="ingredients-editor__additional-ingredients-item">
                     <img class="ingredients-editor__additional-ingredients-item-image"
                          :src="additionalIngredient.ingredient.image_url"
                          alt="">
                     <span class="ingredients-editor__additional-ingredients-item-quantity ">
                        {{ additionalIngredient.quantity }}
                     </span>
                  </div>
               </template>
            </div>
         </section>

      </article>

   </div>

   <div class="client-popup-page-layout__btn-section">

      <div class="product-card__price-and-btn ingredients-editor__price-and-btn">
         <p class="product-card__price"> {{ Number(totalPrice) }} р.</p>
         <button class="btn btn-submit"
                 @click="saveConfig()">
            Сохранить конфигурацию
         </button>
      </div>

   </div>

</template>
<style scoped>
.ingredients-editor__h1 {
   margin-bottom: 0;
}

.ingredients-editor__h1-description {
   font-size: 14px;
   text-align: center;
   margin-bottom: 15px;
}

.ingredients-editor__product-image {
   display: block;
   margin: auto;
   width: 100px;
   aspect-ratio: 1/1;
   margin-bottom: 15px;
}

.ingredients-editor__description {
   font-size: 14px;
   color: grey;
   text-align: center;
   margin-bottom: 10px;
}

.ingredients-editor__btn-reset-and-btn-info {
   display: flex;
   align-items: center;
   justify-content: space-between;
}

.ingredients-editor__btn-info {
   position: relative;
   font-size: 25px;
   color: var(--brand-color);
   background-color: transparent;
   border: 0;

   display: flex;
}

@media (hover: hover) {
   .ingredients-editor__btn-info:hover {
      color: var(--brand-color-hover);
   }
}

.ingredients-editor__btn-info:active {
   color: var(--brand-color-active);
}

.ingredients-editor__base-ingredients {
   margin-top: 10px;
   font-size: 16px;
   margin-bottom: 25px;
}

.ingredients-editor__base-ingredients-title {
   margin-bottom: 10px;
}

.ingredients-editor__base-ingredients-item {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 10px;
   margin-bottom: 10px;
}

.ingredients-editor__base-ingredients-item-image-and-title {
   display: flex;
   align-items: center;
   gap: 5px;
}

.ingredients-editor__base-ingredients-item-btns-section {
   /* для запрета переноса кнопок при длинном имени ингредиента   */
   display: flex;
}

.ingredients-editor__base-ingredients-item-image {
   width: 25px;
   aspect-ratio: 1/1;
}

.ingredients-editor__base-ingredients-item-title {
   font-size: 14px;
   color: grey;
}

.image-gray {
   filter: grayscale(100%);
}

.text-line-through {
   text-decoration: line-through;
}

.ingredients-editor__base-ingredients-item-btn-edit {
   font-family: Arial, Helvetica, sans-serif;
   display: inline-block;
   text-decoration: none;
   border: 2px solid var(--brand-color);
   border-radius: 15px;
   background-color: var(--text-color-on-brand-color);
   color: var(--brand-color);
   font-size: 14px;
   padding: 5px;
   margin-left: 5px;
}

@media (hover: hover) {
   .ingredients-editor__base-ingredients-item-btn-edit:hover {
      color: var(--brand-color-hover);
      border-color: var(--brand-color-hover);
   }
}

.ingredients-editor__base-ingredients-item-btn-edit:active {
   color: var(--brand-color-hover);
   border-color: var(--brand-color-hover);
}

.ingredients-editor__base-ingredients-item-btn-delete {
   display: inline-block;
   text-decoration: none;
   border: 2px solid red;
   border-radius: 15px;
   background-color: white;
   color: red;
   font-size: 14px;
   padding: 5px;
}

@media (hover: hover) {
   .ingredients-editor__base-ingredients-item-btn-delete:hover {
      color: var(--brand-color-hover);
      border-color: var(--brand-color-hover);
   }
}

.ingredients-editor__base-ingredients-item-btn-delete:active {
   color: var(--brand-color-hover);
   border-color: var(--brand-color-hover);
}

.ingredients-editor__additional-ingredients {
   font-size: 16px;
}

.ingredients-editor__additional-ingredients-btn-add {
   display: block;
   text-decoration: none;
   text-align: center;
   width: 100%;
   margin-bottom: 10px;
}

.ingredients-editor__additional-ingredients-list {
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
}

.ingredients-editor__additional-ingredients-item {
   position: relative;
}

.ingredients-editor__additional-ingredients-item-image {
   width: 40px;
   aspect-ratio: 1/1;
}

.ingredients-editor__additional-ingredients-item-quantity {
   position: absolute;
   bottom: 0;
   right: -10px;

   display: flex;
   align-items: center;
   justify-content: center;

   border-radius: 50%;
   width: 20px;
   height: 20px;

   font-size: 10px;
   font-weight: 500;
   color: var(--text-color-on-brand-color);
   background-color: var(--brand-color);
}

.ingredients-editor__price-and-btn {
   align-self: normal;
   width: 100%;
}
</style>