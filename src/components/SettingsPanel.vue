<template>
  <div class="settings-panel">
    <div class="setting">
      <label>Top Color</label>
      <div class="color-picker-wrapper">
        <div class="preset-colors">
          <div 
            v-for="color in presetColors" 
            :key="color" 
            class="color-preset" 
            :style="{ backgroundColor: color }"
            :class="{ active: node.attrs.topColor === color }"
            @click="updateAttribute('topColor', color)"
          ></div>
        </div>
        <input 
          type="color" 
          class="color-input"
          @input="updateAttribute('topColor', $event.target.value)" 
          :value="node.attrs.topColor" 
        />
      </div>
    </div>
    <div class="setting">
      <label>Bottom Color</label>
      <div class="color-picker-wrapper">
        <div class="preset-colors">
          <div 
            v-for="color in presetColors" 
            :key="color" 
            class="color-preset" 
            :style="{ backgroundColor: color }"
            :class="{ active: node.attrs.bottomColor === color }"
            @click="updateAttribute('bottomColor', color)"
          ></div>
        </div>
        <input 
          type="color" 
          class="color-input"
          @input="updateAttribute('bottomColor', $event.target.value)" 
          :value="node.attrs.bottomColor" 
        />
      </div>
    </div>
    <div class="setting">
      <label>Top Font Size</label>
      <select @change="updateAttribute('topFontSize', $event.target.value)" :value="node.attrs.topFontSize">
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>
    <div class="setting">
      <label>Bottom Font Size</label>
      <select @change="updateAttribute('bottomFontSize', $event.target.value)" :value="node.attrs.bottomFontSize">
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>
    <div class="setting">
      <button @click="copyNode" class="copy-button" title="复制此节点">
        📋 复制节点
      </button>
    </div>
    <div class="setting">
      <button @click="deleteNode" class="delete-button" title="删除此节点">
        🗑️ 删除节点
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPanel',
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
  },
  data() {
    return {
      fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '28px'],
      presetColors: [
        '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
        '#ff0000', '#ff6600', '#ffcc00', '#33cc00', '#0099cc', '#6633cc',
        '#ff3366', '#ff9933', '#ffff33', '#66ff33', '#33ccff', '#9966ff',
        '#cc0000', '#cc6600', '#cccc00', '#00cc00', '#0066cc', '#6600cc'
      ],
    }
  },
  methods: {
    updateAttribute(name, value) {
      this.updateAttributes({ [name]: value })
    },
    copyNode() {
      try {
        // 获取当前节点的位置
        const pos = this.getPos()
        if (pos === undefined || pos === null) {
          console.error('无法获取节点位置')
          return
        }
        
        // 获取编辑器状态
        const { state } = this.editor
        const { tr, selection } = state
        
        // 直接复制整个节点（包括所有属性和内容）
        const nodeCopy = this.node.copy(this.node.content)
        
        // 计算插入位置（在当前光标位置）
        const insertPos = selection.to
        
        // 插入复制的节点
        const newTr = tr.insert(insertPos, nodeCopy)
        this.editor.view.dispatch(newTr)
        
        console.log('DoubleTextNode 已复制')
      } catch (error) {
        console.error('复制节点时出错:', error)
        
        // 回退方案：使用编辑器的复制命令
        try {
          // 选择当前节点
          const nodePos = this.getPos()
          const nodeSelection = this.editor.state.tr.setSelection(
            this.editor.state.selection.constructor.create(
              this.editor.state.doc,
              nodePos,
              nodePos + this.node.nodeSize
            )
          )
          this.editor.view.dispatch(nodeSelection)
          
          // 复制选中的内容
          document.execCommand('copy')
          
          // 移动光标到末尾并粘贴
          const { selection } = this.editor.state
          this.editor.chain().focus().setTextSelection(selection.to).run()
          document.execCommand('paste')
          
          console.log('使用回退方案复制节点')
        } catch (fallbackError) {
          console.error('回退复制方案也失败:', fallbackError)
        }
      }
    },
    deleteNode() {
      // 使用更可靠的方法删除节点
      try {
        // 方法1: 使用getPos方法获取节点位置
        const pos = this.getPos()
        if (pos !== undefined && pos !== null) {
          const tr = this.editor.state.tr.delete(pos, pos + this.node.nodeSize)
          this.editor.view.dispatch(tr)
          return
        }
        
        // 方法2: 通过选择当前节点然后删除
        const { view } = this.editor
        const { state } = view
        
        // 查找当前节点在文档中的位置
        let targetPos = null
        state.doc.descendants((node, pos) => {
          // 比较节点类型和属性来确定是否是同一个节点
          if (node.type.name === this.node.type.name && 
              JSON.stringify(node.attrs) === JSON.stringify(this.node.attrs) &&
              node.textContent === this.node.textContent) {
            targetPos = pos
            return false // 停止遍历
          }
        })
        
        if (targetPos !== null) {
          const tr = state.tr.delete(targetPos, targetPos + this.node.nodeSize)
          view.dispatch(tr)
        } else {
          console.warn('无法找到要删除的节点')
        }
      } catch (error) {
        console.error('删除节点时出错:', error)
      }
    },
  },
}
</script>

<style scoped>
.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

.copy-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  width: 100%;
}

.copy-button:hover {
  background-color: #218838;
}

.copy-button:active {
  background-color: #1e7e34;
}

.delete-button {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  width: 100%;
}

.delete-button:hover {
  background-color: #ff3742;
}

.delete-button:active {
  background-color: #ff2731;
}
.setting {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.setting label {
  font-size: 12px;
  font-weight: bold;
}
.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.preset-colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 3px;
}
.color-preset {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.color-preset:hover {
  transform: scale(1.1);
  border-color: #007acc;
}
.color-preset.active {
  border-color: #007acc;
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.3);
}
.color-input {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>