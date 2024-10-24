<script setup>
import { ref, onMounted, reactive } from 'vue';
import router from "/src/router"
import { currentDesign, updateModelAxios } from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const designInputedData = reactive({
    initialize() {
        this.title = currentDesign.value.title
        this.is_active = Boolean(currentDesign.value.is_active)
        this.background_color = currentDesign.value.background_color
        this.text_color = currentDesign.value.text_color
        this.brand_color = currentDesign.value.brand_color
        this.text_color_on_brand_color = currentDesign.value.text_color_on_brand_color
        this.supporting_color = currentDesign.value.supporting_color
        this.accent_text_color = currentDesign.value.accent_text_color
    }
})

const validationErrors = ref({})

const textDone = ref(null)

onMounted(() => {
    designInputedData.initialize()
})

function updateDesign() {
    validationErrors.value = {}
    textDone.value = null

    designInputedData.id = currentDesign.value.id
    updateModelAxios('designs', designInputedData)
        .then(res => {
            router.push({ name: 'admin.designs.index' })
        })
        .catch(err => {
            validationErrors.value = err.response.data.errors
            transformValidateErrorsForUI(validationErrors.value)
        })
}
</script>

<template>
    <h2>Редактирование темы</h2>
    <form class="admin-forms">

        <label class="required">Наименование</label>
        <input type="text"
               v-model="designInputedData.title"
               placeholder="Введите название темы"
               @click.prevent="validationErrors.title = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.title }}</div>

        <label class="required">Основной цвет фона</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.background_color"
               @click="validationErrors.background_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.background_color }}</div>

        <label class="required">Основной цвет текста</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.text_color"
               @click="validationErrors.text_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.text_color }}</div>

        <label class="required">Цвет бренда</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.brand_color"
               @click="validationErrors.brand_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.brand_color }}</div>

        <label class="required">Цвет текста на цвете бренда</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.text_color_on_brand_color"
               @click="validationErrors.text_color_on_brand_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.text_color_on_brand_color }}</div>

        <label class="required">Вспомогательный цвет (линии, нижнее меню, вспомогатльный текст)</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.supporting_color"
               @click="validationErrors.supporting_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.supporting_color }}</div>

        <label class="required">Акцентированный цвет текста (текст: 'статус заказа', 'бесплатная доставка')</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.accent_text_color"
               @click="validationErrors.accent_text_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.accent_text_color }}</div>

        <span class="required">Применить тему</span>
        <input type="checkbox"
               v-model="designInputedData.is_active"
               @click="validationErrors.is_active = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.is_active }}</div>

        <div class="done-text">{{ textDone }}</div>

        <button class="btn btn-view"
                @click.prevent="updateDesign()">
            Редактировать
        </button>

    </form>

</template>
<style scoped>
.color-box {
    padding: 10px;
    width: 75px;
    height: 75px;
}
</style>
