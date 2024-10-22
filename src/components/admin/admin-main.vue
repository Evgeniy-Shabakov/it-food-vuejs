<script setup>
import { onMounted, onUpdated } from "vue"
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import { logMessages } from '/src/store/log-messages.js'
import { MESSAGE_TYPE } from '/src/store/data-types/message-type.js'
import { setBrowserTitleForAdminPanel } from '/src/store/vue-use-helper'
import { authUser, getAuthUser, logout } from '/src/store/axios-helper.js'

setBrowserTitleForAdminPanel()

if (authUser.value == null) getAuthUser()

function setColor(type) {
  if (type == MESSAGE_TYPE.warning) return "bg-color-warning"
  else if (type == MESSAGE_TYPE.error) return "bg-color-error"
  else return "bg-color-done"
}

let navMenu
let links

onMounted(() => {
  navMenu = document.getElementById('nav-menu');
  links = navMenu.getElementsByTagName('a');

  highlightLink()
})

onUpdated(() => {
  highlightLink()
})

function highlightLink() {
  for (let i = 0; i < links.length; i++) {
    if (window.location.href == links[i].href) {
      links[i].classList.add('active');
    }
    else if (window.location.href.includes(links[i].href) && i != 0 && i != links.length - 1) {
      links[i].classList.add('active');
    }
    else links[i].classList.remove('active');
  }
}

function logoutInAdminPanel() {
  logout().then(() => {
    router.push({ name: 'client.menu' })
  })
}

</script>

<template>
  <!-- Боковая панель -->
  <div id="nav-menu"
       class="left-side-menu">
    <div class="left-side-menu__current-user"
         v-if="authUser">
      <span>{{ authUser.phone }}</span>
      <button class="left-side-menu__current-user__btn"
              @click.prevent="logoutInAdminPanel()">Выйти</button>
    </div>

    <router-link to="/admin"
                 class="left-side-menu__link">Главная</router-link>
    <router-link to="/admin/employees"
                 class="left-side-menu__link">Сотрудники</router-link>
    <router-link to="/admin/companies/1/edit"
                 class="left-side-menu__link">Компания</router-link>
    <router-link to="/admin/countries"
                 class="left-side-menu__link">Страны</router-link>
    <router-link to="/admin/cities"
                 class="left-side-menu__link">Города</router-link>
    <router-link to="/admin/restaurants"
                 class="left-side-menu__link">Рестораны</router-link>
    <router-link to="/admin/categories"
                 class="left-side-menu__link">Категории</router-link>
    <router-link to="/admin/products"
                 class="left-side-menu__link">Товары</router-link>
    <router-link to="/admin/legal-documents"
                 class="left-side-menu__link">Правовые документы</router-link>
    <router-link to="/"
                 target="_blank"
                 class="left-side-menu__link">Сайт</router-link>
  </div>

  <!-- Page content -->
  <div class="pagecontent">

    <router-view></router-view>

    <div v-if="useRoute().name != 'admin.main'"
         class="btns-nav">
      <button @click.prevent="router.go(-1)">Назад</button>
      <button @click.prevent="router.push({ name: 'admin.main' })">На главную</button>
    </div>

  </div>

  <!-- Нижняя панель для логов -->
  <div class="logpanel">
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Сообщение</th>
          <th>Тип</th>
          <th>Пользователь</th>
          <th>Дата и время</th>
        </tr>
      </thead>
      <tbody>
        <tr :class="setColor(message.type)"
            v-for="message in logMessages">
          <td>{{ message.id }}</td>
          <td>{{ message.text }}</td>
          <td>{{ message.type }}</td>
          <td>{{ message.user }}</td>
          <td>{{ message.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Нижняя панель для логов -->
</template>

<style>
.btns-nav {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 20px;
  margin-left: 30px;
}

.btns-nav button {
  margin-right: 5px;
  padding: 5px;
}

.pagecontent {
  padding: 70px 30px;
  height: 80%;
  width: 80%;
  position: fixed;
  top: 0;
  right: 0;
  overflow-x: hidden;
}

.logpanel {
  border-top: solid;
  border-color: #818181;
  height: 20%;
  width: 80%;
  position: fixed;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  font-size: 14px;
}

.logpanel table {
  width: 100%;
  border-spacing: 0px
}

.logpanel thead th:nth-child(1) {
  width: 2%;
}

.logpanel thead th:nth-child(2) {
  width: 60%;
}

.logpanel thead th:nth-child(3) {
  width: 10%;
}

.logpanel thead th:nth-child(4) {
  width: 10%;
}

.logpanel thead th:nth-child(5) {
  width: 18%;
}

.logpanel th {
  padding: 2px 5px;
  background-color: white;
}

.logpanel td {
  padding: 2px 5px;
  border-top: 1px solid black;
}

.logpanel td:nth-child(1) {
  text-align: center;
}

.logpanel td:nth-child(3) {
  text-align: center;
}

.logpanel td:nth-child(4) {
  text-align: center;
}

.logpanel td:nth-child(5) {
  text-align: center;
}
</style>
