<script setup>
import { onMounted, ref, watch } from 'vue';
import { inputedPhone } from '/src/store/login-panel-helper.js'
import IMask from 'imask';

const fieldInputPhone = ref()

watch(inputedPhone, () => {
    if (inputedPhone.value.length == 15) {
        fieldInputPhone.value.blur()
    }
})

onMounted(() => {
    const maskOptions = {
        mask: '(000) 000-00-00'
    };
    const mask = IMask(fieldInputPhone.value, maskOptions);

    if (inputedPhone.value.length < 15)
        fieldInputPhone.value.focus()
})

</script>

<template>

    <div class="phone-input">
        <span class="phone-input__code">+7</span>
        <input ref="fieldInputPhone" v-model="inputedPhone" type="tel" class="phone-input__phone"
            placeholder="(000) 000-00-00" />
    </div>

</template>
