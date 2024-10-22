<script setup>
import { ref, onMounted, reactive } from 'vue';
import { updateModelAxios, currentLegalDocument } from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const legalDocumentInputedData = reactive({
    initialize() {
        this.id = currentLegalDocument.value.id
        this.title = currentLegalDocument.value.title
        this.file = null
        this.description = currentLegalDocument.value.description
    }
})

const validationErrors = ref({})

const textDone = ref(null)

onMounted(async () => {
    legalDocumentInputedData.initialize()
})

function updateLegalDocument() {
    validationErrors.value = {}
    textDone.value = null

    const formData = new FormData();

    formData.append("id", legalDocumentInputedData.id);
    formData.append("title", legalDocumentInputedData.title ? legalDocumentInputedData.title : '');
    if (legalDocumentInputedData.file)                         //без условия не видит валидацию required в Ларавел
        formData.append("file", legalDocumentInputedData.file);
    formData.append("description", legalDocumentInputedData.description ? legalDocumentInputedData.description : '');



    updateModelAxios('legal-documents', formData)
        .then(res => {
            legalDocumentInputedData.initialize()
            document.getElementById('fileInput').value = '' //очищаем инпут 
            textDone.value = res.messageForVue.text
        })
        .catch(err => {
            validationErrors.value = err.response.data.errors
            transformValidateErrorsForUI(validationErrors.value)
        })
}

function fileChange(e) {
    legalDocumentInputedData.file = e.target.files[0];
}
</script>

<template>
    <h2>Редактирование документа</h2>

    <form class="admin-forms">

        <label class="required">Наименование</label>
        <input type="text"
               v-model="legalDocumentInputedData.title"
               placeholder="Введите название правового документа"
               @click.prevent="validationErrors.title = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.title }}</div>

        <label>Описание</label>
        <textarea v-model="legalDocumentInputedData.description"
                  placeholder="Введите короткое пояснение"
                  @click.prevent="validationErrors.description = ''; textDone = ''"></textarea>
        <div class="invalid-text">{{ validationErrors.description }}</div>

        <label class="required">Файл (Word)</label>
        <input type="file"
               @click="validationErrors.file = ''; textDone = ''"
               @change="fileChange"
               id="fileInput"
               accept=".docx">
        <div class="invalid-text">{{ validationErrors.file }}</div>

        <div class="done-text">{{ textDone }}</div>

        <button class="btn btn-view"
                @click.prevent="updateLegalDocument()">
            Редактировать
        </button>

    </form>
</template>
