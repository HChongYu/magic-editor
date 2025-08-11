<template>
  <node-view-wrapper 
    class="rich-travel-card-view" 
    @mouseover="showToolbar = true" 
    @mouseleave="showToolbar = false"
  >
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
      <h3 class="card-title">{{ node.attrs.title || '标题' }}</h3>
      <p class="card-subtitle">{{ node.attrs.subtitle || '副标题' }}</p>
      <div class="card-footer">
        <span class="card-price">{{ node.attrs.price || '价格' }}</span>
        <span class="card-unit">{{ node.attrs.unit || '单位' }}</span>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="toolbar">
      <RichTravelCardSettings 
        :node="node" 
        :update-attributes="updateAttributes" 
        :editor="editor" 
        :get-pos="getPos"
        @image-change="handleImageChange"
      />
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
      // 触发文件选择
      this.$refs.fileInput?.click()
    },
    
    handleFileChange(event) {
      const target = event.target
      const file = target.files?.[0]
      
      if (file) {
        // 创建文件URL
        const imageUrl = URL.createObjectURL(file)
        this.updateAttributes({ imageUrl })
        
        // 清空input值，允许重复选择同一文件
        target.value = ''
      }
    },
    
    handleImageChange(imageUrl) {
      this.updateAttributes({ imageUrl })
    },
    
    handleImageError(event) {
      const target = event.target
      // 设置默认图片
      target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
  },
}
</script>

<style scoped>
.rich-travel-card-wrapper {
  position: relative;
  margin: 16px 0;
  max-width: 600px;
}

.rich-travel-card {
  display: flex;
  background: var(--bg-color, #ffffff);
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 选中状态样式 */
.rich-travel-card-wrapper.selected .rich-travel-card {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.rich-travel-card:hover {
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
}

.image-container {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.card-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.rich-content {
  flex: 1;
}

.toolbar-wrapper {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  z-index: 10;
}

/* 富文本内容样式 */
.rich-content :deep(.rich-card-title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.rich-content :deep(.rich-card-subtitle) {
  font-size: 14px;
  color: #718096;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.rich-content :deep(.rich-card-price) {
  font-size: 24px;
  font-weight: 700;
  color: #e53e3e;
  margin: 0;
}

.rich-content :deep(.rich-card-unit) {
  font-size: 14px;
  color: #718096;
  margin: 0 0 12px 0;
}

.rich-content :deep(.rich-card-link) {
  font-size: 14px;
  color: #3182ce;
  font-weight: 500;
  margin: 0;
  cursor: pointer;
}

.rich-content :deep(.rich-card-link):hover {
  color: #2c5aa0;
}
</style>