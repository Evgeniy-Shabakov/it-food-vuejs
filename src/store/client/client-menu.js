import { ref, onMounted, onUpdated, watch, onUnmounted } from 'vue'
import { throttle } from '/src/store/helpers/throttle.js'

export function activateSelecteMenuController(contentSections, categoriesItems) {
    categoriesItems[0].classList.add('active') //выделение меню при старте

    const scrollHandler = throttle(selectMenu, 150)

    //выделение пункта меню при скролле
    window.addEventListener('scroll', scrollHandler)

    categoriesItems.forEach((el, i) => {
        el.addEventListener('click', () => {
            categoriesItems.forEach(el => el.classList.remove('active'))
            categoriesItems[i].classList.add('active')
        })
    })

    function selectMenu() {
        let scrollDistance = window.scrollY

        contentSections.forEach((el, i) => {
            if (el.offsetTop <= scrollDistance + 400) {
                categoriesItems.forEach(el => el.classList.remove('active'))
                categoriesItems[i].classList.add('active')
            }
        })
    }

    onUnmounted(() => {
        window.removeEventListener('scroll', scrollHandler)
    })
}

export function activateMoveMenuController(categoriesMenuInner) {
    const scrollHandler = throttle(moveMenu, 20)

    window.addEventListener('scroll', scrollHandler)

    function moveMenu() {
        let scrollDistance = window.scrollY
        let scrollMax = document.documentElement.scrollHeight - window.innerHeight
        let scrollRatio = scrollDistance / scrollMax

        const menuInnerWidth = categoriesMenuInner.scrollWidth - categoriesMenuInner.clientWidth
        const scrollPosition = scrollRatio * menuInnerWidth

        categoriesMenuInner.scrollLeft = scrollPosition
    }

    onUnmounted(() => {
        window.removeEventListener('scroll', scrollHandler)
    })
}

