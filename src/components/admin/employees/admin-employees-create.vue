<script setup>
import { ref, onMounted } from 'vue';
import router from "/src/router"
import {
  textLoadOrFailForVue,
  getModelsAxios, storeModelAxios
} from '/src/store/axios-helper.js'

const fieldInputFirstName = ref(null)

const inputedFirstName = ref('')
const inputedLastName = ref('')
const inputedSurname = ref('')
const inputedPhone = ref('')
const inputedJob = ref('')

const textErrorInputFirstName = ref('')
const textErrorInputLastName = ref('')
const textErrorInputSurname = ref('')
const textErrorInputPhone = ref('')
const textErrorInputJob = ref('')

const textDone = ref('')

const roles = ref()

getModelsAxios('roles')
  .then(res => {
    roles.value = res.data.data
    console.log(res);
  })

onMounted(() => { fieldInputFirstName.value.focus() })

function storeEmployee(data) {
  textErrorInputFirstName = ref('')
  textErrorInputLastName = ref('')
  textErrorInputSurname = ref('')
  textErrorInputPhone = ref('')
  textErrorInputJob = ref('')

  textDone.value = ''

  storeModelAxios('employees', data)
    .then(res => {
      inputedFirstName.value = ''
      inputedLastName.value = ''
      inputedSurname.value = ''
      inputedPhone.value = ''
      inputedJob.value = ''

      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      if (err.response.data.errors.first_name) {
        textErrorInputFirstName.value = err.response.data.errors.first_name[0]
      }
      if (err.response.data.errors.last_name) {
        textErrorInputLastName.value = err.response.data.errors.last_name[0]
      }
      if (err.response.data.errors.surname) {
        textErrorInputSurname.value = err.response.data.errors.surname[0]
      }
      if (err.response.data.errors.phone) {
        textErrorInputPhone.value = err.response.data.errors.phone[0]
      }
      if (err.response.data.errors.job) {
        textErrorInputJob.value = err.response.data.errors.job[0]
      }

    })
}
</script>

<template>
  <h2>Добавление сотрудника</h2>

  <form v-show="roles" class="create-form">

    <label class="create-form__label create-form__required">Имя</label>
    <input class="create-form__input" ref="fieldInputFirstName" type="text" v-model="inputedFirstName"
      placeholder="Введите имя" @click.prevent="textErrorInputFirstName = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputFirstName }}</div>

    <label class="create-form__label create-form__required">Фамилия</label>
    <input class="create-form__input" type="text" v-model="inputedLastName" placeholder="Введите фамилию"
      @click.prevent="textErrorInputLastName = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputLastName }}</div>

    <label class="create-form__label">Отчество</label>
    <input class="create-form__input" type="text" v-model="inputedSurname" placeholder="Введите отчество"
      @click.prevent="textErrorInputSurname = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputSurname }}</div>

    <label class="create-form__label create-form__required">Телефон</label>
    <input class="create-form__input" type="text" v-model="inputedPhone" placeholder="Введите телефон"
      @click.prevent="textErrorInputPhone = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputPhone }}</div>

    <label class="create-form__label">Должность</label>
    <input class="create-form__input" type="text" v-model="inputedJob" placeholder="Введите должность"
      @click.prevent="textErrorInputJob = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputJob }}</div>

    <label class="create-form__label">Разрешения</label>
    <template v-for="role in roles">
      <input type="checkbox" v-model="inputedPickupAvailable"
        @click="textErrorInputPickupAvailable = ''; textDone = ''">
        <span> {{ role.title }}</span>
    </template>

    <div class="done-text">{{ textDone }}</div>

    <button class="btn btn-view create-form__btn" @click.prevent="storeEmployee({
      first_name: inputedTitle,
      last_name: selectedCity.id,
      surname: inputedStreet,
      phone: inputedHouseNumber,
      job: inputedCorpsNumber,
    })">Добавить</button>
  </form>

  <div v-show="roles == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
