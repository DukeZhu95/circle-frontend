import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/book/:id',
            name: 'book-detail',
            component: () => import('../views/BookDetail.vue')
        }
    ]
})

export default router