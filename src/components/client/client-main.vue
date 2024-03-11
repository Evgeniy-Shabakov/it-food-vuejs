<script setup>
import { totalCountInCart } from '/src/store/client-helper.js'
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { categories, getModelsAxios } from '/src/store/axios-helper.js'
import { productsInCart } from '/src/store/client-helper.js'

if (categories.value == null) getModelsAxios('categories')
  .then(() => {
    //убираем из списка неактивные продукты и пустые категории чтобы не отображались
    categories.value.forEach(category => {
      category.products = category.products.filter(product => product.is_active == true)
    })
    categories.value = categories.value.filter(category => category.products.length > 0)

    //обновляем массив для корзины, если есть данные в localStorage
    if (localStorage.getItem('cart') != null) {
      let oldProductsInCart = JSON.parse(localStorage.getItem('cart'))
      oldProductsInCart.forEach(el => {
        categories.value.forEach(category => {
          category.products.forEach(product => {
            if (product.id == el.id) {
              product.countInCart = el.countInCart
              productsInCart.value.push(product)
            }
          })
        })
      })
    }
  })

//открытие и закрытие панели заказа - СТАРТ
const orderPanel = ref(null)
const orderPanelBackdrop = ref(null)

function openOrderPanel() {
  if (window.getComputedStyle(orderPanel.value).display != 'none') return

  orderPanelBackdrop.value.style.display = 'block'
  orderPanel.value.show()
  document.body.classList.add('order-panel-lock-scroll')

  setTimeout(() => {
    document.addEventListener('click', checkClickAndCloseOrderPanel)
  }, 100)
}

function closeOrderPanel() {
  document.body.classList.remove('order-panel-lock-scroll')
  orderPanelBackdrop.value.style.display = 'none'
  if (orderPanel.value) orderPanel.value.close()

  document.removeEventListener('click', checkClickAndCloseOrderPanel)
}

function checkClickAndCloseOrderPanel(e) {
  if (e.composedPath().includes(orderPanel.value)) return //если клик по панели, то ничего не делать
  else closeOrderPanel()
}
//открытие и закрытие панели заказа - СТОП
</script>

<template>
  <router-view @btn-order-pressed="openOrderPanel()"></router-view>

  <div class="order-panel-backdrop" ref="orderPanelBackdrop">
    <dialog class="order-panel" ref="orderPanel">
      Привет мир!
    </dialog>
  </div>

  <div class="bottom-device-menu">
    <div class="container">
      <div class="bottom-device-menu__inner">
        <router-link v-if="useRoute().name != 'client.menu'" :to="{ name: 'client.menu' }"><i
            class="fa-regular fa-circle-up bottom-device-menu__icon"></i></router-link>
        <a v-else href="#"><i class="fa-regular fa-circle-up bottom-device-menu__icon"></i></a>
        <a><i class="fa-solid fa-user bottom-device-menu__icon"></i></a>
        <router-link :to="{ name: 'client.cart' }"><i class="fa-solid fa-cart-shopping bottom-device-menu__icon">
            <div v-if="totalCountInCart" class="bottom-device-menu__product-count-in-cart">
              {{ totalCountInCart }}
            </div>
          </i>
        </router-link>
      </div>
    </div>
  </div>
</template>
