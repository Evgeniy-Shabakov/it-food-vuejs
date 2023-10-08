<script setup>
import router from "/src/router.js"
import { useRoute } from 'vue-router'
import {
  currentRestaurant, textLoadOrFailForVue,
  getModelAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

//проверка если роут загружается из закладки или обновления страницы
if (currentRestaurant.value == null) {
  getModelAxios('restaurants', useRoute().params.id)
    .then((res) => { })
    .catch((err) => { })
}

function openRestaurantEdit() {
  router.push({ name: 'admin.restaurants.edit', params: { id: currentRestaurant.id } })
}

function deleteRestaurant() {
  deleteModelAxios('restaurants', currentRestaurant.value)
    .then((res) => { router.push({ name: 'admin.restaurants.index' }) })
    .catch((err) => { })
}

function setColor(param) {
  if (param) return 'color-done'
  else return 'color-error'
}
</script>

<template>
  <h2>Данные ресторана</h2>
  <div v-if="currentRestaurant" class="admin-view-model">
    <table>
      <tr>
        <td>
          Наименование:
        </td>
        <td>
          <span>{{ currentRestaurant.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Страна:
        </td>
        <td>
          <span>{{ currentRestaurant.city.country.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Город:
        </td>
        <td>
          <span>{{ currentRestaurant.city.title }}</span>
        </td>
      </tr>
      <tr>
        <td>
          Адрес:
        </td>
        <td>
          ул. <span>{{ currentRestaurant.street }}</span>
          дом <span>{{ currentRestaurant.house_number }}</span>
          <template v-if="currentRestaurant.corps_number"> корпус
            <span>{{ currentRestaurant.corps_number }}</span>
          </template>
          <template v-if="currentRestaurant.office_number"> кв./офис
            <span>{{ currentRestaurant.office_number }}</span>
          </template>
        </td>
      </tr>
      <tr>
        <td>
          Доcтупен самовывоз:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.pickup_available)" class="fa-solid fa-bag-shopping"></i>
        </td>
      </tr>
      <tr>
        <td>
          Доступна доставка:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.delivery_available)" class="fa-solid fa-car-side"></i>
        </td>
      </tr>
      <tr>
        <td>
          Доступна подача в ресторане:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.eating_area_available)" class="fa-solid fa-utensils"></i>
        </td>
      </tr>
      <tr>
        <td>
          Активен прием заказов:
        </td>
        <td>
          <span class="color-done" v-if="currentRestaurant.is_active">Активен</span>
          <span class="color-error" v-else>Не активен</span>
        </td>
      </tr>
      <tr>
        <td>
          Дополнительная информация:
        </td>
        <td>
          {{ currentRestaurant.info }}
        </td>
      </tr>
    </table>
    <div>
      <button class="btn btn-edit" @click.prevent="openRestaurantEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteRestaurant" type="button">
        Удалить
      </button>
    </div>
  </div>
  <!-- <div v-if="currentRestaurant" class="admin-view-model">
    <div>
      <label>Наименование: </label>
      <span>{{ currentRestaurant.title }}</span>
    </div>
    <div>
      <label>Страна: </label>
      <span>{{ currentRestaurant.city.country.title }}</span>
    </div>
    <div>
      <label>Город: </label>
      <span>{{ currentRestaurant.city.title }}</span>
    </div>
    <div>
      <label>Адрес: </label>
      <span> ул. {{ currentRestaurant.street }} дом {{ currentRestaurant.house_number }}
        <span v-if="currentRestaurant.corps_number"> корпус {{ currentRestaurant.corps_number }} </span>
        <span v-if="currentRestaurant.office_number"> кв./офис {{ currentRestaurant.office_number }} </span>
      </span>
    </div>
    <div>
      <label>Дополнительная информация: </label>
      <span>{{ currentRestaurant.info }}</span>
    </div>
    <div>
      <label>Доcтупен самовывоз: </label>
      <i :class="setColor(currentRestaurant.pickup_available)" class="fa-solid fa-bag-shopping"></i>
    </div>
    <div>
      <label>Доcтупна доставка: </label>
      <i :class="setColor(currentRestaurant.delivery_available)" class="fa-solid fa-car-side"></i>
    </div>
    <div>
      <label>Доcтупна подача в ресторане: </label>
      <i :class="setColor(currentRestaurant.eating_area_available)" class="fa-solid fa-utensils"></i>
    </div>
    <div>
      <label>Активен прием заказов: </label>
      <span class="color-done" v-if="currentRestaurant.is_active">Активен</span>
      <span class="color-error" v-else>Не активен</span>
    </div>
    
  </div> -->
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

