<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue'

import { ORDER_STATUS } from '/src/store/data-types/order-status'
import {
    fullOrder, blockNextStatus, nextStatus
} from '/src/store/order-manager/order-manager-order-helper';

const { order } = defineProps(['order'])

const timer = ref(0)

let intervalTimer

//работа с таймером - START
onMounted(() => {
    if (order.order_status === ORDER_STATUS.COMPLETED) {
        timer.value = Math.floor((new Date(order.updated_at) - new Date(order.created_at)) / 1000)
        return
    }

    intervalTimer = setInterval(() => {
        timer.value = Math.floor((new Date() - new Date(order.created_at)) / 1000)
    }, 1000)
})

onUnmounted(() => {
    clearInterval(intervalTimer)
})


function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
//работа с таймером - END

function openFullOrder(order) {
    fullOrder.value = order
}

</script>

<template>

    <div class="order-manager-mini-order" :class="{
        'order-manager-mini-order__completed-orders':
            order.order_status == ORDER_STATUS.COMPLETED,
        'order-manager-mini-order__selected-order ':
            fullOrder != null && order.id == fullOrder.id,
        'order-manager-mini-order__completed-selected-order':
            fullOrder != null && order.id == fullOrder.id && order.order_status == ORDER_STATUS.COMPLETED,
    }">

        <button @click="openFullOrder(order)" class="order-manager-mini-order__btn-full-order">

            <p class="order-manager-mini-order__number">№{{ order.number }}</p>

            <p class="order-manager-mini-order__type">{{ order.order_type }}</p>

            <!-- <p class="order-manager-mini-order__time">{{ new Date(order.created_at).toLocaleTimeString() }}</p> -->

            <p :class="{
                'order-manager-mini-order__timer-color-orange': timer >= 60 * 45 && timer < 60 * 60,
                'order-manager-mini-order__timer-color-red': timer >= 60 * 60,
            }" class="order-manager-mini-order__timer">
                {{ formatTimer(timer) }}
            </p>

            <div class="order-manager-mini-order__products">
                <img v-for="product in order.products" class="order-manager-mini-order__product-img"
                    :src="product.image_url" alt="">
            </div>

            <p class="order-manager-mini-order__total">{{ order.total_price }}р.</p>

        </button>

        <button v-if="order.order_status !== ORDER_STATUS.COMPLETED"
            class="order-manager-mini-order__btn-next-status btn btn-submit" @click.prevent="nextStatus(order)">
            <i class="fa-solid fa-arrow-right"></i>
        </button>

        <div v-if="blockNextStatus[order.id]" class="spinner-centr-object">
            <div class="spinner"></div>
        </div>

    </div>

</template>
