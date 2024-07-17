import { ref } from 'vue';

export const currentTimezone = ref(getTimeZone())

function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone; 
}