import { createRouter, createWebHistory } from 'vue-router'
import WorkSpace from '@/view/WorkSpace.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/Editor'
  },
  {
    path: '/workspace',
    name: 'WorkSpace',
    component: WorkSpace,
    meta: {
      title: '工作区',
      icon: '🏠'
    }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/view/WorkSpaceNew.vue'),
    meta: {
      title: '编辑器',
      icon: '✏️'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Tiptap Project`
  }
  
  // 这里可以添加权限验证逻辑
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换完成后的逻辑
  console.log(`路由从 ${from.path} 切换到 ${to.path}`)
})

export default router