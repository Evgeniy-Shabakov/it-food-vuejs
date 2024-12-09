<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentProduct, categories, textLoadOrFailForVue, updateModelAxios
} from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { loadCategories, loadCurrentProduct } from '/src/store/loading-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

const productInputedData = reactive({
  initialize(product) {
    this.title = product.title
    this.category_id = product.category.id
    this.image_file = null
    this.description_short = product.description_short
    this.description_full = product.description_full
    this.price_default = product.price_default
    this.is_active = Boolean(product.is_active)
  }
})

const imageUrl = computed(() => {
  if (productInputedData.image_file) return URL.createObjectURL(productInputedData.image_file)
  else return currentProduct.value.image_url
})

const validationErrors = ref({})

let textDone = ref('')

const currentProductId = useRoute().params.id

onMounted(async () => {
  dataForComponentLoadingType.value = await loadCategories()
  dataForComponentLoadingType.value = await loadCurrentProduct(currentProductId)

  if (dataForComponentLoadingType.value === LOADING_TYPE.error) return
  productInputedData.initialize(currentProduct.value)
})

function updateProduct() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  productInputedData.id = currentProduct.value.id

  formData.append("id", productInputedData.id);
  formData.append("title", productInputedData.title);
  formData.append("category_id", productInputedData.category_id);
  if (productInputedData.image_file) formData.append("image_file", productInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description_short", productInputedData.description_short);
  formData.append("description_full", productInputedData.description_full);
  if (productInputedData.price_default) formData.append("price_default", productInputedData.price_default); //без условия не видит валидацию required в Ларавел
  formData.append("is_active", productInputedData.is_active ? 1 : 0)

  updateModelAxios('products', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })
}

function imageFileChange(e) {
  productInputedData.image_file = e.target.files[0];
}

function changeImageBtnPressed() {
  document.getElementById('imageInput').click()
}
</script>

<template>
  <h2>Редактирование товара</h2>

  <form v-show="currentProduct && categories"
        class="admin-forms">

    <label class="required">Наименование</label>
    <input ref="fieldInputTitle"
           type="text"
           v-model="productInputedData.title"
           placeholder="Введите название товара"
           @click.prevent="validationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.title }}</div>

    <label class="required">Категория</label>
    <select v-model="productInputedData.category_id"
            @click.prevent="validationErrors.category_id = ''; textDone = ''">
      <option v-for="category in categories"
              :value="category.id">{{ category.title }}</option>
    </select>
    <div class="invalid-text">{{ validationErrors.category_id }}</div>

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

    <label>Короткое описание</label>
    <textarea v-model="productInputedData.description_short"
              placeholder="Введите короткое описание товара до 150 символов"
              @click.prevent="validationErrors.description_short = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_short }}</div>

    <label>Полное описание</label>
    <textarea v-model="productInputedData.description_full"
              placeholder="Введите полное описание товара до 1000 символов"
              @click.prevent="validationErrors.description_full = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_full }}</div>

    <label class="required">Цена по умолчанию</label>
    <input type="number"
           min="1"
           step="any"
           v-model="productInputedData.price_default"
           @click.prevent="validationErrors.price_default = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.price_default }}</div>

    <span class="required">Показывать товар на сайте:</span>
    <input type="checkbox"
           v-model="productInputedData.is_active"
           @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
            @click.prevent="updateProduct()">Редактировать</button>
  </form>

  <div v-show="currentProduct == null || categories == null"
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

</template>
