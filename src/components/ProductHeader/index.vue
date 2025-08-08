<template>
  <div class="product-header">
    <!-- 产品名称区域 -->
    <div 
      class="product-name-section"
      :class="{ 'hovered': isHovered('productName') }"
      @mouseenter="handleMouseEnter('productName')"
      @mouseleave="handleMouseLeave('productName')"
    >
      <div class="section-label">产品名称</div>
      <TiptapEditor 
        ref="tiptapEditor1"
        :extensions="customExtensions"
        :initial-content="editorContent1"
        :show-toolbar="showEditorToolbar"
        :height="100"
        @editor-ready="onEditorReady"
        @update="onEditorUpdate"
        @selection-update="onSelectionUpdate"
      />
      <div v-if="isHovered('productName')" class="hover-indicator">
        正在编辑产品名称
      </div>
    </div>
    
    <!-- 产品描述区域 -->
    <div 
      class="product-description-section"
      :class="{ 'hovered': isHovered('productDescription') }"
      @mouseenter="handleMouseEnter('productDescription')"
      @mouseleave="handleMouseLeave('productDescription')"
    >
      <div class="section-label">产品描述</div>
      <TiptapEditor 
        ref="tiptapEditor2"
        :extensions="customExtensions"
        :initial-content="editorContent2"
        :show-toolbar="showEditorToolbar"
        :height="100"
        @editor-ready="onEditorReady"
        @update="onEditorUpdate"
        @selection-update="onSelectionUpdate"
      />
      <div v-if="isHovered('productDescription')" class="hover-indicator">
        正在编辑产品描述
      </div>
    </div>
    
    <!-- 图片上传区域 -->
    <div 
      class="product-image-section"
      :class="{ 'hovered': isHovered('imageUpload') }"
      @mouseenter="handleMouseEnter('imageUpload')"
      @mouseleave="handleMouseLeave('imageUpload')"
    >
      <div class="section-label">产品图片</div>
      <div class="image-upload-area" @click="triggerImageUpload">
        <img v-if="localProductImage" :src="localProductImage" alt="产品图片" class="product-image" />
        <div v-else class="image-placeholder">
          <div class="upload-icon">📷</div>
          <div class="upload-text">点击上传产品图片</div>
        </div>
        <div v-if="isHovered('imageUpload')" class="hover-indicator">
          {{ localProductImage ? '点击更换图片' : '点击上传图片' }}
        </div>
      </div>
      <input 
        ref="imageInput" 
        type="file" 
        accept="image/*" 
        style="display: none" 
        @change="handleImageUpload"
      />
    </div>
  </div>
</template>

<script>
import TiptapEditor from '@/components/TiptapEditor'
import StarterKit from '@tiptap/starter-kit'
import { EmojiNode } from '@/extensions/EmojiNode'
import { DoubleTextNode } from '@/extensions/DoubleTextNode'
import TextBlockNode from '@/extensions/TextBlockNode'
export default {
  name: 'ProductHeader',
  components: {
    TiptapEditor
  },
  props: {
    productName: {
      type: String,
      default: '产品名称'
    },
    productDescription: {
      type: String,
      default: '产品描述'
    },
    productImage: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      localProductName: this.productName,
      localProductDescription: this.productDescription,
      localProductImage: this.productImage,
      editorContent1: '<p>产品名称</p>',
      editorContent2: '<p>产品描述</p>',
      customExtensions: [
        StarterKit,
        TextBlockNode
      ],
      // hover 状态管理
      hoverStates: {
        productName: false,
        productDescription: false,
        imageUpload: false
      },
      // 编辑器配置
      showEditorToolbar: true
    }
  },
  watch: {
    productName(newVal) {
      this.localProductName = newVal
    },
    productDescription(newVal) {
      this.localProductDescription = newVal
    },
    productImage(newVal) {
      this.localProductImage = newVal
    }
  },
  methods: {
    triggerImageUpload() {
      this.$refs.imageInput.click()
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.localProductImage = e.target.result
          this.$emit('image-change', e.target.result)
        }
        reader.readAsDataURL(file)
      }
    },
    updateProductName() {
      this.$emit('name-change', this.localProductName)
    },
    updateProductDescription() {
      this.$emit('description-change', this.localProductDescription)
    },
    // hover 事件处理方法
    handleMouseEnter(element) {
      this.hoverStates[element] = true
      this.$emit('hover-enter', element)
    },
    handleMouseLeave(element) {
      this.hoverStates[element] = false
      this.$emit('hover-leave', element)
    },
    // 检查是否处于 hover 状态
    isHovered(element) {
      return this.hoverStates[element]
    },
    // 编辑器事件处理
    onEditorReady(editor) {
      console.log('编辑器已准备就绪', editor)
    },
    onEditorUpdate(content) {
      console.log('编辑器内容更新', content)
    },
    onSelectionUpdate(selection) {
      console.log('编辑器选择更新', selection)
    }
  }
}
</script>

<style scoped>
.product-header {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.product-header-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.product-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-name-section {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.product-name-section.hovered {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-name-input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  background: white;
  transition: border-color 0.2s ease;
}

.product-name-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.product-description-section {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.product-description-section.hovered {
  background: linear-gradient(135deg, #fff3e0 0%, #f1f8e9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-description-input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.product-description-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.product-image-section {
  flex-shrink: 0;
  width: 200px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.product-image-section.hovered {
  background: linear-gradient(135deg, #fce4ec 0%, #e8f5e8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-upload-area {
  width: 100%;
  height: 150px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.image-upload-area:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6c757d;
}

.upload-icon {
  font-size: 32px;
  opacity: 0.7;
}

.upload-text {
  font-size: 12px;
  text-align: center;
  line-height: 1.3;
}

/* 区域标签样式 */
.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.hovered .section-label {
  opacity: 1;
  color: #007bff;
}

/* hover 指示器样式 */
.hover-indicator {
  position: absolute;
  top: 5px;
  right: 10px;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  animation: fadeInScale 0.3s ease;
  z-index: 10;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .product-header-content {
    flex-direction: column;
  }
  
  .product-image-section {
    width: 100%;
  }
  
  .image-upload-area {
    height: 120px;
  }
  
  .hover-indicator {
    position: static;
    margin-top: 5px;
    text-align: center;
  }
}
</style>