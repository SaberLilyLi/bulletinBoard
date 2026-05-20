import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login',
    },
    {
      path: '/home',
      name: 'workbench',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/task-board',
      name: 'task-board',
      component: () => import('../views/TaskBoard/TaskBoard.vue'),
    },
    {
      path: '/team-collaboration',
      name: 'team-collaboration',
      component: () => import('../views/TeamCollaboration/TeamCollaboration.vue'),
    },
    {
      path: '/data-board',
      name: 'data-board',
      component: () => import('../views/DataBoard/DataBoard.vue'),
    },
    {
      path: '/data-operation',
      name: 'data-operation',
      component: () => import('../views/DataOperation/DataOperation.vue'),
    },
  ],
})

export default router
