<script setup>
import { dialogMiniIsVisible, dialogMiniTextArray } from '/src/store/client/block/dialog-mini'

</script>

<template>

    <div v-if="dialogMiniIsVisible"
         @click="dialogMiniIsVisible = false"
         class="dialog-mini-overlay">

        <div class="dialog-mini"
             @click.stop>

            <div class="dialog-mini__text">
                <p v-for="text in dialogMiniTextArray">{{ text }}</p>
            </div>

            <button class="btn btn-submit"
                    @click="dialogMiniIsVisible = false">
                Закрыть
            </button>

        </div>

    </div>

</template>

<style scoped>
.dialog-mini-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-mini {
    background: var(--background_page_elements_color);
    padding: 20px;
    border-radius: 5px;
    width: 320px;
    text-align: center;
}

.dialog-mini__text {
    margin-bottom: 15px;
}
</style>