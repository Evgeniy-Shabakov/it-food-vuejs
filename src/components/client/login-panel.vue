<script setup>
import { ref } from 'vue';
import { sendVerifyCode, login } from '/src/store/axios-helper.js'
import PhoneInput from './phone-input-component.vue';

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

      <div class="login-panel__text-input-section">
        <p class="login-panel__title">Введите номер телефона</p>
        <p class="login-panel__text">для входа в личный кабинет или оформления заказа</p>
        <div class="login-panel__phone-input">
          <PhoneInput></PhoneInput>
        </div>
        <!-- <input v-model="inputedCode" class="" type="text" placeholder="Введите код подтверждения"> -->
      </div>

      <div class="login-panel__btn-section">
        <button class="btn btn-submit" @click.prevent="sendVerifyCodeVue({
          phone: inputedPhone
        })">
          Отправить код подтверждения
        </button>

        <!-- <button class="btn btn-submit" @click.prevent="login({
          phone: inputedPhone,
          password: inputedCode
        })">
          Подтвердить
        </button> -->
      </div>

    </div>
  </div>

</template>
