<template>
  <node-view-wrapper 
    class="rich-travel-card-view" 
    @mouseover="showToolbar = true" 
    @mouseleave="showToolbar = false"
  >
    <!-- 卡片主体 -->
    <div class="travel-card" :class="{ 'selected': selected }">
      <!-- 图片区域 -->
      <div class="image-section" @click="handleImageClick">
        <img 
          :src="node.attrs.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'" 
          :alt="node.attrs.title || '旅游卡片图片'"
          class="card-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <span class="change-image-text">点击更换图片</span>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="content-section">
        <!-- 标题 -->
        <h3 class="card-title">{{ node.attrs.title || '阿勒泰8日游' }}</h3>
        
        <!-- 副标题 -->
        <p class="card-subtitle">{{ node.attrs.subtitle || '一价全包自由行 0购买0低价' }}</p>
        
        <!-- 价格和按钮区域 -->
        <div class="card-footer">
          <div class="price-section">
            <span class="card-price">{{ node.attrs.price || '18888' }}</span>
            <span class="card-unit">{{ node.attrs.unit || '元/人' }}</span>
          </div>
          <div class="action-section">
            <span class="view-details-btn">{{ node.attrs.buttonText || '点击查看' }}</span>
            <span class="arrow">></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 浮窗工具栏 -->
    <div v-if="showToolbar" class="floating-toolbar">
      <div class="toolbar-content">
        <button class="toolbar-btn" @click="duplicateCard" title="复制">
          📋
        </button>
        <button class="toolbar-btn" @click="deleteCard" title="删除">
          🗑️
        </button>
        <div class="toolbar-divider"></div>
        <RichTravelCardSettings 
          :node="node" 
          :update-attributes="updateAttributes" 
          :editor="editor" 
          :get-pos="getPos"
          @image-change="handleImageChange"
        />
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-3'
import RichTravelCardSettings from './RichTravelCardSettings.vue'

export default {
  name: 'RichTravelCardView',
  components: {
    NodeViewWrapper,
    RichTravelCardSettings,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
    editor: {
      type: Object,
      required: true,
    },
    getPos: {
      type: Function,
      required: true,
    },
    deleteNode: {
      type: Function,
      required: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showToolbar: false,
    }
  },
  methods: {
    handleImageClick() {
      this.$refs.fileInput?.click()
    },
    
    handleFileChange(event) {
      const target = event.target
      const file = target.files?.[0]
      
      if (file) {
        const imageUrl = URL.createObjectURL(file)
        this.updateAttributes({ imageUrl })
        target.value = ''
      }
    },
    
    handleImageChange(imageUrl) {
      this.updateAttributes({ imageUrl })
    },
    
    handleImageError(event) {
      const target = event.target
      target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    
    duplicateCard() {
      const pos = this.getPos()
      if (pos !== undefined) {
        this.editor.chain().focus().insertContentAt(pos + this.node.nodeSize, {
          type: 'richTravelCard',
          attrs: { ...this.node.attrs }
        }).run()
      }
    },
    
    deleteCard() {
      const pos = this.getPos()
      if (pos !== undefined) {
        this.editor.chain().focus().deleteRange({ from: pos, to: pos + this.node.nodeSize }).run()
      }
    },
  },
}
</script>

<style scoped>
.rich-travel-card-view {
  position: relative;
  margin: 16px 0;
  max-width: 560px;
}

.travel-card {
  display: flex;
  background: #ffffff;
  border: 2px solid #4A90E2;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 140px;
}

/* 选中状态样式 */
.travel-card.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.travel-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.image-section {
  position: relative;
  flex-shrink: 0;
  width: 150px;
  height: 140px;
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-section:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-section:hover .image-overlay {
  opacity: 1;
}

.change-image-text {
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.content-section {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.card-subtitle {
  font-size: 13px;
  color: #666666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.card-price {
  font-size: 24px;
  font-weight: 700;
  color: #4A90E2;
  line-height: 1;
}

.card-unit {
  font-size: 14px;
  color: #666666;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.view-details-btn {
  color: #4A90E2;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.view-details-btn:hover {
  color: #357ABD;
}

.arrow {
  color: #4A90E2;
  font-size: 16px;
  font-weight: bold;
}

/* 浮窗工具栏样式 */
.floating-toolbar {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: fadeInUp 0.2s ease-out;
}

.toolbar-content {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  gap: 4px;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.toolbar-btn:hover {
  background: #f5f5f5;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .travel-card {
    flex-direction: column;
  }
  
  .image-section {
    width: 100%;
    height: 150px;
  }
  
  .content-section {
    padding: 12px;
  }
}
</style>