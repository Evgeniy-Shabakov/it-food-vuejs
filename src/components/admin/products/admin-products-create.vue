<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { categories, ingredients, textLoadOrFailForVue, storeModelAxios } from '/src/store/axios-helper.js'
import { LOADING_TYPE } from '/src/store/data-types/loading-type.js'
import { loadCategories, loadIngredients } from '/src/store/loading-helper.js'
import { transformValidateErrorsForUI } from '/src/store/validation-helper.js'

let dataForComponentLoadingType = ref(LOADING_TYPE.loading)

const fieldInputTitle = ref(null)

const addingBaseIngredientsDialog = ref()
const replacementsIngredientDialog = ref()

const productInputedData = reactive({
  initialize(categoryId) {
    this.title = ''
    this.category_id = categoryId
    this.image_file = null
    this.description_short = ''
    this.description_full = ''
    this.price_default = null
    this.base_ingredients = []
    this.additional_ingredients = []
    this.is_active = false
  }
})

const baseIngredientInputedData = reactive({
  initialize() {
    this.ingredient = 0
    this.can_delete = false
    this.can_replace = false
    this.replacements_ids = []
  }
})

watch(() => baseIngredientInputedData.ingredient, (newValue, oldValue) => {
  if (newValue)
    baseIngredientInputedData.replacements_ids = [...newValue.replacements].map(obj => obj.id)
})

baseIngredientInputedData.initialize()

function addBaseIngredient() {
  if (!baseIngredientInputedData.ingredient) return

  productInputedData.base_ingredients.push({
    ingredient: baseIngredientInputedData.ingredient,
    can_delete: baseIngredientInputedData.can_delete,
    can_replace: baseIngredientInputedData.can_replace,
    replacements_ids: baseIngredientInputedData.replacements_ids
  }
  )

  baseIngredientInputedData.initialize()
  addingBaseIngredientsDialog.value.close()
}

function deleteBaseIngredient(id) {
  const index = productInputedData.base_ingredients.findIndex(obj => obj.ingredient.id === id)
  if (index !== -1) { // Проверяем, найден ли объект
    productInputedData.base_ingredients.splice(index, 1); // Удаляем объект из массива
  }
}

const imageUrl = computed(() => {
  if (productInputedData.image_file) return URL.createObjectURL(productInputedData.image_file)
  else return '/src/assets/images/image_empty.png'
})

const validationErrors = ref({})

const textDone = ref(null)


onMounted(async () => {
  dataForComponentLoadingType.value = await loadCategories()
  dataForComponentLoadingType.value = await loadIngredients()
  dataForComponentLoadingType.value = await loadIngredients()

  if (dataForComponentLoadingType.value === LOADING_TYPE.error) return

  if (categories.value.length == 0) {
    alert('Сначала добавьте категории')
    router.push({ name: 'admin.categories.create' })
    return
  }

  productInputedData.initialize(categories.value[0].id)

  fieldInputTitle.value.focus()
})

function storeProduct() {
  validationErrors.value = {}
  textDone.value = null

  const formData = new FormData();

  formData.append("title", productInputedData.title);
  formData.append("category_id", productInputedData.category_id);
  if (productInputedData.image_file) formData.append("image_file", productInputedData.image_file); //без условия не видит валидацию required в Ларавел
  formData.append("description_short", productInputedData.description_short);
  formData.append("description_full", productInputedData.description_full);
  if (productInputedData.price_default) formData.append("price_default", productInputedData.price_default); //без условия не видит валидацию required в Ларавел

  productInputedData.base_ingredients.forEach((base_ingredient, index) => {
    formData.append(`base_ingredients[${index}][ingredient_id]`, base_ingredient.ingredient.id)
    formData.append(`base_ingredients[${index}][can_delete]`, base_ingredient.can_delete ? 1 : 0)
    formData.append(`base_ingredients[${index}][can_replace]`, base_ingredient.can_replace ? 1 : 0)
    base_ingredient.replacements_ids.forEach((id, idIndex) => {
      formData.append(`base_ingredients[${index}][replacements_ids][${idIndex}]`, id)
    })
  })

  formData.append("is_active", productInputedData.is_active ? 1 : 0)

  storeModelAxios('products', formData)
    .then(res => {
      productInputedData.initialize(productInputedData.category_id)
      document.getElementById('imageInput').value = '' //очищаем инпут чтобы реагировал на добавление той же картинки
      textDone.value = res.messageForVue.text
    })
    .catch(err => {
      validationErrors.value = err.response.data.errors
      transformValidateErrorsForUI(validationErrors.value)
    })
}

function imageFileChange(e) {
  productInputedData.image_file = e.target.files[0];
}

function changeImageBtnPressed() {
  document.getElementById('imageInput').click()
}

</script>

<template>

  <h2>Добавление товара</h2>

  <form v-show="categories && ingredients"
        class="admin-forms">

    <label class="required">Наименование</label>
    <input ref="fieldInputTitle"
           type="text"
           v-model="productInputedData.title"
           placeholder="Введите название товара"
           @click.prevent="validationErrors.title = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.title }}</div>

    <label class="required">Категория</label>
    <select v-model="productInputedData.category_id"
            @click.prevent="validationErrors.category_id = ''; textDone = ''">
      <option v-for="category in categories"
              :value="category.id">{{ category.title }}</option>
    </select>
    <div class="invalid-text">{{ validationErrors.category_id }}</div>

    <label class="required">Изображение</label>
    <div class="admin-forms__div-img-btn">
      <img class="admin-forms__div-img-btn__product"
           :src="imageUrl"
           alt="">
      <input type="file"
             @click="validationErrors.image_file = ''; textDone = ''"
             @change="imageFileChange"
             style="display:none;"
             id="imageInput"
             accept="image/*">
      <button id="admin-forms__div-img-btn__btn"
              class="btn btn-view"
              @click.prevent="changeImageBtnPressed">Добавить</button>
    </div>
    <div class="invalid-text">{{ validationErrors.image_file }}</div>

    <label>Короткое описание</label>
    <textarea v-model="productInputedData.description_short"
              placeholder="Введите короткое описание товара до 150 символов"
              @click.prevent="validationErrors.description_short = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_short }}</div>

    <label>Полное описание</label>
    <textarea v-model="productInputedData.description_full"
              placeholder="Введите полное описание товара до 1000 символов"
              @click.prevent="validationErrors.description_full = ''; textDone = ''"></textarea>
    <div class="invalid-text">{{ validationErrors.description_full }}</div>

    <label class="required">Цена по умолчанию</label>
    <input type="number"
           min="1"
           step="any"
           v-model="productInputedData.price_default"
           @click.prevent="validationErrors.price_default = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.price_default }}</div>



    <label>Базовые игредиенты
      <br>Игредиенты, которые уже по умолчанию есть в товаре. Базовый ингредиент можно заменить
      или удалить, стоимость продукта при изменении может только увеличится.
    </label>
    <div class="base-ingredients">
      <template v-for="item in productInputedData.base_ingredients">
        <div>
          <img class="dialog__img"
               :src="item.ingredient.image_url">
          <div v-if="item.can_delete">можно удалять</div>
          <div v-else>нельзя удалять</div>
          <div v-if="item.can_replace">можно заменять</div>
          <div v-else>нельзя заменять</div>
          <template v-if="item.can_replace">
            <template v-for="ingredient in ingredients">
              <img class="size-30px"
                   v-if="item.replacements_ids.includes(ingredient.id)"
                   :src="ingredient.image_url">
            </template>
          </template>
          <div>
            <button @click.prevent="deleteBaseIngredient(item.ingredient.id)">Удалить</button>
          </div>
        </div>
      </template>
    </div>
    <button class="btn btn-view ingredients-editor-btn"
            @click.prevent="addingBaseIngredientsDialog.showModal()">Добавить
      базовый ингредиент</button>
    <div class="invalid-text">{{ validationErrors.base_ingredients }}</div>

    <label>Дополнительные игредиенты
      <br>Ингредиенты которые можно добавлять к товару. Стоимость товара увеличится в
      зависимости от стоимости ингредиента.
      <br>Один и тот же ингредиент может быть как базовым так и доболнительным.
    </label>
    <button class="btn btn-view ingredients-editor-btn"
            @click.prevent="">Добавление дополнительного ингредиента</button>
    <div class="invalid-text">{{ validationErrors.additional_ingredients }}</div>



    <span class="required">Показывать товар на сайте:</span>
    <input type="checkbox"
           v-model="productInputedData.is_active"
           @click="validationErrors.is_active = ''; textDone = ''">
    <div class="invalid-text">{{ validationErrors.is_active }}</div>

    <div class="done-text">{{ textDone }}</div>
    <button class="btn btn-view"
            @click.prevent="storeProduct()">Добавить</button>

  </form>

  <div v-show="categories == null"
       class="admin-view-model-load">
    {{ textLoadOrFailForVue }}
  </div>

  <dialog ref="addingBaseIngredientsDialog"
          class="dialog">

    <p class="dialog__title">Добавление базового ингредиента</p>

    <img class="dialog__img adding-base-ingredient-dialog__main-img"
         :src="baseIngredientInputedData.ingredient.image_url ?
          baseIngredientInputedData.ingredient.image_url : '/src/assets/images/image_empty.png'">

    <form class="adding-base-ingredient-dialog__form">

      <div>
        <label class="required label">Выберите ингредиент</label>
        <select v-model="baseIngredientInputedData.ingredient">
          <option v-for="ingredient in ingredients"
                  :value="ingredient">{{ ingredient.title }}</option>
        </select>
      </div>

      <div class="label-chekbox">
        <label class="required label">Можно удалить</label>
        <input type="checkbox"
               class="dialog__chekbox"
               v-model="baseIngredientInputedData.can_delete">
      </div>

      <div class="label-chekbox">
        <label class="required label">Можно заменить</label>
        <input type="checkbox"
               class="dialog__chekbox"
               v-model="baseIngredientInputedData.can_replace">
      </div>

      <div class="adding-base-ingredient-dialog__replacements">
        <label class="required label">Замены</label>
        <template v-for="ingredient in ingredients">
          <img class="adding-base-ingredient-dialog__replacements-img"
               v-if="baseIngredientInputedData.replacements_ids.includes(ingredient.id)"
               :src="ingredient.image_url">
        </template>
        <button @click.prevent="replacementsIngredientDialog.showModal()">Редактировать</button>
      </div>

      <div class="dialog__btn-wrapper">
        <button class="btn btn-view"
                @click.prevent="addBaseIngredient()">Добавить ингредиент</button>
      </div>

    </form>

    <button class="dialog__btn-close"
            @click.prevent="addingBaseIngredientsDialog.close()">x</button>

  </dialog>

  <dialog ref="replacementsIngredientDialog"
          class="dialog">

    <p class="dialog__title">Выбирите ингредиенты для замены</p>

    <table class="admin-index-table">

      <tr v-for="ingredient in ingredients">
        <td>
          <img :src="ingredient.image_url">
          <h5>{{ ingredient.title }}</h5>
        </td>
        <td>
          <span class="color-done"
                v-if="ingredient.is_active">Активен</span>
          <span class="color-error"
                v-else>Не активен</span>
        </td>
        <td>
          {{ ingredient.price_default }} р.
        </td>
        <td>
          <input type="checkbox"
                 v-model="baseIngredientInputedData.replacements_ids"
                 :value="ingredient.id"
                 class="dialog__chekbox">
        </td>
      </tr>

    </table>

    <div class="dialog__btn-wrapper">
      <button class="btn btn-view"
              @click.prevent="replacementsIngredientDialog.close()">Сохранить</button>
    </div>

    <button ref="closeAddingIngredientDialog"
            class="dialog__btn-close"
            @click.prevent="replacementsIngredientDialog.close()">x</button>

  </dialog>

</template>

<style scoped>
.ingredients-editor-btn {
  margin-top: 0;
}

.adding-base-ingredient-dialog__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.adding-base-ingredient-dialog__main-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
}

.adding-base-ingredient-dialog__replacements {
  display: flex;
  align-items: center;
}

.adding-base-ingredient-dialog__replacements-img {
  width: 50px;
  margin-right: 15px;
}

.label {
  display: inline-block;
  width: 250px;

}

.label-chekbox {
  display: flex;
  align-items: center;
}

.size-50px {
  width: 50px;
  height: 50px;
}

.size-40px {
  width: 40px;
  height: 40px;
}

.size-30px {
  width: 30px;
  height: 30px;
}

.base-ingredients {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
</style>
