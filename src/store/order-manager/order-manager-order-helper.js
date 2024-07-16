import { ref, reactive, onMounted, onUnmounted, watch, defineProps } from 'vue'
import axios from 'axios'

import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { loadOrdersToday } from '/src/store/loading-helper.js'
import {
    ordersNew, ordersAccepted, ordersCooking, ordersPacking,
    ordersWaitingCourier, ordersInTransit, ordersAwaitingPickup,
} from '/src/store/order-manager/order-manager-helper.js'
import { ordersToday } from '/src/store/axios-helper.js'

export const fullOrder = ref(null)

function setFullOrderByDefault() {
    if (ordersNew.value.length > 0) { fullOrder.value = ordersNew.value[0]; return }
    if (ordersAccepted.value.length > 0) { fullOrder.value = ordersAccepted.value[0]; return }
    if (ordersCooking.value.length > 0) { fullOrder.value = ordersCooking.value[0]; return }
    if (ordersPacking.value.length > 0) { fullOrder.value = ordersPacking.value[0]; return }
    if (ordersWaitingCourier.value.length > 0) { fullOrder.value = ordersWaitingCourier.value[0]; return }
    if (ordersInTransit.value.length > 0) { fullOrder.value = ordersInTransit.value[0]; return }
    if (ordersAwaitingPickup.value.length > 0) { fullOrder.value = ordersAwaitingPickup.value[0]; return }
}

watch(fullOrder, () => {
    if (fullOrder.value == null) {
        setFullOrderByDefault()
    }
})

watch(ordersToday, () => {
    if (fullOrder.value == null) {
        setFullOrderByDefault()
    }

    else fullOrder.value = ordersToday.value.find(item => item.id == fullOrder.value.id)
})

export const blockOrderActions = reactive({})

export async function nextStatus(order) {
    if (blockOrderActions[order.id]) return
    if (order.order_status === ORDER_STATUS.COMPLETED) return
    if (order.order_status === ORDER_STATUS.CANSEL) return

    blockOrderActions[order.id] = true

    try {
        await axios.patch(`/orders/${order.id}/next-status`)
        await loadOrdersToday()

        //закрываем окно для отображения заказа после его завершения
        if (order.id === fullOrder.value.id && fullOrder.value.order_status === ORDER_STATUS.COMPLETED) {
            fullOrder.value = null
        }

    } catch (error) {
        console.log(error)
    }

    blockOrderActions[order.id] = false
}

export async function previousStatus(order) {
    if (blockOrderActions[order.id]) return
    if (order.order_status === ORDER_STATUS.CREATED) return

    blockOrderActions[order.id] = true

    try {
        await axios.patch(`/orders/${order.id}/previous-status`)
        await loadOrdersToday()
    } catch (error) {
        console.log(error)
    }

    blockOrderActions[order.id] = false
}

export async function setCanselStatus(order) {
    if (blockOrderActions[order.id]) return
    if (order.order_status === ORDER_STATUS.COMPLETED) return
    if (order.order_status === ORDER_STATUS.CANSEL) return

    blockOrderActions[order.id] = true

    try {
        await axios.patch(`/orders/${order.id}/cansel-status`)
        await loadOrdersToday()
    } catch (error) {
        console.log(error)
    }

    blockOrderActions[order.id] = false
}
