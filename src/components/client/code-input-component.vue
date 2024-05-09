<script setup>
import { onMounted, ref, watch } from 'vue';
import { inputedCode } from '/src/store/client-helper.js'
import IMask from 'imask';

const fieldInputCode = ref()

watch(inputedCode, () => {
    if (inputedCode.value.length === 4) {
        fieldInputCode.value.blur()
    }
})

onMounted(() => {
    const maskOptions = {
        mask: '0000'
    };
    const mask = IMask(fieldInputCode.value, maskOptions);

    if (inputedCode.value.length < 4)
    fieldInputCode.value.focus()
})

</script>

<template>

    <div class="phone-input">
        <input ref="fieldInputCode" v-model="inputedCode" type="tel" size="1" class="phone-input__phone"
            placeholder="0000" />
    </div>

</template>
