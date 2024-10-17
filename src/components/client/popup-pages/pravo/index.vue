<script setup>
import { serverUrl } from '/src/config'
</script>
<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Правовая информация</h1>

        <div class="pravo">

            <a :href="`${serverUrl}/storage/pravo/privacy_policy.docx`"
               download>
                Политика обработки персональных данных
            </a>

            <iframe :src="`${serverUrl}/storage/pravo/privacy_policy.pdf`"
                    class="pravo__file"
                    frameborder="0">
            </iframe>

        </div>

    </div>

    <div class="client-popup-page-layout__btn-section">
        <router-link :to="{ name: 'client.menu' }"
                     class="client-popup-page-layout__btn-w-100">
            <button @click=""
                    class="btn btn-submit client-popup-page-layout__btn-w-100">
                Назад
            </button>
        </router-link>
    </div>

</template>

<style scoped>
.pravo {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
}

.pravo__file {
    width: 100%;
    height: 100%;
}
</style>