<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, defineProps } from 'vue';
import axios from 'axios'
import { loadOrdersToday } from '/src/store/loading-helper.js'
import { ORDER_STATUS } from '/src/store/data-types/order-status'

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

const blockNextStatus = ref(false)

async function nextStatus(order) {
    if (blockNextStatus.value) return
    if (order.order_status === ORDER_STATUS.COMPLETED) return

    blockNextStatus.value = true

    try {
        await axios.patch(`/orders/${order.id}/next-status`)
        await loadOrdersToday()
    } catch (error) {
        console.log(error);
    }

    blockNextStatus.value = false
}

</script>

<template>

    <button class="order-manager-mini-order">

        <p class="order-manager-mini-order__number">{{ order.number }}</p>

        <p class="order-manager-mini-order__type">{{ order.order_type }}</p>

        <p class="order-manager-mini-order__time">{{ new Date(order.created_at).toLocaleTimeString() }}</p>

        <p class="order-manager-mini-order__timer">{{ formatTimer(timer) }}</p>

        <p class="order-manager-mini-order__total">{{ order.total_price }}р.</p>

        <button v-if="order.order_status !== ORDER_STATUS.COMPLETED" class="order-manager-mini-order__btn-next-status btn btn-submit" @click.prevent="nextStatus(order)">
            <i class="fa-solid fa-arrow-right"></i>
        </button>

        <div v-if="blockNextStatus" class="spinner-centr-object">
            <div class="spinner"></div>
        </div>

    </button>

</template>
