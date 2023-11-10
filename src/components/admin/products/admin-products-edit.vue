<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentProduct, categories, textLoadOrFailForVue,
  getModelsAxios, getModelAxios, updateModelAxios,
} from '/src/store/axios-helper.js'

const fieldInputTitle = ref(null)

const inputedTitle = ref('')
const selectedCategory = ref()
const selectedImageFile = ref(null)
const inputedDescriptionShort = ref('')
const inputedDescriptionFull = ref('')
const inputedPriceDefault = ref()
const inputedIsActive = ref(true)

const imageUrl = computed(() => {
  if (selectedImageFile.value) return URL.createObjectURL(selectedImageFile.value)
  else return currentProduct.value.image_url
})

let textErrorInputTitle = ref('')
let textErrorSelectCategory = ref('')
let textErrorSelectImageFile = ref('')
let textErrorInputDescriptionShort = ref('')
let textErrorInputDescriptionFull = ref('')
let textErrorInputPriceDefault = ref('')
let textErrorInputIsActive = ref('')

let textDone = ref('')

function initializeProduct() {
  inputedTitle.value = currentProduct.value.title
  selectedCategory.value = categories.value[currentProduct.value.category.number_in_list - 1]
  inputedDescriptionShort.value = currentProduct.value.description_short
  inputedDescriptionFull.value = currentProduct.value.description_full
  inputedPriceDefault.value = currentProduct.value.price_default
  inputedIsActive.value = currentProduct.value.is_active ? true : false
}

//проверка если роут загружается из закладки или обновления страницы
if (currentProduct.value == null || categories.value == null) {
  getModelAxios('products', useRoute().params.id)
    .then(res => {
      getModelsAxios('categories')
        .then(res => {
          initializeProduct()
          fieldInputTitle.value.focus()
        })
    })
}
else initializeProduct()

onMounted(() => { fieldInputTitle.value.focus() })

function updateProduct(data) {
  textErrorInputTitle.value = ''
  textErrorSelectCategory.value = ''
  textErrorSelectImageFile.value = ''
  textErrorInputDescriptionShort.value = ''
  textErrorInputDescriptionFull.value = ''
  textErrorInputPriceDefault.value = ''
  textErrorInputIsActive.value = ''

  textDone.value = ''

  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("title", data.title);
  formData.append("category_id", data.category_id);
  if (data.image_file) formData.append("image_file", data.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description_short", data.description_short);
  formData.append("description_full", data.description_full);
  if (data.price_default) formData.append("price_default", data.price_default); //без условия не видит валидацию required в Ларавел
  formData.append("is_active", data.is_active ? 1 : 0)

  updateModelAxios('products', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputTitle.value = err.response.data.errors.title[0]
      }
      if (err.response.data.errors.category_id) {
        textErrorSelectCategory.value = err.response.data.errors.category_id[0]
      }
      if (err.response.data.errors.image_file) {
        textErrorSelectImageFile.value = err.response.data.errors.image_file[0]
      }
      if (err.response.data.errors.description_short) {
        textErrorInputDescriptionShort.value = err.response.data.errors.description_short[0]
      }
      if (err.response.data.errors.description_full) {
        textErrorInputDescriptionFull.value = err.response.data.errors.description_full[0]
      }
      if (err.response.data.errors.price_default) {
        textErrorInputPriceDefault.value = err.response.data.errors.price_default[0]
      }
      if (err.response.data.errors.is_active) {
        textErrorInputIsActive.value = err.response.data.errors.is_active[0]
      }
    })
}

function imageFileChange(e) {
  selectedImageFile.value = e.target.files[0];
}

function changeImageBtnPressed() {
  document.getElementById('imageInput').click()
}
</script>

<template>
  <h2>Редактирование товара</h2>
  <form v-show="currentProduct && categories" class="admin-forms">
    <label class="required">Наименование</label>
    <input ref="fieldInputTitle" type="text" v-model="inputedTitle" placeholder="Введите название товара"
      @click.prevent="textErrorInputTitle = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputTitle }}</div>

    <label class="required">Категория</label>
    <select v-model="selectedCategory" @click.prevent="textErrorSelectCategory = ''; textDone = ''">
      <option v-for="category in categories" :value="category">{{ category.title }}</option>
    </select>
    <div class="invalid-text">{{ textErrorSelectCategory }}</div>

    <label class="required">Изображение</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__product" :src="imageUrl" alt="">
      <input type="file" @click="textErrorSelectImageFile = ''; textDone = ''" @change="imageFileChange"
        style="display:none;" id="imageInput" accept="image/*">
      <button id="admin-forms__div-img-btn__btn" class="btn btn-view"
        @click.prevent="changeImageBtnPressed">Изменить</button>
    </div>
    <div class="invalid-text">{{ textErrorSelectImageFile }}</div>

    <label>Короткое описание</label>
    <textarea v-model="inputedDescriptionShort" placeholder="Введите короткое описание товара до 150 символов"
      @click.prevent="textErrorInputDescriptionShort = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ textErrorInputDescriptionShort }}</div>

    <label>Полное описание</label>
    <textarea v-model="inputedDescriptionFull" placeholder="Введите полное описание товара до 1000 символов"
      @click.prevent="textErrorInputDescriptionFull = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ textErrorInputDescriptionFull }}</div>

    <label class="required">Цена по умолчанию</label>
    <input type="number" min="1" step="any" v-model="inputedPriceDefault"
      @click.prevent="textErrorInputPriceDefault = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPriceDefault }}</div>

    <span class="required">Показывать товар на сайте:</span>
    <input type="checkbox" v-model="inputedIsActive" @click="textErrorInputIsActive = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputIsActive }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="updateProduct({
      id: currentProduct.id,
      title: inputedTitle,
      category_id: selectedCategory.id,
      image_file: selectedImageFile,
      description_short: inputedDescriptionShort,
      description_full: inputedDescriptionFull,
      price_default: inputedPriceDefault,
      is_active: inputedIsActive
    })">Редактировать</button>
  </form>
  <div v-show="currentProduct == null || categories == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

