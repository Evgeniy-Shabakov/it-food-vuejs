import { computed } from 'vue'

import { ordersToday } from '/src/store/axios-helper.js'
import { ORDER_STATUS } from '/src/store/data-types/order-status'

export const ordersNew = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.CREATED)
})

export const ordersAccepted = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.ACCEPTED)
})

export const ordersCooking = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.COOKING)
})

export const ordersPacking = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.PACKING)
})

export const ordersWaitingCourier = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.WAITING_COURIER)
})

export const ordersInTransit = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.IN_TRANSIT)
})

export const ordersAwaitingPickup = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.AWAITING_PICKUP)
})

export const ordersCompleted = computed(() => {
    if (ordersToday.value)
        return ordersToday.value.filter(order => order.order_status === ORDER_STATUS.COMPLETED)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
})

