<template>
  <div class="floating-actions" @click.stop="()=>{}">
    <button class="action-btn add-btn" @click="addCurrentNodeClick" title="添加新节点">
      <span>+</span>
    </button>
    <button class="action-btn move-down-btn" @click="moveNodeDownClick" title="向下移动">
      <span>↓</span>
    </button>
    <button class="action-btn delete-btn" @click="deleteNode" title="删除节点">
      <span>×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import { addCurrentNode, moveNodeDown } from '@/utils/editorUtils'

const props = defineProps({
  node: {
    type: Object as PropType<Node>,
    required: true,
  },
  getPos: {
    type: Function as PropType<() => number>,
    required: true,
  },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  deleteNode: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const emit = defineEmits(['add', 'moveDown', 'duplicate', 'delete', 'update'])

function addCurrentNodeClick() {
  // 确保传递正确的参数
  console.log(props.node.type.name)
  if (props.editor && props.node && props.getPos) {
    addCurrentNode(props.editor, props.node, props.getPos)
  }
}

function moveNodeDownClick() {
  if (props.editor && props.node && props.getPos) {
    moveNodeDown(props.editor, props.node, props.getPos)
  }
}
</script>

<style scoped>
.floating-actions {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background-color: #4b5563;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  position: relative;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.add-btn:hover {
  background-color: rgba(16, 185, 129, 0.3);
}

.move-down-btn:hover {
  background-color: rgba(59, 130, 246, 0.3);
}

.duplicate-btn:hover {
  background-color: rgba(245, 158, 11, 0.3);
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.3);
}
</style>