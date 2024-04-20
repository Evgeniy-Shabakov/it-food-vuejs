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
  <div class="dialog">
    <div class="dialog__form">
      <div>
        <input v-model="inputedPhone" class="dialog__phone" type="text" placeholder="Введите номер телефона">
      </div>
      <div>
        <input v-model="inputedCode" class="dialog__phone" type="text" placeholder="Введите код подтверждения">
      </div>

      <button class="dialog__btn-submit" @click.prevent="sendVerifyCodeVue({
        phone: inputedPhone
      })">
        Отправить код подтверждения
      </button>

      <button class="dialog__btn-submit" @click.prevent="login({
        phone: inputedPhone,
        password: inputedCode
      })">
        Подтвердить
      </button>
    </div>
  </div>
</template>
