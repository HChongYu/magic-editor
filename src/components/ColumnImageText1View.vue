<template>
  <node-view-wrapper class="column-image-text1-wrapper template-node"
    :class="{ 'template-node-selected': diySelected }">
    <!-- 使用抽取的悬浮操作栏组件 -->
    <NodeFloatingActions v-if="selected" :node="node" :getPos="getPos" :editor="editor" :deleteNode="deleteNode" />

    <div v-for="(step, index) in node.attrs.steps" :key="index" class="column-image-text1-step">
      <!-- 图片区域 -->
      <div class="step-image-container">
        <img :src="step.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'"
          :alt="`步骤${index + 1}图片`" @error="handleImageError" class="step-image" />
      </div>
      <!-- 文字说明区域 - 使用SimpleParagraph -->
      <div class="step-text-container">
        <div class="editable-text" @click="focusText(index)">
          {{ step.text }}
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, type PropType, defineEmits } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import NodeFloatingActions from './NodeFloatingActions.vue'
import { compareNodes } from '@/utils/editorUtils'

interface ColumnImageText1Step {
  imageUrl: string
  text: string
}

interface ColumnImageText1NodeAttrs {
  steps: ColumnImageText1Step[]
}

export default defineComponent({
  name: 'ColumnImageText1View',
  components: {
    NodeViewWrapper,
    NodeFloatingActions,
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<(attributes: Partial<ColumnImageText1NodeAttrs>) => void>,
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
      diySelected: false
    }
  },
  watch: {
    'editor.state.selection.$from': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.diySelected = compareNodes(newVal, this.node, this.getPos);
          console.log(this.diySelected, 'diySelected')
        }
      },
    },
  },
  methods: {
    handleImageError(e: Event) {
      const target = e.target as HTMLImageElement
      target.src = 'https://via.placeholder.com/600x400?text=Image+not+found'
    },
    focusText(index: number) {
      // 这里可以实现点击文本时的编辑功能
      // 例如打开一个编辑对话框或直接修改文本
      const newSteps = [...this.node.attrs.steps];
      const newText = prompt('请输入步骤说明:', newSteps[index].text);
      if (newText !== null) {
        newSteps[index].text = newText;
        this.updateAttributes({ steps: newSteps });
      }
    },
  }
})
</script>

<style lang="scss" scoped>
.column-image-text1-wrapper {
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.column-image-text1-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-image-container {
  width: 100%;
  height: 180px;
  margin-bottom: 12px;
}

.step-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.step-text-container {
  width: 100%;
  text-align: center;
}

.editable-text {
  font-size: 16px;
  color: #333;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.editable-text:hover {
  background-color: #f5f5f5;
}
</style>