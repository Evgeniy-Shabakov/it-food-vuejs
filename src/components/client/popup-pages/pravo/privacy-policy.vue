<script setup>
import { serverApiUrl } from '/src/config'
import { ref, onMounted } from 'vue';
import mammoth from 'mammoth';

const convertedContent = ref('')

convertAndDisplay()

async function convertAndDisplay() {
    try {
        const response = await fetch(`${serverApiUrl}/download-privacy-policy`)

        const arrayBuffer = await response.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        convertedContent.value = value;
    } catch (error) {
        console.error('Ошибка при конвертации файла:', error);
    }
}

</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Политика обработки персональных данных </h1>

        <div class="privacy-policy"
             v-html="convertedContent"></div>

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
.privacy-policy {
    padding: 15px;
    font-size: 16px;
}

@media(max-width: 400px) {
    .privacy-policy {
        padding: 5px;
        font-size: 14px;
    }
}
</style>