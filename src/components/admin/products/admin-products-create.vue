<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { categories, ingredients, textLoadOrFailForVue, storeModelAxios } from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { loadCategories } from '/src/store/loading-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

const fieldInputTitle = ref(null)

const productInputedData = reactive({
  initialize(categoryId) {
    this.title = ''
    this.category_id = categoryId
    this.image_file = null
    this.description_short = ''
    this.description_full = ''
    this.price_default = null
    this.is_active = false
  }
})

const imageUrl = computed(() => {
  if (productInputedData.image_file) return URL.createObjectURL(productInputedData.image_file)
  else return '/src/assets/images/image_empty.png'
})

const validationErrors = ref({})

const textDone = ref(null)


onMounted(async () => {
  dataForComponentLoadingType.value = await loadCategories()

  if (dataForComponentLoadingType.value === LOADING_TYPE.error) return

  if (categories.value.length == 0) {
    alert('Сначала добавьте категории')
    router.push({ name: 'admin.categories.create' })
    return
  }

  productInputedData.initialize(categories.value[0].id)

  fieldInputTitle.value.focus()
})

function storeProduct() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  formData.append("title", productInputedData.title);
  formData.append("category_id", productInputedData.category_id);
  if (productInputedData.image_file) formData.append("image_file", productInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description_short", productInputedData.description_short);
  formData.append("description_full", productInputedData.description_full);
  if (productInputedData.price_default) formData.append("price_default", productInputedData.price_default); //без условия не видит валидацию required в Ларавел
  formData.append("is_active", productInputedData.is_active ? 1 : 0)

  storeModelAxios('products', formData)
    .then(res => {
      productInputedData.initialize(productInputedData.category_id)
      document.getElementById('imageInput').value = '' //очищаем инпут чтобы реагировал на добавление той же картинки
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

  <h2>Добавление товара</h2>

  <form v-show="categories"
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
              @click.prevent="changeImageBtnPressed">Добавить</button>
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
            @click.prevent="storeProduct()">Добавить</button>

  </form>

  <div v-show="categories == null"
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

</template>
