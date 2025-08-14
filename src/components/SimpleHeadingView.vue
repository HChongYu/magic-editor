<template>
  <node-view-wrapper class="simple-heading-wrapper">
    <div 
      class="heading-container" 
      :class="'h' + node.attrs.level"
    >
      <node-view-content class="heading-content" />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { onMounted } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  node: {
    type: Object,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

onMounted(() => {
  // 在组件挂载时，确保BubbleMenu已经配置好
  setupBubbleMenu()
})

function setupBubbleMenu() {
  // 确保编辑器实例存在
  if (!props.editor) return
  
  // 检查编辑器是否已经有了BubbleMenu扩展
  const hasBubbleMenu = props.editor.extensionManager.extensions.some(
    extension => extension.name === 'bubbleMenu'
  )
  
  if (!hasBubbleMenu) {
    console.warn('BubbleMenu扩展未在编辑器中注册，请在编辑器配置中添加BubbleMenu扩展')
  }
}

function increaseLevel() {
  const newLevel = Math.max(1, props.node.attrs.level - 1)
  props.updateAttributes({ level: newLevel })
}

function decreaseLevel() {
  const newLevel = Math.min(3, props.node.attrs.level + 1)
  props.updateAttributes({ level: newLevel })
}

function applyBold() {
  // 保存当前选区
  const { from, to } = props.editor.state.selection
  
  // 应用粗体
  props.editor.chain().focus().setTextSelection({ from, to }).toggleBold().run()
}

function applyItalic() {
  // 保存当前选区
  const { from, to } = props.editor.state.selection
  
  // 应用斜体
  props.editor.chain().focus().setTextSelection({ from, to }).toggleItalic().run()
}
</script>

<style scoped>
.simple-heading-wrapper {
  position: relative;
}

.heading-container {
  position: relative;
  cursor: text;
}

.heading-container.h1 {
  font-size: 2em;
  font-weight: bold;
}

.heading-container.h2 {
  font-size: 1.5em;
  font-weight: bold;
}

.heading-container.h3 {
  font-size: 1.17em;
  font-weight: bold;
}
</style>