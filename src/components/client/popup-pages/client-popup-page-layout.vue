<script setup>
import { onMounted, onBeforeUnmount, ref, onUpdated } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const popupWindowBackdrop = ref(null)
const popupWindow = ref(null)

onUpdated(() => {
  //смещаем скролл внутри popup при каждом обновлении 
  //нужно для перехода от формления заказа к статусу заказа на мобиле
  popupWindow.value.scrollTop = 0
})

onMounted(() => {
  document.body.classList.add('client-popup-page-layout-lock-scroll')
  popupWindowBackdrop.value.addEventListener('click', checkClickAndClosePopup)
})

onBeforeUnmount(() => {
  document.body.classList.remove('client-popup-page-layout-lock-scroll')
  popupWindowBackdrop.value.removeEventListener('click', checkClickAndClosePopup)
})

//выход из панели заказа при клике вне панели заказа
function checkClickAndClosePopup(e) {
  if (e.composedPath().includes(popupWindow.value)) return //если клик по панели, то ничего не делать

  router.push({ name: 'client.menu' })
}

</script>

<template>
  <div class="client-popup-page-layout-backdrop" ref="popupWindowBackdrop">
    <div class="client-popup-page-layout" ref="popupWindow">

      <button class="client-popup-page-layout__btn-close" @click.prevent="router.push({ name: 'client.menu' })">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <router-view></router-view>

    </div>

  </div>
</template>
