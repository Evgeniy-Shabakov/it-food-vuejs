<script setup>
import { ref, watch } from 'vue'

import { allOrdersForUser, getAllOrdersForUser, authUser }
    from '/src/store/axios-helper.js'
import { repeatOrder } from '/src/store/client/user-panel'
import { LOADING_TYPE } from '/src/store/data-types/loading-type'

const orderHistoryLoadingType = ref(LOADING_TYPE.loading)

if (authUser.value) { // проверка нужна при заходе на страницу при обновлении
    getAllOrdersForUser(authUser.value.id)
        .then(() => orderHistoryLoadingType.value = LOADING_TYPE.complete)
        .catch(() => orderHistoryLoadingType.value = LOADING_TYPE.error)
}
else {
    watch(authUser, () => {
        getAllOrdersForUser(authUser.value.id)
            .then(() => orderHistoryLoadingType.value = LOADING_TYPE.complete)
            .catch(() => orderHistoryLoadingType.value = LOADING_TYPE.error)
    })
}

</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">История заказов</h1>

        <div class="orders-history">

            <div v-if="orderHistoryLoadingType == LOADING_TYPE.loading" class="spinner-centr-object">
                <div class="spinner"> </div>
            </div>

            <template v-else-if="orderHistoryLoadingType == LOADING_TYPE.complete">

                <template v-if="allOrdersForUser.length > 0">
                    <div v-for="order in allOrdersForUser">

                        <p class="orders-history__date-time">
                            {{ new Date(order.created_at).toLocaleDateString() }} -
                            {{ new Date(order.created_at).toLocaleTimeString() }}
                        </p>
                        <p class="orders-history__order-status">({{ order.order_status }})</p>

                        <div class="user-panel__products-section">

                            <template v-for="product in order.products">

                                <img class="user-panel__product-img" :src="product.image_url" alt="">
                                <span>{{ product.title }}</span>
                                <span class="user-panel__count-price"> {{ product.quantity }} </span>
                                <span> шт. </span>

                            </template>

                        </div>

                        <button @click.prevent="repeatOrder(order)"
                            class="btn--secondary orders-history__btn-repeat-order">
                            Повторить заказ
                        </button>

                    </div>
                </template>
                <p v-else>У вас еще не было заказов</p>

            </template>

            <div v-else>Ошибка загрузки...</div>

        </div>

    </div>

    <div class="client-popup-page-layout__btn-section">
        <router-link :to="{ name: 'client.menu.popup.user-panel' }" class="orders-history__btn-back">
            <button @click="" class="btn btn-submit orders-history__btn-back">
                Назад
            </button>
        </router-link>
    </div>

</template>
