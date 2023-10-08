<script setup>
import { ref, onMounted } from 'vue';
import { storeModelAxios } from '/src/store/axios-helper.js'

const fieldInputCountry = ref(null)

const inputedCountry = ref('')

let textErrorInputCountry = ref('')
let textDone = ref('')

onMounted(() => { fieldInputCountry.value.focus() })

function storeCountryVue(data) {
  textErrorInputCountry.value = ''
  textDone.value = ''

  storeModelAxios('countries', data)
    .then(res => {
      textDone.value = res.messageForVue.text
      inputedCountry.value = ''
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputCountry.value = err.response.data.message
      }
    })
}
</script>

<template>
  <h2>Добавление страны</h2>
  <form class="admin-forms">
    <label class="required">Страна</label>
    <input ref="fieldInputCountry" v-model="inputedCountry" placeholder="Введите название страны"
      @click.prevent="textErrorInputCountry = ''; textDone = ''" type="text">
    <div class="invalid-text">{{ textErrorInputCountry }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="storeCountryVue({ title: inputedCountry })">Добавить</button>
  </form>
</template>

