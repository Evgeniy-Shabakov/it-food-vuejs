<script setup>
import { ref, onMounted } from 'vue'

import { ORDER_STATUS } from '/src/store/data-types/order-status'
import { ORDER_TYPE } from '/src/store/data-types/order-type'
import {
    fullOrder, blockOrderActions, nextStatus, previousStatus, setCanselStatus
} from '/src/store/order-manager/order-manager-order-helper.js'

function actionForClose() {
    fullOrder.value = null
}

//выпадающее меню - START 
const btnActionsMenu = ref(null)
const actionsMenu = ref(null)

onMounted(() => {
    actionsMenu.value.hidden = true

    btnActionsMenu.value.addEventListener('click', function () {
        if (actionsMenu.value.hidden) actionsMenu.value.hidden = false
        else actionsMenu.value.hidden = true
    })

    document.addEventListener('click', function (event) {
        if (actionsMenu.value == null) return
        if (btnActionsMenu.value.contains(event.target)) return

        if (!actionsMenu.value.contains(event.target)) {
            actionsMenu.value.hidden = true
        }
    })

    window.onscroll = function () {
        if (actionsMenu.value == null) return
        if (actionsMenu.value.hidden) return
        actionsMenu.value.hidden = true
    }
})
//выпадающее меню - END 

</script>

<template>

    <div class="order-manager-full-order">

        <div class="order-manager-full-order__data">
            <span class="order-manager-full-order__number">№{{ fullOrder.number }}</span>

            <span class="order-manager-full-order__type"> - {{ fullOrder.order_type }}</span>

            <div class="order-manager-full-order__status"> ({{ fullOrder.order_status }})</div>

            <p class="order-manager-full-order__time">
                Время оформления -
                {{ new Date(fullOrder.created_at).toLocaleTimeString() }}
                {{ new Date(fullOrder.created_at).toLocaleDateString() }}
            </p>

            <div v-if="fullOrder.comment" class="order-manager-full-order__comment">
                Комментарий:
                <span class="order-manager-full-order__comment_text">{{ fullOrder.comment }}
                </span>
            </div>

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

            <div class="order-manager-full__block__total">
                <p>Товары:</p>
                <p class="">{{ fullOrder.total_products_price }}р.</p>
                <p>Доставка:</p>
                <p class="">{{ fullOrder.delivery_price }}р.</p>
                <p>Итого:</p>
                <p class="order-manager-full-order__total">{{ fullOrder.total_price }}р.</p>
            </div>

            <div class="order-manager-full__phone">
                Телефон: {{ fullOrder.user.phone }}
            </div>

            <div v-if="fullOrder.order_type == ORDER_TYPE.delivery" class="order-manager-full__address">

                <span>Адрес: </span>
                {{ fullOrder.user_address.city.title }},
                {{ fullOrder.user_address.street }}
                {{ fullOrder.user_address.house_number }}
                <span v-if="fullOrder.user_address.corps_number">/ {{ fullOrder.user_address.corps_number
                    }}</span>
                <span v-if="fullOrder.user_address.apartment_number"> - {{
                    fullOrder.user_address.apartment_number }}</span>
                <span>, подьезд: {{ fullOrder.user_address.entrance_number }}, </span>
                <span>этаж: {{ fullOrder.user_address.floor }}</span>
                <span v-if="fullOrder.user_address.entrance_code">
                    , код подьезда: {{ fullOrder.user_address.entrance_code }}
                </span>
                <div v-if="fullOrder.user_address.comment" class="order-manager-full__address__comment">
                    Комментарий: {{ fullOrder.user_address.comment }}
                </div>

            </div>

            <div v-else class="order-manager-full__address">
                <span>
                    Ресторан: {{ fullOrder.restaurant.title }}
                    ({{ fullOrder.restaurant.street }}
                    -
                    {{ fullOrder.restaurant.house_number }})
                    <!-- добавить корпус при условии -->
                </span>

                <div v-if="fullOrder.order_type == ORDER_TYPE.inRestaurant">
                    Тип подачи:
                    <template v-if="fullOrder.table_number">
                        Принести к столику № {{ fullOrder.table_number }}
                    </template>
                    <template v-else>
                        Заберу сам
                    </template>
                </div>
            </div>


            <div class="order-manager-full__payment-data">
                <div> Тип оплаты: {{ fullOrder.payment_type }}</div>
                Статус оплаты:
                <span v-if="fullOrder.is_payment" class="order-manager-full__payment-data__payment">оплачен</span>
                <span v-else class="order-manager-full__payment-data__not-payment">не оплачен</span>
            </div>


            <div v-if="blockOrderActions[fullOrder.id]" class="spinner-centr-object">
                <div class="spinner"></div>
            </div>

        </div>

        <div class="order-manager-full-order__actions">

            <button class="order-manager-full-order__btn-next-status btn btn-submit"
                @click.prevent="previousStatus(fullOrder)">

                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <button
                v-if="fullOrder.order_status !== ORDER_STATUS.COMPLETED && fullOrder.order_status !== ORDER_STATUS.CANSEL"
                class="order-manager-full-order__btn-next-status btn btn-submit" @click.prevent="nextStatus(fullOrder)">

                <i class="fa-solid fa-arrow-right"></i>
            </button>

            <button ref="btnActionsMenu" class="order-manager-full-order__btn-actions-menu">
                Доп. действия

                <div ref="actionsMenu" class="order-manager-full-order__actions-menu">
                    <button class="order-manager-full-order__actions-menu__btn-cansel"
                        @click.prevent="setCanselStatus(fullOrder)">
                        Отменить заказ
                    </button>
                    <button class="order-manager-full-order__actions-menu__btn">
                        Редактировать заказ(неактивно)
                    </button>
                </div>
            </button>

        </div>

        <button class="order-manager-full-order__btn-close" @click.prevent="actionForClose()">
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>

</template>
