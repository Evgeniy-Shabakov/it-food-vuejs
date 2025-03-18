<script setup>
import {
   ordersNew, ordersAccepted, ordersCooking, ordersPacking, ordersWaitingCourier, ordersInTransit,
   ordersAwaitingPickup, ordersCompletedOrCansel
} from '/src/store/order-manager/order-manager-helper.js'
import { fullOrder } from '/src/store/order-manager/order-manager-order-helper.js'

import MiniOrder from '/src/components/order-manager/components/order-manager-mini-order.vue'
import FullOrder from '/src/components/order-manager/components/order-manager-full-order.vue'

</script>

<template>
   <main class="order-manager-main__main">

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Новые заказы</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersNew"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Принятые в работу</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersAccepted"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Готовятся</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersCooking"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Собираются</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersPacking"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Ожидают курьера</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersWaitingCourier"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">В пути</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersInTransit"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Готов и ожидает выдачи</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersAwaitingPickup"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <section class="order-manager-main__status-column">
         <h4 class="order-manager-main__status-column__header">Завершен</h4>
         <div class="order-manager-main__status-column__main">
            <mini-order v-for="order in ordersCompletedOrCansel"
                        :key="order.id"
                        :order="order"></mini-order>
         </div>
      </section>

      <full-order v-if="fullOrder"></full-order>
      <div v-else
           class="order-manager-main__full-order-description">
         <p>Нет ни одного активного заказа.</p>
         <p>Если появится активный заказ, он отобразится автоматически.</p>
         <p>Кликните на заказ, чтобы отобразить его данные.</p>
      </div>

   </main>
</template>

<style scoped>
.order-manager-main__main {
   flex: 1;
   overflow-x: hidden;

   display: flex;
   gap: 2px;
}

.order-manager-main__status-column {
   min-width: 9%;
   max-width: 9%;
   height: 100%;
   overflow-x: hidden;

   display: flex;
   flex-direction: column;
}

.order-manager-main__order-full-column {
   flex: 1;
   height: 100%;
   overflow-x: hidden;
}

.order-manager-main__status-column__header {
   background-color: rgba(72, 48, 212, 0.5);
   height: 10%;
   text-align: center;
   padding: 5px;
   display: grid;
   align-items: center;
   font-size: 16px;
}

.order-manager-main__status-column__main {
   background-color: rgba(255, 166, 0, 0.5);
   flex: 1;
   overflow-x: hidden;
   padding: 5px;
}

.order-manager-main__full-order-description {
   text-align: center;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   gap: 15px;
}
</style>