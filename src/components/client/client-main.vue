<script setup>
import { ref, onMounted } from 'vue';
import { company, categories, getModelAxios, getModelsAxios } from '/src/store/axios-helper.js'

getModelAxios('companies', 1)
getModelsAxios('categories')

const btnBurgerMenu = ref(null)
const burgerMenu = ref(null)

onMounted(() => {
  burgerMenu.value.hidden = true

  btnBurgerMenu.value.addEventListener('click', function () {
    if (burgerMenu.value.hidden) burgerMenu.value.hidden = false
    else burgerMenu.value.hidden = true
  })

  document.addEventListener('click', function (event) {
    if (btnBurgerMenu.value.contains(event.target)) return

    if (!burgerMenu.value.contains(event.target)) {
      burgerMenu.value.hidden = true
    }
  })

  window.onscroll = function () {
    if (burgerMenu.value.hidden) return
    burgerMenu.value.hidden = true
  }
})

</script>

<template>
  <div class="info">
    <div class="container">
      <div class="info__inner">
        <a class="info__item" href="#">О нас</a>
        <a class="info__item" href="#">Контакты</a>
      </div>
    </div>
  </div>

  <header class="header">
    <div class="container">
      <div class="header__inner">
        <div class="header__inner__left">
          <img v-if="company" class="header__logo" :src="company.logo_url" alt="">
          <div>
            <h1 v-if="company" class="header__company-name">{{ company.brand_title }}</h1>
            <div v-if="company" class="header__tagline">{{ company.tagline }}</div>
          </div>
        </div>
        <div class="header__inner__right">
          <button class="header__button">Войти</button>
          <button ref="btnBurgerMenu" class="header__btn-burger-menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>
  </header>

  <nav ref="burgerMenu" class="burger-menu">
    <div class="container">
      <div class="burger-menu__inner">
        <a class="burger-menu__item" href="#">Москва (изменить город)</a>
        <a class="burger-menu__item" href="#">Войти</a>
        <a class="burger-menu__item" href="#">О нас</a>
        <a class="burger-menu__item" href="#">Контакты</a>
      </div>
    </div>
  </nav>

  <nav class="categories">
    <div class="container">
      <div class="categories__inner">
        <a v-for="category in categories" class="categories__item" href="#">{{ category.title }}</a>
      </div>
    </div>
  </nav>

  <button class="btn-cart">
    <i class="fa-solid fa-cart-shopping btn-cart-icon"></i>Корзина
  </button>

  <div class="content">
    <div class="container">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis odio repellendus rerum soluta
      perferendis aut
      deserunt veritatis at, labore praesentium sint exercitationem expedita saepe quisquam nobis nihil quo! Itaque
      consectetur vero quisquam, id architecto mollitia dicta necessitatibus placeat nam molestiae at nemo tempora ea
      officiis, dolorum commodi ad. Ut numquam voluptates suscipit voluptate repudiandae iusto, quia laudantium minus ea
      cupiditate repellat velit aut, saepe sit, dolor id dignissimos modi neque consequatur distinctio. Velit sed
      reiciendis, saepe nihil incidunt possimus nulla temporibus in adipisci tempore dignissimos ipsa, iure quo! Et quasi
      velit maiores, ullam rerum corrupti odio accusantium, facere blanditiis accusamus atque ratione neque eius sequi
      possimus perspiciatis saepe eos cupiditate autem sapiente quidem iste. Est doloribus aspernatur deleniti id
      voluptatem
      sed harum praesentium eligendi repudiandae nobis ipsa rerum ratione, optio officia, perferendis accusantium atque
      eos
      accusamus, reprehenderit dolores. Totam accusantium officiis distinctio quas odio excepturi, explicabo qui nesciunt,
      reprehenderit, vitae necessitatibus delectus consequuntur recusandae ducimus nobis architecto velit eligendi ullam
      sed
      ratione magni doloremque repudiandae placeat quo? Quisquam temporibus, maxime ratione autem accusantium itaque,
      corporis reprehenderit earum fugit tempora, vero dolorum culpa nihil expedita quos error quae a. Minima distinctio
      atque voluptate iure itaque, culpa sit? Dignissimos officia modi repellendus excepturi? Voluptatum cupiditate quis
      quisquam minus laboriosam ullam laudantium neque modi. Facere eveniet repellendus quos in ea ipsam veritatis
      recusandae neque ipsa voluptatem pariatur, enim suscipit sint, accusamus blanditiis omnis aut quam fuga laborum
      aspernatur repellat doloremque voluptates adipisci! Enim similique ullam id corrupti accusantium recusandae
      asperiores
      molestiae vel. Temporibus necessitatibus corrupti, illum esse at nam quis est odio asperiores optio deserunt eveniet
      voluptates suscipit voluptate neque aspernatur perferendis nihil cupiditate vero aliquid ipsam mollitia tenetur.
      Aspernatur non dicta incidunt nemo ratione culpa quia modi quasi velit. Delectus autem tenetur, dolorum ipsa nisi
      blanditiis quis hic eum, aliquam vitae assumenda, eaque libero illo neque. Delectus, sed, voluptatem dolores
      assumenda
      ipsam alias facere eaque dolorum voluptate magnam quis doloribus, quaerat corporis nesciunt dicta eum? Ullam nam
      ipsa
      earum, rerum labore similique repudiandae quis repellendus vitae quibusdam laborum, est, nesciunt reiciendis maxime
      veritatis. Quo maiores perspiciatis aut reiciendis quae eveniet, ad quas alias, culpa repellendus aspernatur sint
      soluta id vitae eum? Consectetur architecto dolorum provident accusantium, fugit ab rem quisquam minima aperiam
      corporis rerum soluta quod mollitia ea iste excepturi earum asperiores, suscipit corrupti sapiente consequuntur
      reiciendis maxime aut! Officia reprehenderit ipsa voluptatibus quibusdam corporis fuga, itaque non officiis,
      molestiae
      dolorem illo dolores explicabo? Mollitia culpa, reiciendis, molestias repudiandae itaque ex ipsa voluptatibus velit
      obcaecati illum quasi tempora sapiente voluptatum. Magni inventore quo sunt. Placeat perferendis a aliquid vitae
      nobis
      dolore minus! Repellat eum facilis vero velit voluptas? Quae magni sit, voluptatem fuga iure rem sed, quo earum
      ratione deserunt, consequuntur est reiciendis laudantium asperiores atque obcaecati sint nihil animi quas saepe.
      Porro
      culpa commodi adipisci eos quam consectetur quis sequi exercitationem, necessitatibus quos voluptatem consequatur
      quia
      iusto officia nesciunt illo facere non labore ex obcaecati dicta? Alias quisquam dolorum corporis omnis corrupti ea
      doloremque veniam? Maxime ipsa quasi temporibus numquam blanditiis.
    </div>
  </div>
</template>

