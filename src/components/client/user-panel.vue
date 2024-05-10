<script setup>
import { watch } from 'vue';
import router from "/src/router.js"
import { currentAuthenticatedUser, logout } from '/src/store/axios-helper.js'

watch(currentAuthenticatedUser, () => {
  if (currentAuthenticatedUser.value == null) {
    router.push({ name: 'client.menu' })
  }
})

</script>

<template>
    <div v-if="currentAuthenticatedUser">
        <p>{{ currentAuthenticatedUser.name }}</p>
        <p>{{ currentAuthenticatedUser.phone }}</p>
    </div>
    <button @click.prevent="logout()" class="">Выйти</button>
</template>
