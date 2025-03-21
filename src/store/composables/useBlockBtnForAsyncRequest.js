import { ref } from 'vue'

export function useBlockBtnForAsyncRequest() {
   const isRequestRunning = ref(false)

   async function controlClick(functionHandleClick) {
      if (isRequestRunning.value) return
      isRequestRunning.value = true

      try {
         await functionHandleClick()
      }
      finally {
         isRequestRunning.value = false
      }
   }

   return {
      isRequestRunning,
      controlClick
   }
}

// как использовать
// import { useBlockBtnForAsyncRequest } from '/src/store/composables/useBlockBtnForAsyncRequest'

// const { isRequestRunning, controlClick } = useBlockBtnForAsyncRequest()

// <button @click="controlClick(handleClick)">
//        {{ isRequestRunning ? 'Отправка...' : 'Отправить'}}
// </button>  