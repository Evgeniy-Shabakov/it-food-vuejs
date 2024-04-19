<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import {
  roles, textLoadOrFailForVue,
  getModelsAxios, storeModelAxios
} from '/src/store/axios-helper.js'

const fieldInputFirstName = ref(null)

const inputedFirstName = ref('')
const inputedLastName = ref('')
const inputedSurname = ref('')
const inputedPhone = ref('')
const inputedJob = ref('')
const selectedRoles = ref([])


const textErrorInputFirstName = ref('')
const textErrorInputLastName = ref('')
const textErrorInputSurname = ref('')
const textErrorInputPhone = ref('')
const textErrorInputJob = ref('')
const textErrorSelectedRoles = ref('')

const textDone = ref('')

getModelsAxios('roles')
  
onMounted(() => { fieldInputFirstName.value.focus() })

function storeEmployee(data) {

  textErrorInputFirstName.value = ''
  textErrorInputLastName.value = ''
  textErrorInputSurname.value = ''
  textErrorInputPhone.value = ''
  textErrorInputJob.value = ''
  textErrorSelectedRoles.value = ''

  textDone.value = ''

  storeModelAxios('employees', data)
    .then(res => {
      inputedFirstName.value = ''
      inputedLastName.value = ''
      inputedSurname.value = ''
      inputedPhone.value = ''
      inputedJob.value = ''
      selectedRoles.value = []

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
      if (err.response.data.errors.role_ids) {
        textErrorSelectedRoles.value = err.response.data.errors.role_ids[0]
      }
    })
}
</script>

<template>
  <h2>Добавление сотрудника</h2>

  <form v-show="roles" class="create-form">

    <div>
      <label class="create-form__label create-form__required">Имя</label>
      <input class="create-form__input" ref="fieldInputFirstName" type="text" v-model="inputedFirstName"
        placeholder="Введите имя" @click.prevent="textErrorInputFirstName = ''; textDone = ''">
      <span class="invalid-text">{{ textErrorInputFirstName }}</span>
    </div>

    <div>
      <label class="create-form__label create-form__required">Фамилия</label>
      <input class="create-form__input" type="text" v-model="inputedLastName" placeholder="Введите фамилию"
        @click.prevent="textErrorInputLastName = ''; textDone = ''">
      <span class="invalid-text">{{ textErrorInputLastName }}</span>
    </div>

    <div>
      <label class="create-form__label">Отчество</label>
      <input class="create-form__input" type="text" v-model="inputedSurname" placeholder="Введите отчество"
        @click.prevent="textErrorInputSurname = ''; textDone = ''">
      <span class="invalid-text">{{ textErrorInputSurname }}</span>
    </div>

    <div>
      <label class="create-form__label create-form__required">Телефон</label>
      <input class="create-form__input" type="text" v-model="inputedPhone" placeholder="Введите телефон"
        @click.prevent="textErrorInputPhone = ''; textDone = ''">
      <span class="invalid-text">{{ textErrorInputPhone }}</span>
    </div>

    <div>
      <label class="create-form__label">Должность</label>
      <input class="create-form__input" type="text" v-model="inputedJob" placeholder="Введите должность"
        @click.prevent="textErrorInputJob = ''; textDone = ''">
      <span class="invalid-text">{{ textErrorInputJob }}</span>
    </div>

    <label class="create-form__label create-form__required">Разрешения:</label>
    <span class="invalid-text">{{ textErrorSelectedRoles }}</span>
    <div class="create-form-employee__checkbox" v-for="role in roles">
      <input v-model="selectedRoles" :value="role.id" class="create-form-employee__checkbox_input" type="checkbox"
        @click="textErrorInputPickupAvailable = ''; textDone = ''">
      <span class="create-form-employee__checkbox_title"> {{ role.title }}</span>
      <span class="create-form-employee__checkbox_description"> {{ role.description }}</span>
    </div>

    <button class="btn btn-view create-form__btn" @click.prevent="storeEmployee({
      first_name: inputedFirstName,
      last_name: inputedLastName,
      surname: inputedSurname,
      phone: inputedPhone,
      job: inputedJob,
      role_ids: selectedRoles,
    })">Добавить</button>

    <span class=" create-form__text-done done-text">{{ textDone }}</span>
  </form>

  <div v-show="roles == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
