<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { storeModelAxios } from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const fieldInputTitle = ref(null)

const ingredientInputedData = reactive({
  initialize() {
    this.title = ''
    this.image_file = null
    this.description = ''
    this.price_default = null
    this.is_active = null
  }
})

ingredientInputedData.initialize()

const imageUrl = computed(() => {
  if (ingredientInputedData.image_file) return URL.createObjectURL(ingredientInputedData.image_file)
  else return '/src/assets/images/image_empty.png'
})

const validationErrors = ref({})

const textDone = ref(null)

onMounted(() => { fieldInputTitle.value.focus() })

function storeIngredient() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  formData.append("title", ingredientInputedData.title);
  if (ingredientInputedData.image_file)
    formData.append("image_file", ingredientInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description", ingredientInputedData.description);
  if (ingredientInputedData.price_default)
    formData.append("price_default", ingredientInputedData.price_default); //без условия не видит валидацию required в Ларавел
  formData.append("is_active", ingredientInputedData.is_active ? 1 : 0)
  
  storeModelAxios('ingredients', formData)
    .then(res => {
      ingredientInputedData.initialize()
      document.getElementById('imageInput').value = '' //очищаем инпут чтобы реагировал на добавление той же картинки
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
  <h2>Добавление ингредиента</h2>

  <form class="admin-forms">

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
              @click.prevent="changeImageBtnPressed">Добавить</button>
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

    <span class="required">Показывать ингредиент на сайте:</span>
    <input type="checkbox"
           v-model="ingredientInputedData.is_active"
           @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
            @click.prevent="storeIngredient()">Добавить</button>

  </form>

</template>
