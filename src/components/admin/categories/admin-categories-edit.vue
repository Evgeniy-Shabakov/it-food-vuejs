<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentCategory, textLoadOrFailForVue,
  updateModelAxios, getModelAxios
} from '/src/store/axios-helper.js'

const fieldInputCategory = ref(null)

const inputedCategory = ref('')
let oldTitle = ''

let textErrorInputCategory = ref('')
let textDone = ref('')

//проверка если роут загружается из закладки или обновления страницы
if (currentCategory.value == null) {
  getModelAxios('categories', useRoute().params.id)
    .then((res) => {
      inputedCategory.value = currentCategory.value.title
      oldTitle = currentCategory.value.title
      fieldInputCategory.value.focus()
    })
}
else {
  inputedCategory.value = currentCategory.value.title
  oldTitle = currentCategory.value.title
}

onMounted(() => { fieldInputCategory.value.focus() })

function updateCategoryVue(data) {
  textErrorInputCategory.value = ''
  textDone.value = ''

  data.oldTitle = oldTitle
  updateModelAxios('categories', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      oldTitle = data.title
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCategory.value = err.response.data.message
      }
    })
}
</script>

<template>
  <h2>Редактирование категории</h2>
  <form v-show="currentCategory" class="admin-forms">
    <label class="required">Название категории</label>
    <input ref="fieldInputCategory" v-model="inputedCategory" placeholder="Введите название категории"
      @click.prevent="textErrorInputCategory = ''; textDone = ''" type="text">
    <div class="invalid-text">{{ textErrorInputCategory }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
      @click.prevent="updateCategoryVue({ id: currentCategory.id, title: inputedCategory })">Редактировать</button>
  </form>
  <div v-show="currentCategory == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

