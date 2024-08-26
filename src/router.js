import * as VueRouter from 'vue-router'
import { getAuthUser, authUser } from '/src/store/axios-helper.js'

const routes = [
    {
        path: '/',
        component: () => import('./components/client/client-main.vue'),
        name: 'client.main',
        children: [
            {
                path: '/',
                component: () => import('./components/client/client-menu.vue'),
                name: 'client.menu',
                children: [
                    {
                        path: '/popup',
                        component: () => import('./components/client/popup-pages/client-popup-page-layout.vue'),
                        name: 'client.menu.popup',
                        children: [
                            {
                                path: '/popup/order-panel',
                                component: () => import('./components/client/popup-pages/order-panel.vue'),
                                name: 'client.menu.popup.order-panel'
                            },
                            {
                                path: '/popup/login-panel',
                                component: () => import('./components/client/popup-pages/login-panel.vue'),
                                name: 'client.menu.popup.login-panel'
                            },
                            {
                                path: '/popup/user-panel',
                                component: () => import('./components/client/popup-pages/user/user-panel.vue'),
                                name: 'client.menu.popup.user-panel'
                            },
                            {
                                path: '/popup/orders-history',
                                component: () => import('./components/client/popup-pages/user/orders-history.vue'),
                                name: 'client.menu.popup.orders-history'
                            },
                            {
                                path: '/popup/order-status-panel',
                                component: () => import('./components/client/popup-pages/order-status-panel.vue'),
                                name: 'client.menu.popup.order-status-panel'
                            },
                            {
                                path: '/popup/cart',
                                component: () => import('./components/client/popup-pages/cart-panel.vue'),
                                name: 'client.menu.popup.cart'
                            },
                            {
                                path: '/popup/user-edit-panel',
                                component: () => import('./components/client/popup-pages/user/user-edit-panel.vue'),
                                name: 'client.menu.popup.user-edit-panel'
                            },
                            {
                                path: '/popup/prifile-management',
                                component: () => import('./components/client/popup-pages/user/profile-management.vue'),
                                name: 'client.menu.popup.profile-management'
                            },
                            {
                                path: '/popup/adresses',
                                component: () => import('./components/client/popup-pages/addresses/addresses-index.vue'),
                                name: 'client.menu.popup.addresses'
                            },
                            {
                                path: '/popup/addresses/create',
                                component: () => import('./components/client/popup-pages/addresses/addresses-create.vue'),
                                name: 'client.menu.popup.address-create'
                            },
                            {
                                path: '/popup/addresses/:id/edit',
                                component: () => import('./components/client/popup-pages/addresses/addresses-edit.vue'),
                                name: 'client.menu.popup.address-edit'
                            },
                        ]
                    },
                ]
            },
        ]
    },
    {
        path: '/admin',
        component: () => import('./components/admin/admin-main.vue'),
        name: 'admin.main',
        beforeEnter: (to, from, next) => {
            if (authUser.value) {
                if (authUser.value.employee.hasAdminPanelAccess) next()
                else {
                    next('/')
                }
            }
            else getAuthUser()
                .then(res => {
                    if (authUser.value) {
                        if (authUser.value.employee.hasAdminPanelAccess) next()
                        else {
                            next('/')
                        }
                    }
                    else {
                        next('/')
                    }
                })
                .catch(err => {
                    next('/')
                })
        },
        children: [
            {
                path: 'companies/:id/edit',
                component: () => import('./components/admin/companies/admin-companies-edit.vue'),
                name: 'admin.companies.edit'
            },

            {
                path: 'employees',
                component: () => import('./components/admin/employees/admin-employees-index.vue'),
                name: 'admin.employees.index'
            },
            {
                path: 'employees/create',
                component: () => import('./components/admin/employees/admin-employees-create.vue'),
                name: 'admin.employees.create'
            },
            {
                path: 'employees/:id',
                component: () => import('./components/admin/employees/admin-employees-show.vue'),
                name: 'admin.employees.show'
            },
            {
                path: 'employees/:id/edit',
                component: () => import('./components/admin/employees/admin-employees-edit.vue'),
                name: 'admin.employees.edit'
            },

            {
                path: 'countries',
                component: () => import('./components/admin/countries/admin-countries-index.vue'),
                name: 'admin.countries.index'
            },
            {
                path: 'countries/create',
                component: () => import('./components/admin/countries/admin-countries-create.vue'),
                name: 'admin.countries.create'
            },
            {
                path: 'countries/:id',
                component: () => import('./components/admin/countries/admin-countries-show.vue'),
                name: 'admin.countries.show'
            },
            {
                path: 'countries/:id/edit',
                component: () => import('./components/admin/countries/admin-countries-edit.vue'),
                name: 'admin.countries.edit'
            },

            {
                path: 'cities',
                component: () => import('./components/admin/cities/admin-cities-index.vue'),
                name: 'admin.cities.index'
            },
            {
                path: 'cities/create',
                component: () => import('./components/admin/cities/admin-cities-create.vue'),
                name: 'admin.cities.create'
            },
            {
                path: 'cities/:id',
                component: () => import('./components/admin/cities/admin-cities-show.vue'),
                name: 'admin.cities.show'
            },
            {
                path: 'cities/:id/edit',
                component: () => import('./components/admin/cities/admin-cities-edit.vue'),
                name: 'admin.cities.edit'
            },

            {
                path: 'restaurants',
                component: () => import('./components/admin/restaurants/admin-restaurants-index.vue'),
                name: 'admin.restaurants.index'
            },
            {
                path: 'restaurants/create',
                component: () => import('./components/admin/restaurants/admin-restaurants-create.vue'),
                name: 'admin.restaurants.create'
            },
            {
                path: 'restaurants/:id',
                component: () => import('./components/admin/restaurants/admin-restaurants-show.vue'),
                name: 'admin.restaurants.show'
            },
            {
                path: 'restaurants/:id/edit',
                component: () => import('./components/admin/restaurants/admin-restaurants-edit.vue'),
                name: 'admin.restaurants.edit'
            },

            {
                path: 'categories',
                component: () => import('./components/admin/categories/admin-categories-index.vue'),
                name: 'admin.categories.index'
            },
            {
                path: 'categories/create',
                component: () => import('./components/admin/categories/admin-categories-create.vue'),
                name: 'admin.categories.create'
            },
            {
                path: 'categories/:id',
                component: () => import('./components/admin/categories/admin-categories-show.vue'),
                name: 'admin.categories.show'
            },
            {
                path: 'categories/:id/edit',
                component: () => import('./components/admin/categories/admin-categories-edit.vue'),
                name: 'admin.categories.edit'
            },

            {
                path: 'products',
                component: () => import('./components/admin/products/admin-products-index.vue'),
                name: 'admin.products.index'
            },
            {
                path: 'products/create',
                component: () => import('./components/admin/products/admin-products-create.vue'),
                name: 'admin.products.create'
            },
            {
                path: 'products/:id',
                component: () => import('./components/admin/products/admin-products-show.vue'),
                name: 'admin.products.show'
            },
            {
                path: 'products/:id/edit',
                component: () => import('./components/admin/products/admin-products-edit.vue'),
                name: 'admin.products.edit'
            },
        ],

    },
    {
        path: '/order-manager',
        component: () => import('./components/order-manager/order-manager-main.vue'),
        name: 'order-manager.main',
        beforeEnter: (to, from, next) => {
            if (authUser.value) {
                if (authUser.value.employee.hasAdminPanelAccess) next()
                else {
                    next('/')
                }
            }
            else getAuthUser()
                .then(res => {
                    if (authUser.value) {
                        if (authUser.value.employee.hasAdminPanelAccess) next()
                        else {
                            next('/')
                        }
                    }
                    else {
                        next('/')
                    }
                })
                .catch(err => {
                    next('/')
                })
        },
    },
]

const router = new VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) { //скролл к сохраненной позиции
        if (to.name === from.name) {     //сохранить скролл при клике по кнопке тожей вкладки
            scrollPositions[from.name] = window.scrollY
        }
        if (scrollPositions[to.name]) {
            return { top: scrollPositions[to.name], behavior: 'instant' }
        }
        else {
            return { top: 0, behavior: 'instant' }
        }
    },
})

//массив и сохранение скролла перед каждым роутом
const scrollPositions = Object.create(null)

router.beforeEach((to, from, next) => {
    scrollPositions[from.name] = window.scrollY

    if (window.innerWidth > 1300) { //для мониторов сохраняем положение страницы меню, чтобы экран не смещался при открытии popup
        if (to.name == 'client.menu.popup.login-panel' || to.name == 'client.menu.popup.user-panel'
            || to.name == 'client.menu.popup.address-create' || to.name == 'client.menu.popup.address-edit'
            || to.name == 'client.menu.popup.order-panel' || to.name == 'client.menu.popup.order-status-panel'
            || to.name == 'client.menu.popup.cart') {
            scrollPositions[to.name] = window.scrollY
        }
    }

    next()
})

export let previousRoute

router.beforeEach((to, from, next) => {
    previousRoute = from
    
    next()
})

export default router



