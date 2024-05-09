<script setup>
import { computed, ref } from 'vue';
import { sendVerifyCode, login } from '/src/store/axios-helper.js'
import { inputedPhone, inputedCode } from '/src/store/client-helper.js'
import PhoneInput from './phone-input-component.vue';
import CodeInput from './code-input-component.vue';

const phoneNumberForServer = computed(() => {
  return '+7' + inputedPhone.value.replace(/[^+\d]/g, '')
})

const openCode = ref(false)

function sendVerifyCodeVue() {
  let data = { 'phone': phoneNumberForServer.value }

  sendVerifyCode(data)
    .then((res) => {
      openCode.value = true

      inputedCode.value = res.data

      // login({
      //   phone: phoneNumberForServer.value,
      //   password: inputedCode.value
      // })
    })
}

</script>

<template>

  <div class="login-panel__container">
    <div class="login-panel">

      <div class="login-panel__text-input-section">
        <p v-if="openCode == false" class="login-panel__title">Введите номер телефона</p>
        <p v-else class="login-panel__title">Введите код</p>

        <p v-if="openCode == false" class="login-panel__text">для входа в личный кабинет или оформления заказа</p>
        <p v-else class="login-panel__text">мы отправили его в смс сообщении</p>

        <div v-if="openCode == false" class="login-panel__phone-input">
          <PhoneInput></PhoneInput>
        </div>
        <div v-else class="login-panel__phone-input">
          <CodeInput></CodeInput>
        </div>

        <!-- <input v-model="inputedCode" class="" type="text" placeholder="Введите код подтверждения"> -->
      </div>

      <div class="login-panel__btn-section">
        <template v-if="openCode == false">
          <button v-if="phoneNumberForServer.length == 12" class="btn btn-submit login-panel__btn-submit"
            @click.prevent="sendVerifyCodeVue()">
            Подтвердить номер
          </button>

          <button v-else class="btn btn-inactive login-panel__btn-submit" @click.prevent="">
            Подтвердить номер
          </button>
        </template>
        <template v-else>
          <button v-if="inputedCode.length == 4" class="btn btn-submit login-panel__btn-submit" @click.prevent="login({
            phone: phoneNumberForServer,
            password: inputedCode
          })">
            Подтвердить код
          </button>
          <button v-else class="btn btn-inactive login-panel__btn-submit" @click.prevent="">
            Подтвердить код
          </button>
        </template>
      </div>

    </div>
  </div>

</template>
