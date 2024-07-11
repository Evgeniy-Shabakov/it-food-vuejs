import { ref, reactive, onMounted, onUnmounted, watch, defineProps } from 'vue'
import axios from 'axios'

import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { loadOrdersToday } from '/src/store/loading-helper.js'
import {
    ordersNew, ordersAccepted, ordersCooking, ordersPacking, 
    ordersWaitingCourier, ordersInTransit, ordersAwaitingPickup,
} from '/src/store/order-manager/order-manager-helper.js'
import { ordersToday } from '/src/store/axios-helper.js'

export const currentOrder = ref(null)

watch(ordersToday, () => {
    if (currentOrder.value == null) {
        if (ordersNew.value.length > 0) { currentOrder.value = ordersNew.value[0]; return }
        if (ordersAccepted.value.length > 0) { currentOrder.value = ordersAccepted.value[0]; return }
        if (ordersCooking.value.length > 0) { currentOrder.value = ordersCooking.value[0]; return }
        if (ordersPacking.value.length > 0) { currentOrder.value = ordersPacking.value[0]; return }
        if (ordersWaitingCourier.value.length > 0) { currentOrder.value = ordersWaitingCourier.value[0]; return }
        if (ordersInTransit.value.length > 0) { currentOrder.value = ordersInTransit.value[0]; return }
        if (ordersAwaitingPickup.value.length > 0) { currentOrder.value = ordersAwaitingPickup.value[0]; return }
    }

    else { //обновляем данные в панели заказа
        currentOrder.value = ordersToday.value.find(item => item.id == currentOrder.value.id)
    }
})

export const blockNextStatus = reactive({})

export async function nextStatus(order) {
    if (blockNextStatus[order.id]) return
    if (order.order_status === ORDER_STATUS.COMPLETED) return

    blockNextStatus[order.id] = true

    try {
        await axios.patch(`/orders/${order.id}/next-status`)
        await loadOrdersToday()
    } catch (error) {
        console.log(error)
    }

    blockNextStatus[order.id] = false
}
