<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import {
  roles, currentEmployee, textLoadOrFailForVue,
  getModelAxios, getModelsAxios, updateModelAxios
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

function initializeEmployee() {
  inputedFirstName.value = currentEmployee.value.first_name
  inputedLastName.value = currentEmployee.value.last_name
  inputedSurname.value = currentEmployee.value.surname
  inputedPhone.value = currentEmployee.value.user_phone
  inputedJob.value = currentEmployee.value.job
  selectedRoles.value = currentEmployee.value.roles.map(item => item.id)
}

//проверка если роут загружается из закладки или обновления страницы
if (currentEmployee.value == null || roles.value == null) {
  getModelAxios('employees', useRoute().params.id)
    .then(res => {
      initializeEmployee()
      fieldInputFirstName.value.focus()
    })
  getModelsAxios('roles')
    .then(res => {
      fieldInputFirstName.value.focus()
    })
}
else {
  initializeEmployee()
}

onMounted(() => { fieldInputFirstName.value.focus() })

function updateEmployee(data) {
  textErrorInputFirstName.value = ''
  textErrorInputLastName.value = ''
  textErrorInputSurname.value = ''
  textErrorInputPhone.value = ''
  textErrorInputJob.value = ''
  textErrorSelectedRoles.value = ''

  textDone.value = ''

  updateModelAxios('employees', data)
    .then(res => {
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
  <h2>Редактирование сотрудника</h2>

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

    <button class="btn btn-view create-form__btn" @click.prevent="updateEmployee({
      id: currentEmployee.id,
      first_name: inputedFirstName,
      last_name: inputedLastName,
      surname: inputedSurname,
      phone: inputedPhone,
      job: inputedJob,
      role_ids: selectedRoles,
    })">Редактировать</button>

    <span class=" create-form__text-done done-text">{{ textDone }}</span>
  </form>

  <div v-show="roles == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
