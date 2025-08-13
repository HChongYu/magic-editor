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
import CitySpotSettings from './CitySpotSettings.vue'
import NodeFloatingActions from './NodeFloatingActions.vue' // 导入新组件
import { compareNodes } from '@/utils/editorUtils'

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
    NodeFloatingActions, // 注册新组件
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

    addNewNode(): void {
      // 获取当前节点的位置
      const pos = this.getPos()
      // 在当前节点后插入新的城市景点节点
      this.editor.chain().focus().insertContentAt(pos + this.node.nodeSize, {
        type: 'citySpotNode',
        attrs: {
          imageUrl: 'https://via.placeholder.com/600x400?text=New+City+Spot',
        },
        content: [
          {
            type: 'simpleHeading',
            attrs: { text: '新城市景点' },
            content: [{ type: 'text', text: '新城市景点' }]
          },
          {
            type: 'simpleParagraph',
            attrs: { text: '城市描述' },
            content: [{ type: 'text', text: '城市描述' }]
          }
        ],
      }).run()
    },

    moveNodeDown(): void {
      // 获取当前节点的位置
      const pos = this.getPos()
      // 获取文档中的下一个节点
      const { doc } = this.editor.state
      const $pos = doc.resolve(pos)
      const after = $pos.after()

      // 如果有下一个节点，则交换位置
      if (after < doc.content.size) {
        this.editor.chain().focus()
          .command(({ tr }) => {
            // 创建一个事务来移动节点
            tr.delete(pos, pos + this.node.nodeSize)
            tr.insert(after, this.node)
            return true
          })
          .run()
      }
    },

    duplicateNode(): void {
      // 获取当前节点的位置
      const pos = this.getPos()
      // 复制当前节点并在其后插入
      const nodeJSON = this.node.toJSON()
      this.editor.chain().focus().insertContentAt(pos + this.node.nodeSize, nodeJSON).run()
    },
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