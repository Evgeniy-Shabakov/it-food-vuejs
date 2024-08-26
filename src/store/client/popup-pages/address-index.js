import { ref, computed } from 'vue'

import { authUser } from '/src/store/axios-helper.js'

export const addressForEditing = ref(null)

export const userAddresses = computed(() => 
    authUser.value.addresses.filter(address => address.show_to_user == true)
)