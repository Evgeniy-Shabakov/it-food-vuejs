<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import router from "/src/router.js"
import { currentRestaurant, deleteModelAxios } from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { loadCurrentRestaurant, loadCountries } from '/src/store/loading-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

onMounted(async () => {
  dataForComponentLoadingType.value = await loadCurrentRestaurant()
})

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
  <div v-if="dataForComponentLoadingType === LOADING_TYPE.complete" class="admin-view-model">

    <div class="admin-restaurant-show__data">
      <div>Наименование:</div>
      <div>{{ currentRestaurant.title }}</div>

      <div>Страна:</div>
      <div>{{ currentRestaurant.city.country.title }}</div>

      <div>Город:</div>
      <div>{{ currentRestaurant.city.title }}</div>

      <div>Адрес:</div>
      <div>
        ул. <span>{{ currentRestaurant.street }}</span>
        дом <span>{{ currentRestaurant.house_number }}</span>
        <template v-if="currentRestaurant.corps_number"> корпус
          <span>{{ currentRestaurant.corps_number }}</span>
        </template>
        <template v-if="currentRestaurant.office_number"> кв./офис
          <span>{{ currentRestaurant.office_number }}</span>
        </template>
      </div>

      <div>Доступна доставка:</div>
      <div>
        <i :class="setColor(currentRestaurant.delivery_available)" class="fa-solid fa-car-side"></i>
      </div>

      <div>Доступен самовывоз (выдача у прилавка):</div>
      <div>
        <i :class="setColor(currentRestaurant.pick_up_at_counter_available)" class="fa-solid fa-bag-shopping"></i>
      </div>

      <div>Доступен самовывоз (выдача в окне для авто):</div>
      <div>
        <i :class="setColor(currentRestaurant.pick_up_at_car_window_available)"
          class="fa-solid fa-chalkboard-user"></i>
      </div>

      <div>Доступна подача в ресторане (выдача у прилавка):</div>
      <div>
        <i :class="setColor(currentRestaurant.at_restaurant_at_counter_available)"
          class="fa-solid fa-solar-panel"></i>
      </div>

      <div>Доступна подача в ресторане (к столику):</div>
      <div>
        <i :class="setColor(currentRestaurant.at_restaurant_to_table_available)" class="fa-solid fa-car"></i>
      </div>

      <div>Доступна доставка на парковку у ресторана (к машине):</div>
      <div><i :class="setColor(currentRestaurant.at_restaurant_to_parking_available)"
          class="fa-solid fa-square-parking"></i>
      </div>

      <div>Активен прием заказов:</div>
      <div>
        <span class="color-done" v-if="currentRestaurant.is_active">Активен</span>
        <span class="color-error" v-else>Не активен</span>
      </div>

      <div>Дополнительная информация:</div>
      <div>{{ currentRestaurant.info }}</div>

    </div>

    <div>
      <button class="btn btn-edit" @click.prevent="openRestaurantEdit" type="button">
        Редактировать
      </button>
      <button class="btn btn-delete" @click.prevent="deleteRestaurant" type="button">
        Удалить
      </button>
    </div>

  </div>

  <div v-else-if="dataForComponentLoadingType === LOADING_TYPE.loading" class="admin-view-model-load">
    Загрузка данных...
  </div>

  <div v-else class="admin-view-model-load">
    Ошибка загрузка данных. Попробуйте обновить страницу
  </div>

</template>
