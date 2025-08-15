<template>
  <aside class="template-library">
    <!-- 顶部标题区 -->
    <div class="library-header">
      <h3 class="library-title">模版库</h3>
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
      <div class="template-section" v-for="section in sidebarData.templateSections[activeType]" :key="section.type"
        @click="insertTemplate(section)">
        {{ section.leftTitle }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import sidebarData from '@/data/leftSidebarData.json'
import { TemplateNodeType, DiyNodeType } from '@/enums'

// 定义props
const props = defineProps({
  editorInstance: {
    type: null,
    default: null,
  },
})

// 定义emit
const emit = defineEmits(['category-changed'])

// 响应式数据
const searchQuery = ref('')
const activeType = ref(TemplateNodeType.IMAGE_TEXT)

// 方法
const selectCategory = (category) => {
  // 激活选中的分类
  activeType.value = category
  emit('category-changed', category)
}

const insertTemplate = (template) => {
  const { type, config } = template
  console.log('type', config)
  const editor = props.editorInstance
  if (!editor) {
    return
  }
  switch (type) {
    case DiyNodeType.LEFT_IMAGE_TEXT1:
      editor.commands.insertLeftImageText1()
      break
    case DiyNodeType.COLUMN_IMAGE_TEXT1:
      editor.commands.insertColumnImageText1()
      break
  }
}
</script>

<style scoped>
.template-library {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 43px;
  width: 370px;
  background: #ffffff;
  box-shadow: none;
  height: calc(100vh - 53px);
  border-radius: 12px;
}

/* 头部区域 */
.library-header {
  padding: 16px 20px;
}

.library-title {
  color: #1D2129;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 150% */
}

/* 搜索区域 */

.search-wrapper {
  display: flex;
  align-items: center;
  color: #E1E6EF;
  margin-top: 12px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d1d5da;
  padding: 0 12px;
}

.search-input {
  flex: 1;
  border-radius: 6px;
  font-size: 16px;
  line-height: 22px;
  /* background: #fafbfc; */
  color: #24292e;
  transition: all 0.15s ease;
  border: transparent 1px solid;
  /* box-sizing: border-box; */
}

.search-input:focus {
  outline: none;

}

.search-input::placeholder {
  color: #6a737d;
}

.search-icon {

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
  width: 100%;
  padding: 0 16px;
}

.template-section {
  margin-top: 16px;
  min-height: 200px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #d1d5da;
}
</style>