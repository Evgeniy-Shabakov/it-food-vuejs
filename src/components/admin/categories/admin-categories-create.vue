<script setup>
import { ref, onMounted } from 'vue';
import { storeModelAxios } from '/src/store/axios-helper.js'

const fieldInputCategory = ref(null)

const inputedCategory = ref('')

let textErrorInputCategory = ref('')
let textDone = ref('')

onMounted(() => { fieldInputCategory.value.focus() })

function storeCategoryVue(data) {
  textErrorInputCategory.value = ''
  textDone.value = ''

  storeModelAxios('categories', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      inputedCategory.value = ''
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCategory.value = err.response.data.message
      }
    })
}
</script>

<template>
  <h2>Добавление категории</h2>
  <form class="admin-forms">
    <label class="required">Название категории</label>
    <input ref="fieldInputCategory" v-model="inputedCategory" placeholder="Введите название категории"
      @click.prevent="textErrorInputCategory = ''; textDone = ''" type="text">
    <div class="invalid-text">{{ textErrorInputCategory }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="storeCategoryVue({ title: inputedCategory })">Добавить</button>
  </form>
</template>

