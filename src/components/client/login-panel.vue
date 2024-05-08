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

  <div class="login-panel__container">
    <div class="login-panel">

      <div>
        <p class="login-panel__text">Для оформление заказа или входа в личный кабинет необходимо ввести номер телефона
        </p>
        <input v-model="inputedPhone" class="login-panel__phone-input" type="text" placeholder="Введите номер телефона">
        <!-- <input v-model="inputedCode" class="" type="text" placeholder="Введите код подтверждения"> -->
      </div>

      <div>
        <button class="btn btn-submit" @click.prevent="sendVerifyCodeVue({
          phone: inputedPhone
        })">
          Отправить код подтверждения
        </button>

        <button class="btn btn-submit" @click.prevent="login({
          phone: inputedPhone,
          password: inputedCode
        })">
          Подтвердить
        </button>
      </div>

    </div>
  </div>

</template>
