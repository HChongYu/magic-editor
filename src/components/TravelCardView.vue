<template>
  <node-view-wrapper 
    class="travel-card-wrapper"
    @mouseover="showToolbar = true" 
    @mouseleave="showToolbar = false"
    :style="{
      '--bg-color': node.attrs.backgroundColor,
      '--border-color': node.attrs.borderColor
    }"
  >
    <div class="travel-card">
      <!-- 图片区域 -->
      <div class="image-container" @click="handleImageClick">
        <img 
          :src="node.attrs.imageUrl" 
          :alt="node.attrs.title"
          class="card-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <div class="overlay-text">点击更换图片</div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="card-content">
        <h3 class="card-title">{{ node.attrs.title }}</h3>
        <p class="card-subtitle">{{ node.attrs.subtitle }}</p>
        
        <!-- 价格和链接区域 -->
        <div class="card-footer">
          <div class="price-section">
            <span class="price">{{ node.attrs.price }}</span>
            <span class="unit">{{ node.attrs.unit }}</span>
          </div>
          <div class="link-section">
            <span class="link-text">{{ node.attrs.linkText }}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="toolbar-wrapper">
      <travel-card-settings 
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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/core'
import TravelCardSettings from './TravelCardSettings.vue'

export default defineComponent<NodeViewProps>({
  name: 'TravelCardView',
  components: {
    NodeViewWrapper,
    TravelCardSettings,
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
  } as any,
  setup(props) {
    const showToolbar = ref(false)
    const fileInput = ref<HTMLInputElement | null>(null)
    
    const handleImageClick = () => {
      // 触发文件选择
      fileInput.value?.click()
    }
    
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (file) {
        // 创建文件URL
        const imageUrl = URL.createObjectURL(file)
        props.updateAttributes({ imageUrl })
        
        // 清空input值，允许重复选择同一文件
        target.value = ''
      }
    }
    
    const handleImageChange = (imageUrl: string) => {
      props.updateAttributes({ imageUrl })
    }
    
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement
      // 设置默认图片
      target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    }
    
    return {
      showToolbar,
      fileInput,
      handleImageClick,
      handleFileChange,
      handleImageChange,
      handleImageError
    }
  },
})
</script>

<style scoped>
.travel-card-wrapper {
  position: relative;
  margin: 16px 0;
  max-width: 600px;
}

.travel-card {
  display: flex;
  background: var(--bg-color, #ffffff);
  border: 2px solid var(--border-color, #2196f3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.travel-card:hover {
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
  padding: 8px;
}

.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.card-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #2196f3;
  line-height: 1;
}

.unit {
  font-size: 14px;
  color: #666;
}

.link-section {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #2196f3;
  font-size: 14px;
  transition: color 0.3s ease;
}

.link-section:hover {
  color: #1976d2;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.link-section:hover .arrow-icon {
  transform: translateX(2px);
}

.toolbar-wrapper {
  position: absolute;
  top: -40px;
  right: 0;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .travel-card {
    flex-direction: column;
  }
  
  .image-container {
    width: 100%;
    height: 200px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .price {
    font-size: 24px;
  }
}
</style>