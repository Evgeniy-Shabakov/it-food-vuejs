<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Правовая информация</h1>

        <div class="pravo">

            <router-link :to="{name: 'client.menu.popup.pravo.privacy-policy'}"
               download>
                Политика обработки персональных данных
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
    align-items: center;
    text-align: center;
}
</style>