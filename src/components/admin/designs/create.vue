<script setup>
import { ref, onMounted, reactive } from 'vue';
import router from "/src/router"
import { designs, storeModelAxios } from '/src/store/axios-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

const fieldInputTitle = ref()

const activeDesign = designs.value.find(obj => obj.is_active == true)

const designInputedData = reactive({
    initialize(design) {
        this.title = null
        this.is_active = false
        this.background_page_main_color = design.background_page_main_color
        this.background_page_elements_color = design.background_page_elements_color
        this.brand_color = design.brand_color
        this.text_color_main = design.text_color_main
        this.text_color_on_brand_color = design.text_color_on_brand_color
        this.text_color_accent = design.text_color_accent
        this.bottom_nav_color = design.bottom_nav_color
    }
})

const validationErrors = ref({})

const textDone = ref(null)

onMounted(() => {
    fieldInputTitle.value.focus()
    designInputedData.initialize(activeDesign)
})

function storeDesign() {
    validationErrors.value = {}
    textDone.value = null

    storeModelAxios('designs', designInputedData)
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
    <h2>Добавление новой темы</h2>
    <form class="admin-forms">

        <label class="required">Наименование</label>
        <input ref="fieldInputTitle"
               type="text"
               v-model="designInputedData.title"
               placeholder="Введите название темы"
               @click.prevent="validationErrors.title = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.title }}</div>

        <label class="required">Основной цвет фона</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.background_page_main_color"
               @click="validationErrors.background_page_main_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.background_page_main_color }}</div>

        <label class="required">Фон элементов страницы (шапка, карточки, навигация)</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.background_page_elements_color"
               @click="validationErrors.background_page_elements_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.background_page_elements_color }}</div>

        <label class="required">Цвет бренда</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.brand_color"
               @click="validationErrors.brand_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.brand_color }}</div>

        <label class="required">Основной цвет текста</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.text_color_main"
               @click="validationErrors.text_color_main = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.text_color_main }}</div>

        <label class="required">Цвет текста на цвете бренда</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.text_color_on_brand_color"
               @click="validationErrors.text_color_on_brand_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.text_color_on_brand_color }}</div>

        <label class="required">Акцентированный цвет текста (текст: 'статус заказа', 'бесплатная доставка')</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.text_color_accent"
               @click="validationErrors.text_color_accent = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.text_color_accent }}</div>

        <label class="required">Цвет нижнего меню навигации</label>
        <input class="color-box"
               type="color"
               v-model="designInputedData.bottom_nav_color"
               @click="validationErrors.bottom_nav_color = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.bottom_nav_color }}</div>

        <span class="required">Применить тему</span>
        <input type="checkbox"
               v-model="designInputedData.is_active"
               @click="validationErrors.is_active = ''; textDone = ''">
        <div class="invalid-text">{{ validationErrors.is_active }}</div>

        <div class="done-text">{{ textDone }}</div>

        <button class="btn btn-view"
                @click.prevent="storeDesign()">
            Добавить
        </button>

    </form>

</template>
<style scoped>
.color-box {
    height: 75px;
    border-radius: 0px;
    padding: 0px;
}
</style>
