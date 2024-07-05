<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, defineProps } from 'vue';

const { order } = defineProps(['order'])

</script>

<template>
    <div class="order-manager-mini-order">
        <p class="order-manager-mini-order__number">{{ order.number }}</p>
        <p class="">{{ order.order_type }}</p>
        <p class="">{{ new Date(order.created_at).toLocaleTimeString() }}</p>
        <p class="">{{ order.total_price }}р.</p>
        <div class="order-manager-mini-order__btns-section">
            <button class="btn btn-submit"><i class="fa-solid fa-arrow-left"></i></button>
            <button class="btn btn-submit"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
    </div>
</template>
