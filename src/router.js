import * as VueRouter from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('./components/client/client-main.vue'),
        name: 'client.main',
        children: [
            {
                path: '/',
                component: () => import('./components/client/client-menu.vue'),
                name: 'client.menu'
            },
            {
                path: '/cart',
                component: () => import('./components/client/client-cart.vue'),
                name: 'client.cart'
            },
        ]
    },
    {
        path: '/admin',
        component: () => import('./components/admin/admin-main.vue'),
        name: 'admin.main',
        children: [
            {
                path: 'companies/:id/edit',
                component: () => import('./components/admin/companies/admin-companies-edit.vue'),
                name: 'admin.companies.edit'
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
]

const router = new VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})

export default router



