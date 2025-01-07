<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentIngredient, ingredients, textLoadOrFailForVue, getModelAxios, updateModelAxios
} from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const addingIngredientDialog = ref()
const closeAddingIngredientDialog = ref()

const ingredientInputedData = reactive({
  initialize(ingredient) {
    this.title = ingredient.title
    this.image_file = null
    this.description = ingredient.description
    this.price_default = ingredient.price_default
    this.ingredient_ids = ingredient.replacements.map(obj => obj.id);
    this.is_active = Boolean(ingredient.is_active)
  }
})

const imageUrl = computed(() => {
  if (ingredientInputedData.image_file) return URL.createObjectURL(ingredientInputedData.image_file)
  else return currentIngredient.value.image_url
})

const validationErrors = ref({})

let textDone = ref('')

//проверка если роут загружается из закладки или обновления страницы
if (currentIngredient.value == null) {
  getModelAxios('ingredients', useRoute().params.id)
    .then(res => {
      ingredientInputedData.initialize(currentIngredient.value)
    })
}
else ingredientInputedData.initialize(currentIngredient.value)

function updateIngredient() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  ingredientInputedData.id = currentIngredient.value.id

  formData.append("id", ingredientInputedData.id);
  formData.append("title", ingredientInputedData.title);
  if (ingredientInputedData.image_file) formData.append("image_file", ingredientInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description", ingredientInputedData.description);
  if (ingredientInputedData.price_default) formData.append("price_default", ingredientInputedData.price_default); //без условия не видит валидацию required в Ларавел
  ingredientInputedData.ingredient_ids.forEach(id => {
    formData.append("ingredient_ids[]", id); // Добавить каждый id по отдельности
  });
  formData.append("is_active", ingredientInputedData.is_active ? 1 : 0)

  updateModelAxios('ingredients', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })
}

function imageFileChange(e) {
  ingredientInputedData.image_file = e.target.files[0];
}

function changeImageBtnPressed() {
  document.getElementById('imageInput').click()
}
</script>

<template>
  <h2>Редактирование ингредиента</h2>
  <form v-show="currentIngredient"
        class="admin-forms">

    <label class="required">Наименование</label>
    <input ref="fieldInputTitle"
           type="text"
           v-model="ingredientInputedData.title"
           placeholder="Введите название игредиента"
           @click.prevent="validationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.title }}</div>

    <label class="required">Изображение</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__product"
           :src="imageUrl"
           alt="">
      <input type="file"
             @click="validationErrors.image_file = ''; textDone = ''"
             @change="imageFileChange"
             style="display:none;"
             id="imageInput"
             accept="image/*">
      <button id="admin-forms__div-img-btn__btn"
              class="btn btn-view"
              @click.prevent="changeImageBtnPressed">Изменить</button>
    </div>
    <div class="invalid-text">{{ validationErrors.image_file }}</div>

    <label>Описание</label>
    <textarea v-model="ingredientInputedData.description"
              placeholder="Введите описание ингредиента до 300 символов"
              @click.prevent="validationErrors.description = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description }}</div>

    <label class="required">Цена по умолчанию</label>
    <input type="number"
           min="1"
           step="any"
           v-model="ingredientInputedData.price_default"
           @click.prevent="validationErrors.price_default = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.price_default }}</div>

    <label>Ингредиенты для замены по умолчанию</label>
    <div class="ingredients-for-replace">
      <template v-for="ingredient in ingredients">
        <div v-if="ingredientInputedData.ingredient_ids.includes(ingredient.id)"
             class="ingredients-for-replace__item">
          <img class="ingredients-for-replace__img"
               :src="ingredient.image_url"
               alt="">
          <div class="ingredients-for-replace__title">{{ ingredient.title }}</div>
        </div>
      </template>
    </div>
    <button class="btn btn-view ingredients-editor-btn"
            @click.prevent="addingIngredientDialog.showModal()">Редактор
      ингредиентов</button>
    <div class="invalid-text">{{ validationErrors.ingredient_ids }}</div>

    <span class="required">Показывать ингредиент на сайте:</span>
    <input type="checkbox"
           v-model="ingredientInputedData.is_active"
           @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>

    <button class="btn btn-view"
            @click.prevent="updateIngredient()">Редактировать</button>

  </form>

  <div v-show="currentIngredient == null"
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

  <dialog ref="addingIngredientDialog"
          class="dialog">

    <p class="dialog__title">Выбирите ингредиенты для замены</p>

    <table class="admin-index-table">

      <tr v-for="ingredient in ingredients">
        <td>
          <img class=""
               :src="ingredient.image_url">
          <h5>{{ ingredient.title }}</h5>
        </td>
        <td>
          <span class="color-done"
                v-if="ingredient.is_active">Активен</span>
          <span class="color-error"
                v-else>Не активен</span>
        </td>
        <td>
          {{ ingredient.price_default }} р.
        </td>
        <td>
          <input type="checkbox"
                 class="dialog__chekbox"
                 v-model="ingredientInputedData.ingredient_ids"
                 :value="ingredient.id"
                 :disabled="currentIngredient.id == ingredient.id">
        </td>
      </tr>

    </table>

    <div class="dialog__btn-wrapper">
      <button class="btn btn-view"
              @click.prevent="addingIngredientDialog.close()">Сохранить</button>
    </div>

    <button ref="closeAddingIngredientDialog"
            class="dialog__btn-close"
            @click.prevent="addingIngredientDialog.close()">x</button>

  </dialog>

</template>

<style scoped>
.ingredients-editor-btn {
  margin-top: 0;
}

.ingredients-table-font {
  font-size: 14px;
  font-weight: 400;
}

.ingredients-for-replace {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.ingredients-for-replace__item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ingredients-for-replace__img {
  width: 50px;
}

.ingredients-for-replace__title {
  width: max-content;
}
</style>
