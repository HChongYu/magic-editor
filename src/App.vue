<template>
  <div id="app">
    <nav class="app-nav" v-if="showNavigation">
      <div class="nav-brand">
        <h2>Tiptap Project</h2>
      </div>
    </nav>

    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showDropdown = ref(false)

const mainRoutes = [
  { name: 'WorkSpace', path: '/workspace', meta: { title: '工作区', icon: '🏠' } },
  { name: 'Editor', path: '/editor', meta: { title: '编辑器', icon: '✏️' } },
  { name: 'Settings', path: '/settings', meta: { title: '设置', icon: '⚙️' } }
]

const componentRoutes = [
  { name: 'TravelCards', path: '/cards/travel', meta: { title: '旅行卡片', icon: '🧳' } },
  { name: 'RichTravelCards', path: '/cards/rich-travel', meta: { title: '富文本旅行卡片', icon: '🎨' } },
  { name: 'ImageTextList', path: '/components/image-text-list', meta: { title: '图文列表', icon: '📝' } },
  { name: 'DoubleText', path: '/components/double-text', meta: { title: '双文本', icon: '📄' } }
]

const showNavigation = computed(() => {
  // 在404页面隐藏导航
  return route.name !== 'NotFound'
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC";
  font-weight: 400;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(75, 75, 80, 0.36);
}

.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 3rem;
  z-index: 1000;
  position: sticky;
  top: 0;
}

.nav-brand h2 {
  font-size: 2.4rem;
  color: #667eea;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1.4rem;
}

.nav-link:hover {
  color: #333;
  background: #f8f9fa;
}

.nav-link.active {
  color: #667eea;
  background: #e8f0fe;
}

.nav-icon {
  font-size: 1.6rem;
}

.nav-text {
  font-size: 1.4rem;
}

/* 下拉菜单样式 */
.nav-dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 1rem 0;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
  font-size: 1.4rem;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #333;
}

.app-main {
  flex: 1;
  overflow: hidden;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-nav {
    padding: 0 1rem;
  }

  .nav-brand h2 {
    font-size: 2rem;
  }

  .nav-links {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 1rem 1.5rem;
  }

  .nav-text {
    display: none;
  }

  .dropdown-menu {
    right: 0;
    left: auto;
  }
}
</style>
