<template>
  <aside class="template-library">
    <!-- 顶部标题区 -->
    <div class="library-header">
      <h3 class="library-title">模版库</h3>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-wrapper">
        <input type="text" placeholder="搜索模版或素材" class="search-input" v-model="searchQuery">
        <i class="search-icon">🔍</i>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-section">
      <div class="category-tags">
        <span v-for="category in sidebarData.categories" :key="category.id"
          :class="['category-tag', { active: category.active }]" @click="selectCategory(category)">
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- 模版内容区 -->
    <div class="template-content">
      <div class="content-header">
        <h4 class="content-title">{{ sidebarData.contentInfo.title }}</h4>
        <p class="content-subtitle">{{ sidebarData.contentInfo.subtitle }} - {{ totalTemplatesCount }}个</p>
      </div>

      <!-- 模版列表 -->
      <div class="template-list">
        <!-- 动态渲染各个模版区块 -->
        <template v-for="section in sidebarData.templateSections" :key="section.id">

          <!-- 行布局模版 -->
          <div v-if="section.type === 'row'" class="template-row">
            <div v-for="template in section.templates" :key="template.id" :class="['template-card', template.size]"
              @click="insertTemplate(template)">
              <!-- 图片卡片 -->
              <div v-if="template.size !== 'text'" class="card-image">
                <img :src="template.image" :alt="template.title" />
                <div v-if="template.overlayText" class="card-overlay">
                  <span class="overlay-text">{{ template.overlayText }}</span>
                  <span class="overlay-subtext">{{ template.overlaySubtext }}</span>
                </div>
              </div>

              <!-- 文字卡片 -->
              <div v-if="template.size === 'text'" class="text-content">
                <span class="text-title">{{ template.title }}</span>
                <span class="text-subtitle">{{ template.subtitle }}</span>
              </div>

              <!-- 卡片标签 -->
              <div v-if="template.size !== 'text'" class="card-label">{{ template.title }}</div>
            </div>
          </div>

          <!-- 大图模版 -->
          <div v-else-if="section.type === 'large'" class="template-large"
            @click="insertTemplate(section.templates[0])">
            <div class="large-image">
              <img :src="section.templates[0].image" :alt="section.templates[0].title" />
              <div class="large-overlay">
                <h5 class="large-title">{{ section.templates[0].title }}</h5>
                <p class="large-description">{{ section.templates[0].description }}</p>
              </div>
            </div>
          </div>

          <!-- 特色推荐 -->
          <div v-else-if="section.type === 'featured'" class="featured-section">
            <div v-for="template in section.templates" :key="template.id"
              :class="['featured-item', { highlighted: template.highlighted }]" @click="insertTemplate(template)">
              <div class="featured-avatar">
                <img :src="template.avatar" :alt="template.title" />
              </div>
              <div class="featured-info">
                <h6 class="featured-title">{{ template.title }}</h6>
                <p class="featured-meta" v-if="template.rating">{{ template.rating }}</p>
                <p class="featured-description" v-if="template.description">{{ template.description }}</p>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
  </aside>
</template>

<script>
import sidebarData from '@/data/leftSidebarData.json'

export default {
  name: 'TemplateLibrary',
  data() {
    return {
      searchQuery: '',
      sidebarData: sidebarData
    }
  },
  computed: {
    // 计算所有模版的总数
    totalTemplatesCount() {
      return this.sidebarData.templateSections.reduce((total, section) => {
        return total + section.templates.length
      }, 0)
    },

    // 根据搜索条件过滤模版
    filteredSections() {
      if (!this.searchQuery.trim()) {
        return this.sidebarData.templateSections
      }

      return this.sidebarData.templateSections.map(section => ({
        ...section,
        templates: section.templates.filter(template =>
          template.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (template.description && template.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
        )
      })).filter(section => section.templates.length > 0)
    }
  },
  methods: {
    selectCategory(category) {
      // 重置所有分类的激活状态
      this.sidebarData.categories.forEach(cat => cat.active = false)
      // 激活选中的分类
      category.active = true
      this.$emit('category-changed', category)
    },

    insertTemplate(template) {
      this.$emit('template-selected', template)
    },

    // 根据分类筛选模版
    filterByCategory(categoryName) {
      // 这里可以根据分类名称筛选模版
      // 实际实现可以在JSON数据中为每个模版添加category字段
      console.log('筛选分类:', categoryName)
    }
  }
}
</script>

<style scoped>
.template-library {
  width: 300px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

/* 头部区域 */
.library-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
  background: #fafbfc;
}

.library-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #24292e;
  letter-spacing: -0.01em;
}

/* 搜索区域 */
.search-section {
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f1f3f4;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  font-size: 13px;
  background: #fafbfc;
  color: #24292e;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #0366d6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

.search-input::placeholder {
  color: #6a737d;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6a737d;
  font-size: 12px;
  pointer-events: none;
}

/* 分类标签 */
.category-section {
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f1f3f4;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-tag {
  padding: 4px 10px;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  font-size: 12px;
  color: #586069;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  user-select: none;
}

.category-tag:hover {
  background: #e1f5fe;
  color: #0277bd;
  border-color: #b3e5fc;
}

.category-tag.active {
  background: #0366d6;
  color: #ffffff;
  border-color: #0366d6;
  font-weight: 500;
}

/* 模版内容区 */
.template-content {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

.content-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f1f3f4;
}

.content-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #24292e;
  letter-spacing: -0.01em;
}

.content-subtitle {
  margin: 0;
  font-size: 12px;
  color: #6a737d;
}

/* 模版列表 */
.template-list {
  padding: 12px 16px 16px;
}

.template-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.template-card {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #d1d5da;
}

.template-card.small {
  flex: 1;
  height: 90px;
}

.template-card.mini {
  flex: 1;
  height: 70px;
}

.card-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.template-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.template-card:hover .card-overlay {
  opacity: 1;
}

.overlay-text {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.overlay-subtext {
  font-size: 10px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  font-size: 10px;
  padding: 12px 6px 4px;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 大图模版 */
.template-large {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 10px;
  border: 1px solid #e1e4e8;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.template-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.large-image {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.large-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.template-large:hover .large-image img {
  transform: scale(1.05);
}

.large-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px 12px 10px;
}

.large-title {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.large-description {
  margin: 0;
  font-size: 10px;
  opacity: 0.95;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 文字卡片 */
.template-card.text {
  background: linear-gradient(135deg, #42a5f5, #1e88e5);
  color: white;
  padding: 12px;
  min-height: 70px;
  display: flex;
  align-items: center;
  border: none;
  box-shadow: 0 2px 8px rgba(66, 165, 245, 0.3);
}

.template-card.text:hover {
  background: linear-gradient(135deg, #1e88e5, #1565c0);
  box-shadow: 0 4px 16px rgba(66, 165, 245, 0.4);
}

.text-content {
  display: flex;
  flex-direction: column;
}

.text-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.text-subtitle {
  font-size: 10px;
  opacity: 0.9;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 特色推荐 */
.featured-section {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.featured-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  background: #f6f8fa;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e1e4e8;
}

.featured-item:hover {
  background: #e1f5fe;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.featured-item.highlighted {
  background: #fff8e1;
  border-color: #ffb300;
}

.featured-item.highlighted:hover {
  background: #fff3c4;
}

.featured-avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.featured-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-info {
  flex: 1;
  min-width: 0;
}

.featured-title {
  margin: 0 0 3px 0;
  font-size: 12px;
  font-weight: 600;
  color: #24292e;
  line-height: 1.3;
}

.featured-meta {
  margin: 0 0 4px 0;
  font-size: 10px;
  color: #f57c00;
  font-weight: 500;
}

.featured-description {
  margin: 0;
  font-size: 9px;
  color: #6a737d;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条样式 */
.template-content::-webkit-scrollbar {
  width: 6px;
}

.template-content::-webkit-scrollbar-track {
  background: #f6f8fa;
}

.template-content::-webkit-scrollbar-thumb {
  background: #d1d5da;
  border-radius: 3px;
}

.template-content::-webkit-scrollbar-thumb:hover {
  background: #959da5;
}
</style>