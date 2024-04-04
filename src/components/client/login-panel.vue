<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { serverUrl } from '/src/main.js'

const inputedPhone = ref('')

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

async function login() {
  await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie')
    .then(res => {
      console.log(res)
    })
  await axios
    .post(`http://127.0.0.1:8000/send-verify-code`, { phone: inputedPhone.value })
    .then(res => {
      console.log(res);
      
    })
    .catch(err => {
      
    })

}
</script>

<template>
  <div class="dialog">
    <div class="dialog__form">
      <div>
        <input v-model="inputedPhone" class="dialog__phone" type="tel" placeholder="Введите номер телефона">
      </div>

      <button @click.prevent="login()" class="dialog__btn-submit">Отправить код</button>
    </div>
  </div>
</template>
