<template>
  <div class="left-sidebar">
    <div class="sidebar-content">

      <!-- 标签页切换 -->
      <div class="tabs-section">
        <div class="tab-buttons">
          <button 
            v-for="tab in sidebarData.tabs" 
            :key="tab.key"
            :class="['tab-btn', { active: activeTab === tab.key }]"
            @click="setActiveTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 分类标签 -->

      <!-- 内容区域 -->
      <div class="content-section">

        <!-- 产品展示 -->
        <div class="content-block">
    
          
          <div 
            v-for="item in sidebarData.productShowcase[activeTab]" 
            :key="item.id"
            class="product-item"
            @click="insertTemplateNode(item)"
          >

            <!-- 标题类型 -->
            <div v-if="item.type === tabemplateNodeType.HEADER" class="product-header">
              <h4>{{ item.title }}</h4>
              <span class="product-subtitle">{{ item.subtitle }}</span>
            </div>
            <div v-if="item.type === tabemplateNodeType.IMAGE_CARD" class="image-card">
              <img :src="item.imageUrl" :alt="item.title" class="card-image" />
              <div class="card-content">
                <div>
                  <h4 class="card-title">{{ item.title }}</h4>
                  <p class="card-description">{{ item.description }}</p>
                </div>
                <div class="card-price-section">
                  <div class="card-price-info">
                    <span class="card-price">{{ item.price }}</span>
                    <span class="card-unit">{{ item.unit }}</span>
                  </div>
                  <a href="#" class="view-details">{{ item.linkText || '点击查看' }} &gt;</a>
                </div>
              </div>
            </div>
            <!-- 在模板中添加微信风格卡片的渲染 -->
            <div v-if="item.type === tabemplateNodeType.WECHAT_STYLE" class="wechat-style-card">
              <div class="card-header">
                <h4 class="card-title">{{ item.title }}</h4>
              </div>
              <div class="card-items">
                <div 
                  v-for="listItem in item.items" 
                  :key="listItem.id"
                  class="card-item"
                >
                  <img :src="listItem.image" :alt="listItem.title" class="item-image" />
                  <div class="item-content">
                    <h5 class="item-title">{{ listItem.title }}</h5>
                    <p class="item-description">{{ listItem.description }}</p>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <a :href="item.moreLink" class="more-link">
                  {{ item.moreText }}
                  <svg class="arrow-icon" viewBox="0 0 24 24" width="12" height="12">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebarData from '@/data/sidebarData.json'
import { TemplateNodeType } from '@/enums'

export default {
  name: 'LeftSidebar',
  data() {
    return {
      searchQuery: '',
      activeTab: TemplateNodeType.HEADER,
      activeCategory: 'main-title',
      sidebarData: sidebarData,
      tabemplateNodeType: TemplateNodeType
    }
  },
  methods: {
    setActiveTab(tabKey) {
      this.activeTab = tabKey;
      this.$emit('tab-change', tabKey);
    },
    insertTemplateNode(item){
      this.$emit('insertTemplate', item);
    }
  },
  emits: [
    'tab-change',
    'category-change',
    'search'
  ]
}
</script>

<style scoped>
/* 左侧边栏样式 */
.left-sidebar {
  width: 100%; /* 改为100%，让父级控制宽度 */
  height: 100vh; /* 设置全屏高度 */
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative; /* 确保定位正确 */
}

.sidebar-content {
  padding: 16px;
}

/* 搜索框样式 */
.search-section {
  margin-bottom: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  padding-right: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.search-btn:hover {
  color: #374151;
}

/* 标签页样式 */
.tabs-section {
  margin-bottom: 16px;
}

.tab-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tab-btn {
  padding: 6px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.tab-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* 分类标签样式 */
.category-section {
  margin-bottom: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-tag {
  padding: 4px 8px;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  font-size: 11px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tag:hover {
  background: #e5e7eb;
}

.category-tag.active {
  background: #dbeafe;
  color: #1d4ed8;
}

/* 内容区域样式 */
.content-section {
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}

.content-block {
  margin-bottom: 16px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.block-icon {
  color: #3b82f6;
  font-size: 8px;
}

.block-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.block-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
}

/* 产品展示区域 */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
}

.product-item {
  margin-bottom: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
  transition: all 0.2s;
}

.product-item:hover {
  background: #f3f4f6;
  border-left-color: #3b82f6;
}

.product-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.product-header h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.product-subtitle {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-description h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.product-description p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.product-brand h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-brand p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .left-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .sidebar-content {
    padding: 12px;
  }
  
  .tab-buttons {
    justify-content: flex-start;
  }
  
  .tab-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
  
  .category-tags {
    justify-content: flex-start;
  }
}

/* 滚动条样式 */
.left-sidebar::-webkit-scrollbar {
  width: 6px;
}

.left-sidebar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.left-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.left-sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

/* 图文卡片样式 - 左右布局 */
.image-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 16px;
  display: flex;
  align-items: stretch;
}

.image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  border-radius: 6px;
  margin: 8px;
}

.card-content {
  padding: 12px 12px 12px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.card-description {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.card-price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.card-price-info {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.card-price {
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
}

.card-unit {
  font-size: 12px;
  color: #6b7280;
}

.view-details {
  font-size: 11px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
}

.view-details:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* 微信风格卡片样式 */
.wechat-style-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.card-header {
  padding: 16px 16px 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-items {
  padding: 0;
}

.card-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.card-item:hover {
  background-color: #f9f9f9;
}

.card-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.item-description {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.more-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s;
}

.more-link:hover {
  color: #40a9ff;
}

.arrow-icon {
  margin-left: 4px;
  transition: transform 0.2s;
}

.more-link:hover .arrow-icon {
  transform: translateX(2px);
}