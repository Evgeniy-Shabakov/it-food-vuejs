<script setup>
import { onMounted, ref, watch } from 'vue';
import { inputedCode } from '/src/store/login-panel-helper.js'
import IMask from 'imask';

const fieldInputCode = ref()

watch(inputedCode, () => {
    if (inputedCode.value.length < 4)
        fieldInputCode.value.focus()

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

    <div class="code-input">
        <input ref="fieldInputCode" v-model="inputedCode" type="tel" maxlength="4" class="code-input__code" placeholder="0000" />
    </div>

</template>
