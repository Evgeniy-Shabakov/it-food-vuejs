<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { serverUrl } from '/src/config.js'
import { currentAuthenticatedUser } from '/src/store/axios-helper.js'

const inputedPhone = ref('')
const inputedCode = ref('')

axios.defaults.baseURL = serverUrl
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

async function sendVerifyCode() {
  await axios.get('/sanctum/csrf-cookie')

  await axios
    .post('/send-verify-code', { phone: inputedPhone.value })
    .then(res => {
      alert(res.data)
    })
    .catch(err => {
      console.log(err.response.data.message);
      alert(err.response.data.message);
    })
}

function login() {
  axios
    .post('/login', { phone: inputedPhone.value, password: inputedCode.value })
    .then(res => {
      console.log(res.data)
      currentAuthenticatedUser.value = res.data
      alert('Успешный вход')
    })
    .catch(err => {
      console.log(err.response.data.message);
      alert(err.response.data.message)
    })
}

function logout() {
  axios
    .delete('/logout')
    .then(res => {
      currentAuthenticatedUser.value = null
      alert('Успешный выход')
    })
    .catch(err => {
      console.log(err.response.data.message);
      alert(err.response.data.message)
    })
}

</script>

<template>
  <div class="dialog">
    <div class="dialog__form">
      <span> {{ currentAuthenticatedUser.phone }}</span>
      <div>
        <input v-model="inputedPhone" class="dialog__phone" type="text" placeholder="Введите номер телефона">
      </div>
      <div>
        <input v-model="inputedCode" class="dialog__phone" type="text" placeholder="Введите код подтверждения">
      </div>

      <button @click.prevent="sendVerifyCode" class="dialog__btn-submit">Отправить код подтверждения</button>
      <button @click.prevent="login" class="dialog__btn-submit">Подтвердить</button>
      <button @click.prevent="logout" class="dialog__btn-submit">Выйти</button>
    </div>
  </div>
</template>
