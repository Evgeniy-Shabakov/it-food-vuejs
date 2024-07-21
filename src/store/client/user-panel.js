import { getActiveOrdersForUser } from '/src/store/axios-helper.js'

//загрузка статусов активных заказов через запрос в бэк - START
export let intervalLoadActiveOrders

export async function loadActiveOrdersForUserAndRestartInterval(userID) {
    clearInterval(intervalLoadActiveOrders)

    await getActiveOrdersForUser(userID)

    intervalLoadActiveOrders = setInterval(() => {
        getActiveOrdersForUser(userID)
    }, 30000)
}
//загрузка статусов активных заказов через запрос в бэк - END