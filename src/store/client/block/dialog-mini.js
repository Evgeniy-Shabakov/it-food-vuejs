import { ref } from 'vue'

export const dialogMiniIsVisible = ref(false)
export const dialogMiniTextArray = ref([])

export function activateDialogMini(textArray) {
    dialogMiniIsVisible.value = true
    dialogMiniTextArray.value = textArray
}