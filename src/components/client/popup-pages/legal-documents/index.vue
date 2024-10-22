<script setup>
import { getModelsAxios, legalDocuments } from '/src/store/axios-helper.js'

getModelsAxios('legal-documents')
</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Правовая информация</h1>

        <div class="pravo">

            <router-link v-for="document in legalDocuments"
                         :to="{ name: 'client.menu.popup.legal-documents.show', params: { id: document.id } }"
                         download>
                {{ document.title }}
            </router-link>

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
    gap: 15px;
    align-items: center;
    text-align: center;
}
</style>