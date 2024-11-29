<script setup>
import router from "/src/router.js"
import {
    designs, currentDesign, textLoadOrFailForVue,
    getModelsAxios, deleteModelAxios
} from '/src/store/axios-helper.js'

getModelsAxios('designs')
    .then(() => sortDesigns())

function sortDesigns() {
    designs.value.sort((a, b) => {
        return (b.is_active == true) - (a.is_active == true);
    })
}

function openDesignEdit(design) {
    currentDesign.value = design
    router.push({ name: 'admin.designs.edit', params: { id: design.id } })
}

function deleteDesign(design) {
    deleteModelAxios('designs', design)  //пустые обработчики, чтобы не было ошибок не пойманных промисов
        .then((res) => {
            getModelsAxios('designs')
                .then(() => sortDesigns())
        })
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
                <span v-if="design.is_active"
                      class="theme theme--active">Активная тема</span>
                <span v-else
                      class="theme">неактивная тема</span>
            </div>

            <div>

                <input type="color"
                       v-model="design.background_page_main_color"
                       disabled>
                <input type="color"
                       v-model="design.background_page_elements_color"
                       disabled>
                <input type="color"
                       v-model="design.brand_color"
                       disabled>
                <input type="color"
                       v-model="design.text_color_main"
                       disabled>
                <input type="color"
                       v-model="design.text_color_on_brand_color"
                       disabled>
                <input type="color"
                       v-model="design.text_color_accent"
                       disabled>
                <input type="color"
                       v-model="design.bottom_nav_color"
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

.theme--active {
    color: green;
    font-weight: 700;
}
</style>