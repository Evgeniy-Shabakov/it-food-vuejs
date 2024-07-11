import { ref, reactive, onMounted, onUnmounted, watch, defineProps } from 'vue'
import axios from 'axios'

import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { loadOrdersToday } from '/src/store/loading-helper.js'

export const currentOrder = ref(null)

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
