<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

import router from "/src/router.js"
import { authUser } from '/src/store/axios-helper.js'
import { userAddresses, addressForEditing } from '/src/store/client/popup-pages/address-index.js'

const userCities = computed(() => {
    const array = []

    userAddresses.value.forEach(address => {
        array.push(address.city.title)
    })

    return [...new Set(array)] //удаляем повторяющиеся города
})

const actionAllowed = ref(true)


function openAddAddressPanel() {
    router.push({ name: 'client.menu.popup.address-create' })
}

function openAddressEdit(address) {
    addressForEditing.value = address
    router.push({ name: 'client.menu.popup.address-edit', params: { id: address.id } })
}

async function deleteAddress(id) {
    if (actionAllowed.value == false) return

    actionAllowed.value = false

    await axios
        .delete(`/users/${authUser.value.id}/addresses/${id}`)
        .then(res => {
            authUser.value = res.data.data
        })
        .catch(err => {
            console.log(err);
        })

    actionAllowed.value = true
}

</script>

<template>

    <div class="client-popup-page-layout__main-section">

        <h1 class="client-popup-page-layout__h1">Адреса доставки</h1>


        <div v-if="authUser" class="address-index">

            <button @click.precent="openAddAddressPanel()" class="btn--secondary" type="button">
                Добавить новый адрес
            </button>

            <section v-for="city in userCities" class="address-index__city-section">

                <div class="address-index__city-title">{{ city }}</div>

                <template v-for="address in userAddresses">
                    <template v-if="city === address.city.title">

                        <div class="address-index__address-item">

                            <div class="address-index__address-item-address-text">

                                <div v-if="address.title" class="address-index__address-item-title">
                                    {{ address.title }}
                                </div>
                                {{ address.street }}
                                {{ address.house_number }}
                                <template v-if="address.corps_number">
                                    / {{ address.corps_number }}
                                </template>
                                <template v-if="address.apartment_number">
                                    - {{ address.apartment_number }}
                                </template>

                            </div>

                            <div class="address-index__address-item-btns">
                                <button @click.prevent="deleteAddress(address.id)" class="btn--secondary" type="button">
                                    Удалить
                                </button>
                                <button @click.prevent="openAddressEdit(address)" class="btn--secondary" type="button">
                                    Редактировать
                                </button>
                            </div>

                        </div>

                    </template>
                </template>


            </section>

            <div v-if="actionAllowed == false" class="spinner-centr-display">
                <div class="spinner"></div>
            </div>

        </div>

        <div v-else class="spinner-centr-display">
            <div class="spinner"></div>
        </div>


    </div>

    <div class="client-popup-page-layout__btn-section">
        <router-link :to="{ name: 'client.menu.popup.user-panel' }" class="client-popup-page-layout__btn-w-100">
            <button @click="" class="btn btn-submit client-popup-page-layout__btn-w-100">
                Назад
            </button>
        </router-link>
    </div>

</template>
