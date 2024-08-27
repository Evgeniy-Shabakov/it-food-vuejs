<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import IMask from 'imask'
import { useRoute } from 'vue-router'

import { company, textLoadOrFailForVue, getModelAxios, updateModelAxios } from '/src/store/axios-helper.js'
import { setBrowserTitleForAdminPanel } from '/src/store/vue-use-helper'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'


const companyInputedData = reactive({})

function initializeCompany() {
  companyInputedData.title = company.value.title
  companyInputedData.brand_title = company.value.brand_title
  companyInputedData.tagline = company.value.tagline
  companyInputedData.favicon_url = company.value.favicon_url
  companyInputedData.logo_url = company.value.logo_url
  companyInputedData.phone = company.value.phone
  companyInputedData.open_time = company.value.open_time
  companyInputedData.close_time = company.value.close_time
  companyInputedData.about_us = company.value.about_us
  companyInputedData.contacts = company.value.contacts
}

let selectedFaviconFile = ref()
let selectedLogoFile = ref()

const serverValidationErrors = ref({})

const textDone = ref(null)

//проверка если роут загружается из закладки или обновления страницы
if (company.value == null) {
  getModelAxios('companies', useRoute().params.id)
    .then(res => initializeCompany())
}
else {
  initializeCompany()
}

function updateCompany() {
  const formData = new FormData();

  formData.append("id", company.value.id);
  formData.append("title", companyInputedData.title);
  formData.append("brand_title", companyInputedData.brand_title);
  formData.append("tagline", companyInputedData.tagline);
  if (selectedFaviconFile.value) formData.append("favicon_file", selectedFaviconFile.value);
  if (selectedLogoFile.value) formData.append("logo_file", selectedLogoFile.value);
  formData.append("phone", preparePhoneNumberForServer());
  formData.append("open_time", companyInputedData.open_time || '');
  formData.append("close_time", companyInputedData.close_time || '');
  formData.append("about_us", companyInputedData.about_us);
  formData.append("contacts", companyInputedData.contacts);

  textDone.value = null

  updateModelAxios('companies', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
      setBrowserTitleForAdminPanel()
    })
    .catch(err => {
      console.log(err);

      serverValidationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(serverValidationErrors.value)
    })
}

function faviconDisplayChange(e) {
  const file = e.target.files[0];
  companyInputedData.favicon_url = URL.createObjectURL(file);
  selectedFaviconFile.value = e.target.files[0];
}

function changeFaviconBtn() {
  document.getElementById('faviconInput').click()
}

function logoDisplayChange(e) {
  const file = e.target.files[0];
  companyInputedData.logo_url = URL.createObjectURL(file);
  selectedLogoFile.value = e.target.files[0];
}

function changeLogoBtn() {
  document.getElementById('logoInput').click()
}

const fieldInputPhone = ref()

onMounted(() => {
  const maskOptions = {
    mask: '+7 (000) 000-00-00'
  };
  const mask = IMask(fieldInputPhone.value, maskOptions);
})

function preparePhoneNumberForServer() {
  if (companyInputedData.phone == null) return ''

  let phone = companyInputedData.phone

  phone = phone.slice(2)
  phone = phone.replace(/[^+\d]/g, '')

  if (phone) return '+7' + phone

  companyInputedData.phone = null //чтобы не отображалось +7 после сохранение пустого номера из-за маски
  return ''
}

</script>

<template>

  <h2>Редактирование данных компании</h2>

  <form v-show="company" class="admin-forms">

    <label class="required">Наименование</label>
    <input type="text" v-model="companyInputedData.title" placeholder="Введите название ресторана"
      @click.prevent="serverValidationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.title }}</div>

    <label class="required">Брэнд</label>
    <input v-model="companyInputedData.brand_title" placeholder="Введите название брэнда"
      @click.prevent="serverValidationErrors.brand_title = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.brand_title }}</div>

    <label>Слоган</label>
    <input v-model="companyInputedData.tagline" placeholder="Введите слоган компании"
      @click.prevent="serverValidationErrors.tagline = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.tagline }}</div>

    <label>Иконка для вкладки браузера (.png 96*96px)</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__favicon" :src="companyInputedData.favicon_url" alt="">
      <input type="file" @click="serverValidationErrors.favicon_file = ''; textDone = ''" @change="faviconDisplayChange"
        style="display:none;" id="faviconInput" accept="image/png">
      <button id="admin-forms__div-img-btn__btn" class="btn btn-view" @click.prevent="changeFaviconBtn">
        Изменить
      </button>
    </div>
    <div class="invalid-text">{{ serverValidationErrors.favicon_file }}</div>

    <label>Логотип (будет отображаться на главной странице сайта)</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__logo" :src="companyInputedData.logo_url" alt="">
      <input type="file" @click="serverValidationErrors.logo_file = ''; textDone = ''" @change="logoDisplayChange"
        style="display:none;" id="logoInput" accept="image/*">
      <button id="admin-forms__div-img-btn__btn" class="btn btn-view" @click.prevent="changeLogoBtn">
        Изменить
      </button>
    </div>
    <div class="invalid-text">{{ serverValidationErrors.logo_file }}</div>

    <label>Телефон для заказа еды <br>(удалите телефон, если принимаете заказы только через сайт и приложение)</label>
    <input ref="fieldInputPhone" v-model="companyInputedData.phone" placeholder="Введите номер телефона"
      @click.prevent="serverValidationErrors.phone = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.phone }}</div>

    <label>Время начала рабочего дня <br>(удалите время, если работаете круглосуточно)</label>
    <input type="time" v-model="companyInputedData.open_time"
      @click.prevent="serverValidationErrors.open_time = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.open_time }}</div>

    <label>Время конца рабочего дня <br>(удалите время, если работаете круглосуточно)</label>
    <input type="time" v-model="companyInputedData.close_time"
      @click.prevent="serverValidationErrors.close_time = ''; textDone = ''">
    <div class="invalid-text">{{ serverValidationErrors.close_time }}</div>

    <label>Инормация для страницы "О нас"</label>
    <textarea v-model="companyInputedData.about_us" placeholder="Введите информацию"
      @click.prevent="serverValidationErrors.about_us = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ serverValidationErrors.about_us }}</div>

    <label>Инормация для страницы "Контакты"</label>
    <textarea v-model="companyInputedData.contacts" placeholder="Введите данные о контактах"
      @click.prevent="serverValidationErrors.contacts = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ serverValidationErrors.contacts }}</div>

    <div class="done-text">{{ textDone }}</div>

    <button class="btn btn-view" @click.prevent="updateCompany()">
      Сохранить изменения
    </button>

  </form>

  <div v-show="company == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

</template>
