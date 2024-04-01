<script setup>
import { onMounted, ref } from 'vue';
import { totalPrice } from '/src/store/client-helper.js'
import { useRouter } from 'vue-router';

const router = useRouter()

const popupWindow = ref(null)

onMounted(() => {
  document.body.classList.add('popup-lock-scroll')

  setTimeout(() => {
    document.addEventListener('click', checkClickAndClosePopup)
  }, 100)
})

//выход из панели заказа при клике вне панели заказа
function checkClickAndClosePopup(e) {
  if (e.composedPath().includes(popupWindow.value)) return //если клик по панели, то ничего не делать
  else router.back()
}

//действия при выходе из панели заказа (клик вне панели, кнопка назад или клик по ссылке)
router.beforeEach((to, from, next) => {
  document.body.classList.remove('popup-lock-scroll')
  document.removeEventListener('click', checkClickAndClosePopup)

  next()
})
</script>

<template>
  <div class="popup-backdrop">
    <div class="popup" ref="popupWindow">
      <button class="popup__btn-close" @click.prevent="router.back()"><i class="fa-solid fa-xmark"></i></button>
      
      <router-view></router-view>
      
    </div>
  </div>
</template>
