<script setup>
import { ref } from 'vue'
import { COOKIE_NAME } from '/src/store/strings/cookie-name.js'
import IconClose from '/src/components/icon/close.vue'

const isCookiesAccepted = ref(false)

if (localStorage.getItem(COOKIE_NAME.COOKIES_ACCEPTED)) {
    isCookiesAccepted.value = localStorage.getItem(COOKIE_NAME.COOKIES_ACCEPTED)
}

function btnCloseCookiesPressed() {
    isCookiesAccepted.value = true
    localStorage.setItem(COOKIE_NAME.COOKIES_ACCEPTED, true)
}

</script>

<template>
    <div class="cookies"
         v-if="isCookiesAccepted == false">

        <div class="cookies__inner container">

            <button @click=btnCloseCookiesPressed()
                    class="cookies__btn-close">
                <icon-close></icon-close>
            </button>

            <div class="cookies__text">

                Мы используем файлы cookies для быстрой и удобной работы сайта.
                Продолжая пользоваться сайтом, вы принимаете

                <router-link class="cookies__link"
                             :to="{ name: 'client.menu.popup.legal-documents' }">
                    условия обработки персональных данных
                </router-link>

            </div>

        </div>

    </div>

</template>