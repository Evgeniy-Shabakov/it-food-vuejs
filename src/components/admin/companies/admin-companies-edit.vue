<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { company, textLoadOrFailForVue, getModelAxios, updateModelAxios } from '/src/store/axios-helper.js'
import { setBrowserTitleForAdminPanel } from '/src/store/vue-use-helper'

const inputedTitle = ref('')
const inputedBrandTitle = ref()
const inputedTagline = ref()
const selectedFaviconUrl = ref()
const selectedLogoUrl = ref()
const inputedAboutUs = ref()
const inputedContants = ref()

let selectedFaviconFile = ref()
let selectedLogoFile = ref()

const textErrorInputTitle = ref('')
const textErrorInputBrandTitle = ref('')
const textErrorInputTagline = ref('')
const textErrorSelectFavicon = ref()
const textErrorSelectLogo = ref()
const textErrorAboutUs = ref('')
const textErrorInputContants = ref('')

const textDone = ref('')

function initializeCompany() {
  inputedTitle.value = company.value.title
  inputedBrandTitle.value = company.value.brand_title
  inputedTagline.value = company.value.tagline
  selectedFaviconUrl.value = company.value.favicon_url
  selectedLogoUrl.value = company.value.logo_url
  inputedAboutUs.value = company.value.about_us
  inputedContants.value = company.value.contacts
}

//проверка если роут загружается из закладки или обновления страницы
if (company.value == null) {
  getModelAxios('companies', useRoute().params.id)
    .then(res => initializeCompany())
}
else {
  initializeCompany()
}

function updateCompany(data) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("title", data.title);
  formData.append("brand_title", data.brand_title);
  formData.append("tagline", data.tagline);
  if (data.favicon_file) formData.append("favicon_file", data.favicon_file);
  if (data.logo_file) formData.append("logo_file", data.logo_file);
  formData.append("about_us", data.about_us);
  formData.append("contacts", data.contacts);

  textErrorInputTitle.value = ''
  textErrorInputBrandTitle.value = ''
  textErrorInputTagline.value = ''
  textErrorSelectFavicon.value = ''
  textErrorSelectLogo.value = ''
  textErrorAboutUs.value = ''
  textErrorInputContants.value = ''

  textDone.value = ''

  updateModelAxios('companies', formData)
    .then(res => {
      textDone.value = res.messageForVue.text
      setBrowserTitleForAdminPanel()
    })
    .catch(err => {
      if (err.response.data.errors.title) {
        textErrorInputTitle.value = err.response.data.errors.title[0]
      }
      if (err.response.data.errors.brand_title) {
        textErrorInputBrandTitle.value = err.response.data.errors.brand_title[0]
      }
      if (err.response.data.errors.tagline) {
        textErrorInputTagline.value = err.response.data.errors.tagline[0]
      }
      if (err.response.data.errors.favicon_file) {
        textErrorSelectFavicon.value = err.response.data.errors.favicon_file[0]
      }
      if (err.response.data.errors.logo_file) {
        textErrorSelectLogo.value = err.response.data.errors.logo_file[0]
      }
      if (err.response.data.errors.about_us) {
        textErrorAboutUs.value = err.response.data.errors.about_us[0]
      }
      if (err.response.data.errors.contacts) {
        textErrorInputContants.value = err.response.data.errors.contacts[0]
      }
    })
}

function faviconDisplayChange(e) {
  const file = e.target.files[0];
  selectedFaviconUrl.value = URL.createObjectURL(file);
  selectedFaviconFile.value = e.target.files[0];
}

function changeFaviconBtn() {
  document.getElementById('faviconInput').click()
}

function logoDisplayChange(e) {
  const file = e.target.files[0];
  selectedLogoUrl.value = URL.createObjectURL(file);
  selectedLogoFile.value = e.target.files[0];
}

function changeLogoBtn() {
  document.getElementById('logoInput').click()
}
</script>

<template>
  <h2>Редактирование данных компании</h2>
  <form v-show="company" class="admin-forms">
    <label class="required">Наименование</label>
    <input type="text" v-model="inputedTitle" placeholder="Введите название ресторана"
      @click.prevent="textErrorInputTitle = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputTitle }}</div>

    <label class="required">Брэнд</label>
    <input v-model="inputedBrandTitle" placeholder="Введите название брэнда"
      @click.prevent="textErrorInputBrandTitle = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputBrandTitle }}</div>

    <label>Слоган</label>
    <input v-model="inputedTagline" placeholder="Введите слоган компании"
      @click.prevent="textErrorInputTagline = ''; textDone = ''">
    <div class="invalid-text">{{ textErrorInputTagline }}</div>

    <label>Иконка для вкладки браузера (.png 96*96px)</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__favicon" :src="selectedFaviconUrl" alt="">
      <input type="file" @click="textErrorSelectFavicon = ''; textDone = ''" @change="faviconDisplayChange"
        style="display:none;" id="faviconInput" accept="image/png">
      <button id="admin-forms__div-img-btn__btn" class="btn btn-view" @click.prevent="changeFaviconBtn">Изменить</button>
    </div>
    <div class="invalid-text">{{ textErrorSelectFavicon }}</div>

    <label>Логотип (будет отображаться на главной странице сайта)</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__logo" :src="selectedLogoUrl" alt="">
      <input type="file" @click="textErrorSelectLogo = ''; textDone = ''" @change="logoDisplayChange"
        style="display:none;" id="logoInput" accept="image/*">
      <button id="admin-forms__div-img-btn__btn" class="btn btn-view" @click.prevent="changeLogoBtn">Изменить</button>
    </div>
    <div class="invalid-text">{{ textErrorSelectLogo }}</div>

    <label>Инормация для страницы "О нас"</label>
    <textarea v-model="inputedAboutUs" placeholder="Введите информацию"
      @click.prevent="textErrorAboutUs = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ textErrorAboutUs }}</div>

    <label>Инормация для страницы "Контакты"</label>
    <textarea v-model="inputedContants" placeholder="Введите данные о контактах"
      @click.prevent="textErrorInputContants = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ textErrorInputContants }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view" @click.prevent="updateCompany({
      id: company.id,
      title: inputedTitle,
      brand_title: inputedBrandTitle,
      tagline: inputedTagline,
      favicon_file: selectedFaviconFile,
      logo_file: selectedLogoFile,
      about_us: inputedAboutUs,
      contacts: inputedContants,
    })">Сохранить изменения</button>
  </form>
  <div v-show="company == null" class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>
</template>

