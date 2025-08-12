<template>
  <node-view-wrapper class="city-spot-wrapper" >
    <!-- 图片区域 -->
    <div class="image-container" @click="handleImageClick">
      <img 
        :src="node.attrs.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'"
        :alt="node.attrs.title"
        @error="handleImageError"
        class="spot-image"
      />
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        @change="handleFileChange"
        style="display: none;"
      />
    </div>

    <!-- 内容区域 -->
    <NodeViewContent class="content-area">
      
    </NodeViewContent>

  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, nextTick, type PropType } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import CitySpotSettings from './CitySpotSettings.vue'

interface CitySpotNodeAttrs {
  imageUrl: string
  title: string
  description: string
  qrCode?: string
  backgroundColor: string
  borderColor: string
}

export default defineComponent({
  name: 'CitySpotView',
  components: {
    NodeViewWrapper,
    NodeViewContent,
    CitySpotSettings,
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<(attributes: Partial<CitySpotNodeAttrs>) => void>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    getPos: {
      type: Function as PropType<() => number>,
      required: true,
    },
    deleteNode: {
      type: Function as PropType<() => void>,
      required: true,
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
    handleImageClick(): void {
      (this.$refs.fileInput as HTMLInputElement)?.click()
    },
    
    handleFileChange(event: Event): void {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.updateAttributes({
            imageUrl: e.target?.result as string
          })
        }
        reader.readAsDataURL(file)
      }
    },
    
    handleImageError(event: Event): void {
      const target = event.target as HTMLImageElement
      target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'
    },
    
    handleImageChange(imageUrl: string): void {
      this.updateAttributes({ imageUrl })
    },
    
    editTitle(): void {
      this.editingTitle = true
      this.tempTitle = this.node.attrs.title
      nextTick(() => {
        (this.$refs.titleInput as HTMLInputElement)?.focus()
      })
    },
    
    saveTitle(): void {
      if (this.tempTitle.trim()) {
        this.updateAttributes({ title: this.tempTitle.trim() })
      }
      this.editingTitle = false
    },
    
    editDescription(): void {
      this.editingDescription = true
      this.tempDescription = this.node.attrs.description
      nextTick(() => {
        (this.$refs.descriptionInput as HTMLTextAreaElement)?.focus()
      })
    },
    
    saveDescription(): void {
      if (this.tempDescription.trim()) {
        this.updateAttributes({ description: this.tempDescription.trim() })
      }
      this.editingDescription = false
    },
    
    cancelEdit(): void {
      this.editingTitle = false
      this.editingDescription = false
      this.tempTitle = ''
      this.tempDescription = ''
    },
    
    handleDelete(): void {
      if (this.deleteNode) {
        this.deleteNode()
      }
    },
  },
})
</script>

<style scoped>
.content-editable {
  outline: none;
}

.content-editable h2.spot-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.content-editable p.spot-description {
  font-size: 1rem;
  line-height: 1.5;
  color: #666;
  margin: 0;
}
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toolbar {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  gap: 4px;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.image-container {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .spot-image {
  transform: scale(1.05);
}

.content-area {
  padding: 16px;
}

.title-section,
.description-section {
  margin-bottom: 12px;
}

.editable-field {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 4px 8px;
  margin: -4px -8px;
}

.editable-field:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.editable-field.empty {
  color: #9ca3af;
  font-style: italic;
}

.spot-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #1f2937;
  line-height: 1.3;
}

.spot-description {
  font-size: 1rem;
  line-height: 1.5;
  color: #6b7280;
  margin: 0;
}

.title-input,
.description-input {
  width: 100%;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.title-input {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.description-input {
  font-size: 1rem;
  color: #6b7280;
  resize: vertical;
  min-height: 60px;
}

.title-input:focus,
.description-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>