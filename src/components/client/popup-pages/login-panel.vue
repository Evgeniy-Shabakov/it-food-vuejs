<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { sendVerifyCode, login, authUser } from '/src/store/axios-helper.js'
import { inputedPhone, inputedCode, loginForOrder } from '/src/store/login-panel-helper.js'
import { timerForSendVerifyCodeAllowed, secBeforeSendVerifyCodeAllowed } from '/src/store/login-panel-helper.js'
import PhoneInput from '/src/components/client/modules/phone-input-component.vue'
import CodeInput from '/src/components/client/modules/code-input-component.vue'
import router from "/src/router.js"

const openCode = ref(false)
const codeError = ref(false)

onMounted(() => {
  if (authUser.value)
    router.push({ name: 'client.menu.popup.user-panel' })
})

//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - START
watch(authUser, () => {
  if (authUser.value && !loginForOrder.value) {
    router.push({ name: 'client.menu.popup.user-panel' })
  }
})
//проверка если зашли на страницу и данные о текущем пользователе еще не загрузились - END

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

  <div class="client-popup-page-layout__main-section">


    <div class="login-panel">

      <!-- пустой для space-between -->
      <div></div>

      <div>

        <h1 class="client-popup-page-layout__h1">
          <template v-if="openCode == false">
            Введите номер телефона
          </template>
          <template v-else>
            Введите код
          </template>
        </h1>


        <p v-if="openCode == false"
           class="login-panel__text">
          для входа в личный кабинет или <br>оформления заказа
        </p>
        <p v-else
           class="login-panel__text">
          код отправили сообщением на <br>{{ phoneNumberForServer }}
        </p>

        <PhoneInput v-if="openCode == false"
                    class="login-panel__phone-input" />

        <template v-else>
          <CodeInput class="login-panel__phone-input" />
          <div v-if="codeError"
               class="login-panel__code-error">данные не совпадают</div>
        </template>
      </div>

      <template v-if="openCode == false">

        <p v-if="timerForSendVerifyCodeAllowed == null"
           class="login-panel__soglasie">
          Продолжая вы соглашаетесь со
          <router-link class="cookies__link"
                       :to="{ name: 'client.menu.popup.legal-documents' }">
            сбором, обработкой персональных данных и
            Пользовательским соглашением
          </router-link>
        </p>

        <p v-else
           class="login-panel__soglasie">
          Повторно отправить код можно через
          {{ currentSecBeforeSendVerifyCodeAllowed }}сек.
        </p>

      </template>

      <template v-else>

        <p v-if="timerForSendVerifyCodeAllowed"
           class="login-panel__soglasie">
          Если код не придет, его можно будет отправить
          повторно через {{ currentSecBeforeSendVerifyCodeAllowed }}сек.
        </p>

        <!-- пустой для space-between -->
        <p v-else></p>

      </template>

    </div>


  </div>

  <div class="client-popup-page-layout__btn-section">

    <template v-if="openCode == false">

      <template v-if="timerForSendVerifyCodeAllowed == null">

        <template v-if="phoneNumberForServer.length == 12">

          <button class="btn btn-submit login-panel__btn-submit"
                  @click.prevent="sendVerifyCodeVue()">
            ПРОДОЛЖИТЬ
          </button>

        </template>

        <template v-else>

          <button class="btn btn-inactive login-panel__btn-submit"
                  @click.prevent="">
            ПРОДОЛЖИТЬ
          </button>

        </template>

      </template>

      <template v-else>

        <button class="btn btn-inactive login-panel__btn-submit"
                @click.prevent="">
          Отправить код повторно
        </button>

      </template>

    </template>

    <template v-else>

      <template v-if="inputedCode.length == 4">

        <button class="btn btn-submit login-panel__btn-submit"
                @click.prevent="loginVue()">
          Подтвердить код
        </button>

      </template>

      <template v-else>

        <template v-if="timerForSendVerifyCodeAllowed">

          <button class="btn btn-inactive login-panel__btn-submit"
                  @click.prevent="">
            Отправить код повторно
          </button>

        </template>

        <template v-else>

          <button class="btn btn-submit login-panel__btn-submit"
                  @click.prevent="sendVerifyCodeVue()">
            Отправить код повторно
          </button>

        </template>

      </template>

    </template>

  </div>

</template>
