<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue';
import mammoth from 'mammoth';

import { legalDocuments } from '/src/store/axios-helper.js'
import { serverApiUrl } from '/src/config'

const convertedContent = ref('')

const id = useRoute().params.id
let document

if(legalDocuments.value) {
    document = legalDocuments.value.find(el => el.id == id)
}

convertAndDisplay()

async function convertAndDisplay() {
    try {
        const response = await fetch(`${serverApiUrl}/legal-documents/download/${id}`)

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

        <h1 v-if="document" class="client-popup-page-layout__h1">{{ document.title }} </h1>

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