<template>
  <div class="rich-text-toolbar">
    <!-- 字体样式按钮组 -->
    <div class="toolbar-group">
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('bold') }"
        @click="toggleBold"
        title="粗体"
      >
        <strong>B</strong>
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('italic') }"
        @click="toggleItalic"
        title="斜体"
      >
        <em>I</em>
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('underline') }"
        @click="toggleUnderline"
        title="下划线"
      >
        <u>U</u>
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('strike') }"
        @click="toggleStrike"
        title="删除线"
      >
        <s>S</s>
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="toolbar-divider"></div>

    <!-- 字体大小 -->
    <div class="toolbar-group">
      <select class="font-size-select" @change="setFontSize" v-model="currentFontSize">
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="28">28</option>
        <option value="32">32</option>
      </select>
    </div>

    <!-- 分隔线 -->
    <div class="toolbar-divider"></div>

    <!-- 文本颜色 -->
    <div class="toolbar-group">
      <button 
        class="toolbar-btn color-btn"
        @click="toggleColorPicker"
        title="文本颜色"
      >
        <span class="color-icon">A</span>
        <span class="color-bar" :style="{ backgroundColor: currentTextColor }"></span>
      </button>
      
      <div v-if="showColorPicker" class="color-picker">
        <div class="color-grid">
          <div 
            v-for="color in colors" 
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="setTextColor(color)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="toolbar-divider"></div>

    <!-- 对齐方式 -->
    <div class="toolbar-group">
      <button 
        class="toolbar-btn"
        :class="{ active: isActive({ textAlign: 'left' }) }"
        @click="setTextAlign('left')"
        title="左对齐"
      >
        ≡
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive({ textAlign: 'center' }) }"
        @click="setTextAlign('center')"
        title="居中对齐"
      >
        ≣
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive({ textAlign: 'right' }) }"
        @click="setTextAlign('right')"
        title="右对齐"
      >
        ≡
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive({ textAlign: 'justify' }) }"
        @click="setTextAlign('justify')"
        title="两端对齐"
      >
        ≣
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="toolbar-divider"></div>

    <!-- 列表 -->
    <div class="toolbar-group">
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('bulletList') }"
        @click="toggleBulletList"
        title="无序列表"
      >
        •••
      </button>
      
      <button 
        class="toolbar-btn"
        :class="{ active: isActive('orderedList') }"
        @click="toggleOrderedList"
        title="有序列表"
      >
        123
      </button>
    </div>

    <!-- 分隔线 -->
    <div class="toolbar-divider"></div>

    <!-- 其他功能 -->
    <div class="toolbar-group">
      <button 
        class="toolbar-btn"
        @click="insertLink"
        title="插入链接"
      >
        🔗
      </button>
      
      <button 
        class="toolbar-btn"
        @click="undo"
        title="撤销"
      >
        ↶
      </button>
      
      <button 
        class="toolbar-btn"
        @click="redo"
        title="重做"
      >
        ↷
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RichTextToolbar',
  props: {
    editor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentFontSize: '16',
      currentTextColor: '#000000',
      showColorPicker: false,
      colors: [
        '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
        '#ff0000', '#ff6600', '#ffcc00', '#33cc00', '#0099cc', '#6633cc',
        '#cc0066', '#ff3366', '#ff9933', '#ccff33', '#33ffcc', '#3366ff',
        '#9933ff', '#ff33cc'
      ]
    }
  },
  methods: {
    isActive(name) {
      if (!this.editor) return false
      return this.editor.isActive(name)
    },
    
    toggleBold() {
      if (this.editor) {
        this.editor.chain().focus().toggleBold().run()
      }
    },
    
    toggleItalic() {
      if (this.editor) {
        this.editor.chain().focus().toggleItalic().run()
      }
    },
    
    toggleUnderline() {
      if (this.editor) {
        this.editor.chain().focus().toggleUnderline().run()
      }
    },
    
    toggleStrike() {
      if (this.editor) {
        this.editor.chain().focus().toggleStrike().run()
      }
    },
    
    setFontSize() {
      // 字体大小功能需要额外的扩展支持
      console.log('Font size changed to:', this.currentFontSize)
      // 可以通过 CSS 样式来实现基础的字体大小控制
      if (this.editor) {
        this.editor.chain().focus().run()
      }
    },
    
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker
    },
    
    setTextColor(color) {
      this.currentTextColor = color
      this.showColorPicker = false
      if (this.editor) {
        this.editor.chain().focus().setColor(color).run()
      }
    },
    
    setTextAlign(alignment) {
      // TextAlign 扩展未安装，暂时禁用此功能
      console.log('TextAlign extension not available:', alignment)
    },
    
    toggleBulletList() {
      if (this.editor) {
        this.editor.chain().focus().toggleBulletList().run()
      }
    },
    
    toggleOrderedList() {
      if (this.editor) {
        this.editor.chain().focus().toggleOrderedList().run()
      }
    },
    
    insertLink() {
      const url = prompt('请输入链接地址:')
      if (url && this.editor) {
        this.editor.chain().focus().setLink({ href: url }).run()
      }
    },
    
    undo() {
      if (this.editor) {
        this.editor.chain().focus().undo().run()
      }
    },
    
    redo() {
      if (this.editor) {
        this.editor.chain().focus().redo().run()
      }
    }
  },
  
  mounted() {
    // 点击外部关闭颜色选择器
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showColorPicker = false
      }
    })
  }
}
</script>

<style scoped>
.rich-text-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 4px;
  flex-wrap: wrap;
  position: relative;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  position: relative;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  position: relative;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.toolbar-btn.active {
  background: #3b82f6;
  color: white;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 4px;
}

.font-size-select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  min-width: 50px;
}

.font-size-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.color-btn {
  flex-direction: column;
  padding: 4px;
}

.color-icon {
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
}

.color-bar {
  width: 20px;
  height: 3px;
  margin-top: 2px;
  border-radius: 1px;
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  width: 120px;
}

.color-item {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: transform 0.1s ease;
}

.color-item:hover {
  transform: scale(1.1);
  border-color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rich-text-toolbar {
    padding: 6px 8px;
    gap: 2px;
  }
  
  .toolbar-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .toolbar-divider {
    height: 20px;
    margin: 0 2px;
  }
  
  .font-size-select {
    min-width: 45px;
    font-size: 11px;
  }
}

/* 动画效果 */
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.toolbar-btn:active {
  animation: buttonPress 0.1s ease;
}
</style>