<script setup>
import router from "/src/router.js"
import {
    designs, currentDesign, textLoadOrFailForVue,
    getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('designs')

function openDesignEdit(design) {
    currentDesign.value = design
    router.push({ name: 'admin.designs.edit', params: { id: design.id } })
}

function deleteDesign(design) {
    deleteModelAxios('designs', design)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
        .then((res) => { getModelsAxios('designs') })
        .catch((err) => { })
}

</script>
<template>
    <h2>Настройки дизайна</h2>

    <router-link :to="{ name: 'admin.designs.create' }">
        <button class="btn admin-index-btn-add">Добавить новую тему</button>
    </router-link>

    <div v-if="designs">
        <div v-for="design in designs"
             class="admin-restaurant-index__restaurant">

            <h5 class="admin-restaurant-index__restaurant_title">{{ design.title }}</h5>

            <div>
                <span v-if="design.is_active" class="theme">Активная тема</span>
                <span v-else class="theme">неактивная тема</span>
            </div>

            <div>

                <input type="color"
                       v-model="design.background_color"
                       disabled>
                <input type="color"
                       v-model="design.text_color"
                       disabled>
                <input type="color"
                       v-model="design.brand_color"
                       disabled>
                <input type="color"
                       v-model="design.text_color_on_brand_color"
                       disabled>
                <input type="color"
                       v-model="design.supporting_color"
                       disabled>
                <input type="color"
                       v-model="design.accent_text_color"
                       disabled>
            </div>

            <button class="btn btn-edit"
                    @click.prevent="openDesignEdit(design)"
                    type="button">
                Редактировать
            </button>

            <button class="btn btn-delete"
                    @click.prevent="deleteDesign(design)"
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
.theme {
    font-size: 15px;
}
</style>