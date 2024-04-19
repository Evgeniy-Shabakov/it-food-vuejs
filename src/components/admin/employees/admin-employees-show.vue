<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentEmployee, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentEmployee.value == null) {
  getModelAxios('employees', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openEmployeeEdit() {
  router.push({ name: 'admin.employees.edit', params: { id: currentEmployee.value.id } })
}

function deleteEmployee() {
  deleteModelAxios('employees', currentEmployee.value)
    .then((res) => {
      router.push({ name: 'admin.employees.index' })
    })
    .catch((err) => { }) //пустые обработчики, чтобы не было ошибок не пойманных промисов
}

</script>

<template>
  <h2>Данные сотрудника</h2>
  <div v-if="currentEmployee" class="admin-view-model">
    <div>
      <label>ФИО: </label>
      <span>{{ currentEmployee.last_name }} {{ currentEmployee.first_name }} {{ currentEmployee.surname }}</span>
    </div>
    <div>
      <label>Телефон: </label>
      <span>{{ currentEmployee.user.phone }}</span>
    </div>
    <div>
      <label>Разрешения: </label>
      <span v-for="role in currentEmployee.roles">{{ role.title + ' ' }}</span>
    </div>
    <div>
      <button class="btn btn-edit" @click.prevent="openEmployeeEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteEmployee" type="button">
        Удалить
      </button>
    </div>
  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

