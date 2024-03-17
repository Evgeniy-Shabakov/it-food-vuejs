<script setup>
import { onMounted, ref } from 'vue';
import { totalPrice } from '/src/store/client-helper.js'
import { useRouter } from 'vue-router';

const router = useRouter()

const orderPanel = ref(null)

onMounted(() => {
  document.body.classList.add('order-panel-lock-scroll')

  setTimeout(() => {
    document.addEventListener('click', checkClickAndCloseOrderPanel)
  }, 100)
})

//выход из панели заказа при клике вне панели заказа
function checkClickAndCloseOrderPanel(e) {
  if (e.composedPath().includes(orderPanel.value)) return //если клик по панели, то ничего не делать
  else router.back()
}

//действия при выходе из панели заказа (клик вне панели, кнопка назад или клик по ссылке)
router.beforeEach((to, from, next) => {
  document.body.classList.remove('order-panel-lock-scroll')
  document.removeEventListener('click', checkClickAndCloseOrderPanel)

  next()
})
</script>

<template>
  <div class="order-panel-backdrop">
    <div class="order-panel" ref="orderPanel">
      <h3 class="order-panel__title">Оформление заказа</h3>
      <div class="order-panel__form">
        <div>
          <label class="order-panel__label">Адрес</label>
          <input class="order-panel__adress" type="adress" placeholder="Введите адрес">

          <label class="order-panel__label">Телефон</label>
          <input class="order-panel__phone" type="phone" placeholder="Введите номер телефона">
        </div>

        <button class="order-panel__btn-order">ОФОРМИТЬ ЗА {{ totalPrice }}р.</button>
      </div>
      <button class="order-panel__btn-close" @click.prevent="router.back()"><i class="fa-solid fa-xmark"></i></button>
    </div>
  </div>
</template>
