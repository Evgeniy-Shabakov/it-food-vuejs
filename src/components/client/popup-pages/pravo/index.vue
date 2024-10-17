<script setup>
import { serverUrl } from '/src/config'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import mammoth from 'mammoth';


const htmlContent = ref('');

const fetchAndConvertDocx = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const arrayBuffer = response.data;

        // Декодируем исходный буфер
        const { value } = await mammoth.convertToHtml({ buffer: arrayBuffer });
        htmlContent.value = value; // Сохраняем HTML-контент
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
    }
};

onMounted(() => {
    const url = `${serverUrl}/storage/pravo/privacy_policy.docx`; // Убедитесь, что это файл .docx, а не .pdf
    fetchAndConvertDocx(url);
});

</script>
<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Правовая информация</h1>

        <div class="pravo">

            <a :href="`${serverUrl}/storage/pravo/privacy_policy.docx`"
               download>
                Политика обработки персональных данных
            </a>

            <div v-html="htmlContent"></div>

            <!-- <iframe :src="`${serverUrl}/storage/pravo/privacy_policy.pdf`"
                    class="pravo__file"
                    frameborder="0">
            </iframe> -->

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