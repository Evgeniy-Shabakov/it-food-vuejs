import { onUnmounted } from 'vue'
import { throttle } from '/src/store/helpers/throttle.js'

export function activateSelecteMenuController(contentSections, categoriesItems) {
    categoriesItems[0].classList.add('active') //выделение меню при старте

    const scrollHandler = throttle(selectMenu, 150)

    //выделение пункта меню при скролле
    window.addEventListener('scroll', scrollHandler)

    //чтобы при клике меню сразу выделялось
    categoriesItems.forEach((el, i) => {
        el.addEventListener('click', () => {
            categoriesItems.forEach(el => el.classList.remove('active'))
            categoriesItems[i].classList.add('active')

            window.removeEventListener('scroll', scrollHandler)

            window.addEventListener('scrollend', function scrollendHandler() {
                window.removeEventListener('scrollend', scrollendHandler)

                window.addEventListener('scroll', scrollHandler)
            })
        })
    })

    function selectMenu() {
        categoriesItems.forEach(el => el.classList.remove('active'))

        let index = getIndexCentrSection(contentSections)
        categoriesItems[index].classList.add('active')
    }

    onUnmounted(() => {
        window.removeEventListener('scroll', scrollHandler)
    })
}

export function activateMoveMenuController(contentSections, categoriesItems, categoriesMenuInner) {
    const scrollHandler = throttle(moveMenu, 150)

    window.addEventListener('scroll', scrollHandler)

    //чтобы не было дерганья меню при клике
    categoriesItems.forEach((el, i) => {
        el.addEventListener('click', () => {
            window.removeEventListener('scroll', scrollHandler)

            window.addEventListener('scrollend', function scrollendHandler() {
                window.removeEventListener('scrollend', scrollendHandler)

                window.addEventListener('scroll', scrollHandler)
                moveMenu()
            })
        })
    })

    function moveMenu() {
        let index = getIndexCentrSection(contentSections)
        const rect = categoriesItems[index].getBoundingClientRect()

        if (rect.left > categoriesMenuInner.clientWidth / 2 ||
            rect.right < categoriesMenuInner.clientWidth / 2) {
            categoriesMenuInner.scrollTo({
                left: categoriesItems[index].offsetLeft - (categoriesMenuInner.clientWidth / 2 - categoriesItems[index].clientWidth / 2),
                behavior: "smooth",
            })
        }
    }

    onUnmounted(() => {
        window.removeEventListener('scroll', scrollHandler)
    })
}

function getIndexCentrSection(arrayElements) {
    for (let i = 0; i < arrayElements.length; i++) {
        const rect = arrayElements[i].getBoundingClientRect()

        if (rect.bottom > window.innerHeight / 2 - 60)
            return i
    }
}

