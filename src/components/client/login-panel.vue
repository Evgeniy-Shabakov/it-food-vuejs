<script setup>
import { computed, ref, watch } from 'vue'
import { sendVerifyCode, login, currentAuthenticatedUser } from '/src/store/axios-helper.js'
import { inputedPhone, inputedCode, loginForOrder } from '/src/store/login-panel-helper.js'
import { timerForSendVerifyCodeAllowed, secBeforeSendVerifyCodeAllowed } from '/src/store/login-panel-helper.js'
import PhoneInput from './phone-input-component.vue'
import CodeInput from './code-input-component.vue'
import router from "/src/router.js"
import { LOADING_TYPE } from '/src/store/loading-type'

const openCode = ref(false)
const codeError = ref(false)

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились
watch(currentAuthenticatedUser, () => {
  if (currentAuthenticatedUser.value && currentAuthenticatedUser.value != LOADING_TYPE.loading) {
    router.push({ name: 'client.menu.popup.user-panel' })
  }
})

watch(inputedCode, () => {
  if (inputedCode.value.length == 1)
    codeError.value = false
})

const currentSecBeforeSendVerifyCodeAllowed = ref()

const phoneNumberForServer = computed(() => {
  return '+7' + inputedPhone.value.replace(/[^+\d]/g, '')
})

if (localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')) {
  startTimerForSendVerifyCodeAllowed(secBeforeSendVerifyCodeAllowed.value)
}

function startTimerForSendVerifyCodeAllowed(delayInSec) {
  let startTime
  if (localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')) {
    clearInterval(timerForSendVerifyCodeAllowed.value)
    startTime = new Date(JSON.parse(localStorage.getItem('startTimeTimeoutForSendVerifyCodeAllowed')))
  }
  else {
    startTime = new Date()
    localStorage.setItem('startTimeTimeoutForSendVerifyCodeAllowed', JSON.stringify(startTime))
  }

  timerForSendVerifyCodeAllowed.value = setInterval(() => {

    currentSecBeforeSendVerifyCodeAllowed.value = delayInSec - Math.round((new Date() - startTime) / 1000)

    if (currentSecBeforeSendVerifyCodeAllowed.value < 1) {
      clearInterval(timerForSendVerifyCodeAllowed.value)
      timerForSendVerifyCodeAllowed.value = null
      localStorage.removeItem('startTimeTimeoutForSendVerifyCodeAllowed')
    }

  }, 1000)
}

function sendVerifyCodeVue() {
  inputedCode.value = ' ' //нужен именно пробел, чтобы вызывался watch в CodeInput
  openCode.value = true

  startTimerForSendVerifyCodeAllowed(secBeforeSendVerifyCodeAllowed.value)

  sendVerifyCode({ 'phone': phoneNumberForServer.value })
    .then((res) => {
      alert(res.data)
    })
    .catch((err) => {
      openCode.value = false
    })
}

function loginVue() {
  login({ phone: phoneNumberForServer.value, sms_code: inputedCode.value })
    .then(res => {
      if (loginForOrder.value) {
        loginForOrder.value = false
        router.push({ name: 'client.menu.popup.order-panel' })
      }
      else
        router.push({ name: 'client.menu.popup.user-panel' })
    })
    .catch(err => {
      codeError.value = true
      inputedCode.value = ''
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
        <p v-else class="login-panel__text">код отправили сообщением на {{ phoneNumberForServer }}</p>

        <div v-if="openCode == false" class="login-panel__phone-input">
          <PhoneInput></PhoneInput>
        </div>
        <div v-else>
          <CodeInput class="login-panel__phone-input"></CodeInput>
          <div v-if="codeError" class="login-panel__code-error">данные не совпадают</div>
        </div>
      </div>

      <div class="login-panel__btn-section">

        <template v-if="openCode == false">
          <div v-if="timerForSendVerifyCodeAllowed == null">
            <p class="login-panel__soglasie">Продолжая вы соглашаетесь со сбором, обработкой персональных данных и
              Пользовательским соглашением</p>
            <div v-if="phoneNumberForServer.length == 12" class="order-panel__btn-section">
              <button class="btn btn-submit login-panel__btn-submit" @click.prevent="sendVerifyCodeVue()">
                ПРОДОЛЖИТЬ
              </button>
            </div>

            <div v-else class="order-panel__btn-section">
              <button class="btn btn-inactive login-panel__btn-submit" @click.prevent="">
                ПРОДОЛЖИТЬ
              </button>
            </div>
            <!-- <div class="order-panel__btn-section"></div> -->
          </div>
          <div v-else>
            <p class="login-panel__soglasie">Повторно отправить код можно через {{ currentSecBeforeSendVerifyCodeAllowed
              }}сек. </p>
            <div class="order-panel__btn-section">
              <button class="btn btn-inactive login-panel__btn-submit" @click.prevent="">
                Отправить код повторно
              </button>
            </div>
          </div>

        </template>

        <template v-else>
          <div v-if="inputedCode.length == 4" class="order-panel__btn-section">
            <button class="btn btn-submit login-panel__btn-submit" @click.prevent="loginVue()">
              Подтвердить код
            </button>
          </div>
          <div v-else>
            <div v-if="timerForSendVerifyCodeAllowed">
              <p class="login-panel__soglasie">Если код не придет, его можно будет отправить
                повторно через {{ currentSecBeforeSendVerifyCodeAllowed }}сек. </p>
              <div class="order-panel__btn-section">
                <button class="btn btn-inactive login-panel__btn-submit" @click.prevent="">
                  Отправить код повторно
                </button>
              </div>
            </div>
            <div v-else class="order-panel__btn-section">
              <button class="btn btn-submit login-panel__btn-submit" @click.prevent="sendVerifyCodeVue()">
                Отправить код повторно
              </button>
            </div>
          </div>
        </template>

      </div>

    </div>
  </div>

</template>
