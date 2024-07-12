<script setup>
import { ORDER_STATUS } from '/src/store/data-types/order-status'
import {
    fullOrder, blockNextStatus, nextStatus
} from '/src/store/order-manager/order-manager-order-helper.js'

function actionForClose() {
    fullOrder.value = null
}

</script>

<template>

    <div class="order-manager-full-order">

        <div class="order-manager-full-order__data">
            <span class="order-manager-full-order__number">№{{ fullOrder.number }}</span>

            <span class="order-manager-full-order__type"> - {{ fullOrder.order_type }}</span>

            <div class="order-manager-full-order__status"> ({{ fullOrder.order_status }})</div>

            <p class="order-manager-full-order__time">Время оформления - {{ new
                Date(fullOrder.created_at).toLocaleTimeString() }}</p>

            <div class="order-manager-full-order__products-section">

                <template v-for="product in fullOrder.products">

                    <img class="order-manager-full-order__product-img" :src="product.image_url" alt="">
                    <div>{{ product.title }}</div>
                    <div class="order-manager-full-order__count-price">
                        <span class="order-manager-full-order__count">{{ product.quantity }}</span>
                        <span> x {{ Number(product.price) }}р</span>
                    </div>
                    <div class="order-manager-full-order__product-total">
                        {{ Number(product.quantity) * Number(product.price) }}р
                    </div>

                </template>

            </div>

            <p class="order-manager-full-order__total">{{ fullOrder.total_price }}р.</p>

            <div v-if="blockNextStatus[fullOrder.id]" class="spinner-centr-object">
                <div class="spinner"></div>
            </div>

        </div>

        <div class="order-manager-full-order__actions">
            <button v-if="fullOrder.order_status !== ORDER_STATUS.COMPLETED"
                class="order-manager-full-order__btn-next-status btn btn-submit"
                @click.prevent="nextStatus(fullOrder)">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        <button class="order-manager-full-order__btn-close" @click.prevent="actionForClose()">
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>

</template>
