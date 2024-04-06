<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { serverUrl } from '/src/config.js'

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
}

function login() {
  axios
    .post('/login', { phone: inputedPhone.value, password: inputedCode.value })
    .then(res => {
      alert('Успешный вход')
    })
    .catch(err=>{
      alert('Неуспешный вход')
    })
}

</script>

<template>
  <div class="dialog">
    <div class="dialog__form">
      <div>
        <input v-model="inputedPhone" class="dialog__phone" type="tel" placeholder="Введите номер телефона">
      </div>
      <div>
        <input v-model="inputedCode" class="dialog__phone" type="text" placeholder="Введите код подтверждения">
      </div>

      <button @click.prevent="sendVerifyCode" class="dialog__btn-submit">Отправить код</button>
      <button @click.prevent="login" class="dialog__btn-submit">Подтвердить</button>
    </div>
  </div>
</template>
