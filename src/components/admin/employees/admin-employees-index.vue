<script setup>
import router from "/src/router.js"
import {
  employees, currentEmployee, textLoadOrFailForVue,
  getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('employees')

function openEmployeShow(employee) {
  currentEmployee.value = employee
  router.push({ name: 'admin.employees.show', params: { id: employee.id } })
}

function openEmployeEdit(employee) {
  currentEmployee.value = employee
  router.push({ name: 'admin.employees.edit', params: { id: employee.id } })
}

function deleteEmploye(employee) {
  deleteModelAxios('employees', employee)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
    .then((res) => { getModelsAxios('employees') })
    .catch((err) => { })
}

</script>

<template>
  <h2>Сотрудники</h2>

  <router-link :to="{ name: 'admin.employees.create' }">
    <button class="btn admin-index-btn-add">Добавить нового сотрудника</button>
  </router-link>

  <div v-if="employees">

    <div v-for="employee in employees" class="index-list-element">
      <span class="index-list-element__name index-list-employee__full-name">
        {{ employee.last_name }} {{ employee.first_name }} {{ employee.surname }}
      </span>
      <span class="index-list-employee__phone">{{ employee.user_phone }}</span>
      <div class="index-list-employee__roles">
        <span class="index-list-employee__roles_element" v-for="role in employee.roles">
          {{ role.title }}
        </span>
      </div>
      <button class="btn btn-view" @click.prevent="openEmployeShow(employee)" type="button">Просмотреть</button>
      <button class="btn btn-edit" @click.prevent="openEmployeEdit(employee)" type="button">Редактировать</button>
      <button class="btn btn-delete" @click.prevent="deleteEmploye(employee)" type="button">Удалить</button>
    </div>

  </div>
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>
