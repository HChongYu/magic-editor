<template>
  <node-view-wrapper class="city-spot-wrapper" :class="{ 'city-spot-selected': diySelected }">
    <!-- 使用抽取的悬浮操作栏组件 -->
    <NodeFloatingActions v-if="diySelected" :node="node" :getPos="getPos" :editor="editor" :deleteNode="deleteNode" />

    <!-- 图片区域 -->
    <div class="image-container">
      <img :src="node.attrs.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'"
        :alt="node.attrs.title" @error="handleImageError" class="spot-image" />
      <!-- <input ref="fileInput" type="file" accept="image/*" style="display: none;" /> -->
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
import NodeFloatingActions from './NodeFloatingActions.vue' // 导入新组件
import { compareNodes } from '@/utils/editorUtils'

interface LargeImageText1Attrs {
  imageUrl: string
  title: string
  description: string
}

export default defineComponent({
  name: 'LargeImageText1View',
  components: {
    NodeViewWrapper,
    NodeViewContent,
    NodeFloatingActions, // 注册新组件
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<(attributes: Partial<LargeImageText1Attrs>) => void>,
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
      diySelected: false
    }
  },
  watch: {
    'editor.state.selection.$from': {
      handler(newVal, oldVal) {
        if(newVal){
          // 传入getPos函数作为第三个参数
          this.diySelected = compareNodes(newVal, this.node, this.getPos);
          console.log(this.diySelected);
        }
      },
    },
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
    }
  },
})
</script>

<style scoped>
.city-spot-wrapper {
  position: relative;
  margin: 2rem 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  /* overflow: hidden; */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.spot-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .spot-image {
  transform: scale(1.05);
}

.content-area {
  padding: 1.5rem;
}

.content-area :deep(h1),
.content-area :deep(h2),
.content-area :deep(h3) {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.content-area :deep(p) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.city-spot-selected {
  border: 2px solid #3b82f6;
  /* 蓝色边框 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  /* 蓝色阴影效果 */
}
</style>