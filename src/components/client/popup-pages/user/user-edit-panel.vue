<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

import router from "/src/router.js"
import { authUser } from '/src/store/axios-helper.js'

const fieldInputName = ref(null)

const inputedName = ref()

const validationErrors = ref({
  name: '',
})

let unwatchFn = watch(fieldInputName, () => {
  fieldInputName.value.focus()
  unwatchFn() // отключаем watch после установки фокуса

  if (authUser.value && authUser.value.name) inputedName.value = authUser.value.name
  else inputedName.value = 'Гость'
})

const actionAllowed = ref(true)

async function save() {
  if (actionAllowed.value == false) return

  actionAllowed.value = false

  await axios
    .patch(`/users/${authUser.value.id}/`, { name: inputedName.value})
    .then(res => {
      authUser.value = res.data.data
      router.push({ name: 'client.menu.popup.user-panel' })
    })
    .catch(err => {
      console.log(err);

      let errors = err.response.data.errors

      validationErrors.value = {
        name: errors.name ? errors.name[0] : '',
      }

    })

  actionAllowed.value = true
}

</script>

<template>

  <div class="client-popup-page-layout__main-section">

    <h1 class="client-popup-page-layout__h1">Редактирование профиля</h1>


    <div v-if="authUser" class="user-edit-panel">

      <div>
        <label class="address-create__label field-required">Имя</label>
        <input ref="fieldInputName" type="text" v-model="inputedName" class="address-create__input address-create__street"
          @click.prevent="validationErrors.name = ''">
        <div class="invalid-validation-text">{{ validationErrors.name }}</div>
      </div>

      <div v-if="actionAllowed == false" class="spinner-centr-display">
        <div class="spinner"></div>
      </div>

    </div>

    <div v-else class="spinner-centr-display">
      <div class="spinner"></div>
    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">
    <button @click=save() class="btn btn-submit user-edit-panel__btn-save">
      Сохранить
    </button>
  </div>

</template>
