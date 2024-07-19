import { computed } from 'vue'

import { ordersToday } from '/src/store/axios-helper.js'
import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { loadOrdersToday } from '/src/store/loading-helper.js'

//загрузка ordersToday через запрос в бэк - START
export let intervalLoadOrders

export function restartLoadOrdersInterval(restaurantID) {
    clearInterval(intervalLoadOrders)
    
    intervalLoadOrders = setInterval(() => {
        loadOrdersToday(restaurantID)
    }, 15000)
}
//загрузка ordersToday через запрос в бэк - END


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

export const ordersCompletedOrCansel = computed(() => {
    if (ordersToday.value)
        return ordersToday.value
            .filter(order => order.order_status === ORDER_STATUS.COMPLETED ||
                order.order_status === ORDER_STATUS.CANSEL)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
})

