<template>
  <div class="city-spot-settings">
    <div class="settings-toolbar">
      <button 
        @click="$emit('image-change')"
        class="toolbar-btn"
        title="更换图片"
      >
        🖼️
      </button>
      
      <button 
        @click="toggleQRCode"
        class="toolbar-btn"
        title="切换二维码"
      >
        📱
      </button>
      
      <button 
        @click="changeBackgroundColor"
        class="toolbar-btn"
        title="背景颜色"
      >
        🎨
      </button>
      
      <button 
        @click="$emit('delete')"
        class="toolbar-btn delete-btn"
        title="删除"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'

export default defineComponent({
  name: 'CitySpotSettings',
  props: {
    node: {
      type: Object as () => Node,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
    editor: {
      type: Object as () => Editor,
      required: true,
    },
    getPos: {
      type: Function,
      required: true,
    },
  },
  emits: ['image-change', 'delete'],
  methods: {
    toggleQRCode() {
      const hasQR = this.node.attrs.qrCode
      this.updateAttributes({
        qrCode: hasQR ? '' : 'enabled'
      })
    },
    
    changeBackgroundColor() {
      const colors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1']
      const currentIndex = colors.indexOf(this.node.attrs.backgroundColor)
      const nextIndex = (currentIndex + 1) % colors.length
      
      this.updateAttributes({
        backgroundColor: colors[nextIndex]
      })
    },
  },
})
</script>

<style scoped>
.city-spot-settings {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.settings-toolbar {
  display: flex;
  gap: 4px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.toolbar-btn:hover {
  background: #f3f4f6;
}

.delete-btn:hover {
  background: #fee2e2;
}
</style>