<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import {
  currentCountry, textLoadOrFailForVue,
  updateModelAxios, getModelAxios
} from '/src/store/axios-helper.js'

const fieldInputCountry = ref(null)

const inputedCountry = ref('')
let oldTitle = ''

let textErrorInputCountry = ref('')
let textDone = ref('')

//проверка если роут загружается из закладки или обновления страницы
if (currentCountry.value == null) {
  getModelAxios('countries', useRoute().params.id)
    .then((res) => {
      inputedCountry.value = currentCountry.value.title
      oldTitle = currentCountry.value.title
      fieldInputCountry.value.focus()
    })
}
else {
  inputedCountry.value = currentCountry.value.title
  oldTitle = currentCountry.value.title
}

onMounted(() => { fieldInputCountry.value.focus() })

function updateCountryVue(data) {
  textErrorInputCountry.value = ''
  textDone.value = ''

  data.oldTitle = oldTitle
  updateModelAxios('countries', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      oldTitle = data.title
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCountry.value = err.response.data.message
      }
    })
}
</script>

<template>
  <h2>Редактирование страны</h2>
  <form v-show="currentCountry" class="admin-forms">
    <label class="required">Страна</label>
    <input ref="fieldInputCountry" v-model="inputedCountry" placeholder="Введите название страны"
      @click.prevent="textErrorInputCountry = ''; textDone = ''" type="text">
    <div class="invalid-text">{{ textErrorInputCountry }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
      @click.prevent="updateCountryVue({ id: currentCountry.id, title: inputedCountry })">Редактировать</button>
  </form>
  <div v-show="currentCountry == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

