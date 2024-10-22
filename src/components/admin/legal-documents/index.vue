<script setup>
import router from "/src/router.js"
import {
    legalDocuments, currentLegalDocument, textLoadOrFailForVue,
    getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('legal-documents')

function openLegalDocumentEdit(legalDocument) {
    currentLegalDocument.value = legalDocument
    router.push({ name: 'admin.legal-documents.edit', params: { id: legalDocument.id } })
}

function deleteLegalDocumentVue(legalDocument) {
    deleteModelAxios('legal-documents', legalDocument)
        .then(() => { getModelsAxios('legal-documents') })
        .catch((err) => { })
}
</script>

<template>

    <h2>Правовые документы</h2>

    <router-link :to="{ name: 'admin.legal-documents.create' }">
        <button class="btn admin-index-btn-add">Добавить новый документ</button>
    </router-link>

    <div v-if="legalDocuments">
        <div v-for="document in legalDocuments"
             class="admin-restaurant-index__restaurant">

            <h5 class="admin-restaurant-index__restaurant_title">{{ document.title }}</h5>

            <a class="btn btn-view link-download"
               :href="document.file_url"
               download>
                Скачать
            </a>

            <button class="btn btn-edit"
                    @click.prevent="openLegalDocumentEdit(document)"
                    type="button">
                Редактировать
            </button>

            <button class="btn btn-delete"
                    @click.prevent="deleteLegalDocumentVue(document)"
                    type="button">
                Удалить
            </button>


        </div>
    </div>

    <div v-else
         class="admin-view-model-load">
        {{ textLoadOrFailForVue }}
    </div>
</template>
<style scoped>
.link-download {
    text-decoration: none;
    text-align: center;
}
</style>
