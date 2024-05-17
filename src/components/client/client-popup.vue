<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const popupWindowBackdrop = ref(null)
const popupWindow = ref(null)

onMounted(() => {
  document.body.classList.add('popup-lock-scroll')
  popupWindowBackdrop.value.addEventListener('click', checkClickAndClosePopup)
})

onBeforeUnmount(() => {
  document.body.classList.remove('popup-lock-scroll')
  popupWindowBackdrop.value.removeEventListener('click', checkClickAndClosePopup)
})

//выход из панели заказа при клике вне панели заказа
function checkClickAndClosePopup(e) {
  if (e.composedPath().includes(popupWindow.value)) return //если клик по панели, то ничего не делать

  router.push({ name: 'client.menu' })
}

</script>

<template>
  <div class="popup-backdrop" ref="popupWindowBackdrop">
    <div class="popup" ref="popupWindow">
      <button class="popup__btn-close" @click.prevent="router.push({ name: 'client.menu' })"><i class="fa-solid fa-xmark"></i></button>

      <router-view></router-view>

    </div>
  </div>
</template>
