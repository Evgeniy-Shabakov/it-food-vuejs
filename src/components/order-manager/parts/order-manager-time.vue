<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref(new Date().toLocaleTimeString())

let intervalTime
onMounted(() => {
    intervalTime = setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString()
    }, 1000)
})

onUnmounted(() => {
    clearInterval(intervalTime)
})

</script>

<template>
    <div>
        {{ currentTime }}
    </div>
</template>
