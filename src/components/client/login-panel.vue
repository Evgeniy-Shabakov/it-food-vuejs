<script setup>
import { ref } from 'vue';
import { sendVerifyCode, login } from '/src/store/axios-helper.js'

const inputedPhone = ref('')
const inputedCode = ref('')

function sendVerifyCodeVue(data) {
  sendVerifyCode(data)
    .then((res) => {
      inputedCode.value = res.data
    })
}
</script>

<template>

  <div class="">
    <div>
      <p class="">Введите номер телефона</p>
      <input v-model="inputedPhone" class="" type="text" placeholder="Введите номер телефона">
    </div>
    <div>
      <input v-model="inputedCode" class="" type="text" placeholder="Введите код подтверждения">
    </div>

    <button class="btn-submit" @click.prevent="sendVerifyCodeVue({
      phone: inputedPhone
    })">
      Отправить код подтверждения
    </button>

    <button class="btn-submit" @click.prevent="login({
      phone: inputedPhone,
      password: inputedCode
    })">
      Подтвердить
    </button>
  </div>

</template>
