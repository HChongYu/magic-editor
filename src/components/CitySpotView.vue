<template>
  <node-view-wrapper 
    class="city-spot-wrapper"
    @mouseover="showToolbar = true" 
    @mouseleave="showToolbar = false"
    :style="{
      '--bg-color': node.attrs.backgroundColor,
      '--border-color': node.attrs.borderColor
    }"
  >
    <div class="city-spot-card">
      <!-- 主图片区域 -->
      <div class="main-image-container" @click="handleImageClick">
        <img 
          :src="node.attrs.imageUrl" 
          :alt="node.attrs.title"
          class="main-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <div class="overlay-text">点击更换图片</div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="content-section">
        <h2 class="spot-title" @click="editTitle" v-if="!editingTitle">{{ node.attrs.title }}</h2>
        <input 
          v-else
          v-model="tempTitle"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.esc="cancelEdit"
          class="title-input"
          ref="titleInput"
        />
        
        <p class="spot-description" @click="editDescription" v-if="!editingDescription">{{ node.attrs.description }}</p>
        <textarea 
          v-else
          v-model="tempDescription"
          @blur="saveDescription"
          @keyup.esc="cancelEdit"
          class="description-input"
          ref="descriptionInput"
        ></textarea>
        
        <!-- 二维码区域 -->
        <div class="qr-section" v-if="node.attrs.qrCode">
          <div class="qr-placeholder">
            <div class="qr-icon">📱</div>
            <span class="qr-text">扫码查看详情</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="toolbar-wrapper">
      <city-spot-settings 
        :node="node" 
        :update-attributes="updateAttributes" 
        :editor="editor" 
        :get-pos="getPos"
        @image-change="handleImageChange"
        @delete="handleDelete"
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
import CitySpotSettings from './CitySpotSettings.vue'

export default {
  name: 'CitySpotView',
  components: {
    NodeViewWrapper,
    CitySpotSettings,
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
      editingTitle: false,
      editingDescription: false,
      tempTitle: '',
      tempDescription: '',
    }
  },
  methods: {
    handleImageClick() {
      this.$refs.fileInput.click()
    },
    
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.updateAttributes({
            imageUrl: e.target.result
          })
        }
        reader.readAsDataURL(file)
      }
    },
    
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
    },
    
    handleImageChange(imageUrl) {
      this.updateAttributes({ imageUrl })
    },
    
    editTitle() {
      this.editingTitle = true
      this.tempTitle = this.node.attrs.title
      this.$nextTick(() => {
        this.$refs.titleInput?.focus()
      })
    },
    
    saveTitle() {
      if (this.tempTitle.trim()) {
        this.updateAttributes({ title: this.tempTitle.trim() })
      }
      this.editingTitle = false
    },
    
    editDescription() {
      this.editingDescription = true
      this.tempDescription = this.node.attrs.description
      this.$nextTick(() => {
        this.$refs.descriptionInput?.focus()
      })
    },
    
    saveDescription() {
      if (this.tempDescription.trim()) {
        this.updateAttributes({ description: this.tempDescription.trim() })
      }
      this.editingDescription = false
    },
    
    cancelEdit() {
      this.editingTitle = false
      this.editingDescription = false
      this.tempTitle = ''
      this.tempDescription = ''
    },
    
    handleDelete() {
      if (this.deleteNode) {
        this.deleteNode()
      }
    },
  },
}
</script>

<style scoped>
.city-spot-wrapper {
  position: relative;
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: var(--bg-color, #ffffff);
  border: 2px solid var(--border-color, #e5e7eb);
  transition: all 0.3s ease;
}

.city-spot-wrapper:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.city-spot-card {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.main-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image-container:hover .main-image {
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

.main-image-container:hover .image-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.content-section {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.spot-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 16px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.spot-title:hover {
  color: #3b82f6;
}

.title-input {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 0 0 16px 0;
  background: white;
  outline: none;
}

.spot-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.spot-description:hover {
  color: #374151;
}

.description-input {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 12px;
  margin: 0 0 20px 0;
  background: white;
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.qr-section {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
}

.qr-icon {
  font-size: 18px;
}

.toolbar-wrapper {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-section {
    padding: 16px;
  }
  
  .spot-title {
    font-size: 24px;
  }
  
  .main-image-container {
    height: 200px;
  }
}
</style>