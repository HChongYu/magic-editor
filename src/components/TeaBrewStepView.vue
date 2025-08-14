<template>
  <node-view-wrapper class="tea-brew-step-wrapper" :class="{ 'tea-brew-step-selected': diySelected }">
    <!-- 使用抽取的悬浮操作栏组件 -->
    <NodeFloatingActions v-if="diySelected" :node="node" :getPos="getPos" :editor="editor" :deleteNode="deleteNode" />

    <div class="tea-brew-steps-container">
      <!-- 遍历步骤 -->
      <div v-for="(step, index) in node.attrs.steps" :key="index" class="tea-brew-step">
        <!-- 图片区域 -->
        <div class="step-image-container">
          <img :src="step.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'" 
               :alt="`步骤${index + 1}图片`" 
               @error="handleImageError" 
               class="step-image" />
        </div>

        <!-- 文字说明区域 - 使用SimpleParagraph -->
        <div class="step-text-container">
          <div class="editable-text" @click="focusText(index)">
            {{ step.text }}
          </div>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import NodeFloatingActions from './NodeFloatingActions.vue'
import { compareNodes } from '@/utils/editorUtils'

interface TeaBrewStep {
  imageUrl: string
  text: string
}

interface TeaBrewStepNodeAttrs {
  steps: TeaBrewStep[]
}

export default defineComponent({
  name: 'TeaBrewStepView',
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
      type: Function as PropType<(attributes: Partial<TeaBrewStepNodeAttrs>) => void>,
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
      handler(newVal) {
        if (newVal) {
          this.diySelected = compareNodes(newVal, this.node, this.getPos);
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

<style scoped>
.tea-brew-step-wrapper {
  position: relative;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: white;
  transition: box-shadow 0.3s ease;
  padding: 16px;
}

.tea-brew-step-selected {
  box-shadow: 0 0 0 2px #4285f4;
}

.tea-brew-steps-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.tea-brew-step {
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