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
          Доступен самовывоз:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.pick_up_available)" class="fa-solid fa-bag-shopping"></i>
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
          Доступна выдача в ресторане у прилавка:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.pick_up_available_at_the_restaurant_counter)" class="fa-solid fa-chalkboard-user"></i>
        </td>
      </tr>
      <tr>
        <td>
          Доступна подача в ресторане к столу:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.delivery_available_at_the_restaurant_to_the_table)" class="fa-solid fa-solar-panel"></i>
        </td>
      </tr>
      <tr>
        <td>
          Доступна выдача в окне для автомобилей:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.pick_up_available_at_the_car_window)" class="fa-solid fa-car"></i>
        </td>
      </tr>
      <tr>
        <td>
          Доступна подача на парковку к машине:
        </td>
        <td>
          <i :class="setColor(currentRestaurant.delivery_available_in_the_parking_to_car)" class="fa-solid fa-square-parking"></i>
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
  <div v-else class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

