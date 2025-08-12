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
        <span v-for="category in sidebarData.categories" :key="category.type"
          :class="['category-tag', { active: activeType === category.type }]" @click="selectCategory(category.type)">
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- 模版内容区 -->
    <div class="template-content">

      <div class="template-section" v-for="section in sidebarData.templateSections[activeType]" :key="section.type">

        {{ section.leftTitle }}


      </div>
    </div>
  </aside>
</template>

<script>
import sidebarData from '@/data/leftSidebarData.json'
import { TemplateNodeType } from '@/enums'

export default {
  name: 'TemplateLibrary',
  data() {
    return {
      searchQuery: '',
      sidebarData: sidebarData,
      activeType: TemplateNodeType.ALL,
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
      // 激活选中的分类
      this.activeType = category;
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

.template-section {
  padding: 16px 12px;
  border: 1px solid #586069;
  margin: 10px 0;
}
</style>