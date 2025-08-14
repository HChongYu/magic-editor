<template>
  <div class="editor-toolbar">
    <!-- 基础格式按钮组 -->
    <div class="toolbar-group">
      <button class="toolbar-btn" title="标题" @click="toggleHeading">
        <span>H</span>
      </button>
      <button class="toolbar-btn" title="加粗" @click="toggleBold" :class="{ active: editor?.isActive('bold') }">
        <span class="icon-bold">B</span>
      </button>
      <button class="toolbar-btn" title="斜体" @click="toggleItalic" :class="{ active: editor?.isActive('italic') }">
        <span class="icon-italic">I</span>
      </button>
      <button class="toolbar-btn" title="下划线" @click="toggleUnderline" :class="{ active: editor?.isActive('underline') }">
        <span class="icon-underline">U</span>
      </button>
      <button class="toolbar-btn" title="高亮" @click="toggleHighlight" :class="{ active: editor?.isActive('highlight') }">
        <span class="icon-highlight">⚡</span>
      </button>
    </div>

    <!-- 列表按钮组 -->
    <div class="toolbar-group">
      <button class="toolbar-btn" title="有序列表" @click="toggleOrderedList" :class="{ active: editor?.isActive('orderedList') }">
        <span class="icon-ordered-list">1.</span>
      </button>
      <button class="toolbar-btn" title="无序列表" @click="toggleBulletList" :class="{ active: editor?.isActive('bulletList') }">
        <span class="icon-bullet-list">•</span>
      </button>
    </div>

    <!-- 对齐方式按钮组 -->
    <div class="toolbar-group">
      <button class="toolbar-btn" title="左对齐" @click="setTextAlign('left')" :class="{ active: editor?.isActive({ textAlign: 'left' }) }">
        <span class="icon-align-left">≡</span>
      </button>
      <button class="toolbar-btn" title="居中对齐" @click="setTextAlign('center')" :class="{ active: editor?.isActive({ textAlign: 'center' }) }">
        <span class="icon-align-center">≣</span>
      </button>
      <button class="toolbar-btn" title="右对齐" @click="setTextAlign('right')" :class="{ active: editor?.isActive({ textAlign: 'right' }) }">
        <span class="icon-align-right">≡</span>
      </button>
      <button class="toolbar-btn" title="两端对齐" @click="setTextAlign('justify')" :class="{ active: editor?.isActive({ textAlign: 'justify' }) }">
        <span class="icon-align-justify">≣</span>
      </button>
    </div>

    <!-- 引用按钮 -->
    <div class="toolbar-group">
      <button class="toolbar-btn" title="引用" @click="toggleBlockquote" :class="{ active: editor?.isActive('blockquote') }">
        <span class="icon-quote">"</span>
      </button>
    </div>

    <!-- 媒体插入按钮组 -->
    <div class="toolbar-group media-group">
      <button class="toolbar-btn" title="图片" @click="insertImage">
        <span class="icon-image">🖼️</span>
      </button>
      <button class="toolbar-btn" title="视频" @click="insertVideo">
        <span class="icon-video">🎬</span>
      </button>
      <button class="toolbar-btn" title="表情" @click="insertEmoji">
        <span class="icon-emoji">😊</span>
      </button>
      <button class="toolbar-btn" title="表格" @click="insertTable">
        <span class="icon-table">📊</span>
      </button>
    </div>

    <!-- 特殊内容按钮组 -->
    <div class="toolbar-group special-group">
      <button class="toolbar-btn" title="补充说明" @click="insertNote">
        <span class="icon-note">补充说明</span>
      </button>
      <button class="toolbar-btn" title="插入亮点" @click="insertHighlight">
        <span class="icon-highlight-point">插入亮点</span>
      </button>
      <button class="toolbar-btn" title="用车优势" @click="insertAdvantage">
        <span class="icon-advantage">用车优势</span>
      </button>
      <button class="toolbar-btn" title="联系方式" @click="insertContact">
        <span class="icon-contact">联系方式</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorToolbar',
  props: {
    editor: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 基础格式方法
    toggleHeading() {
      if (this.editor) {
        this.editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
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
    toggleHighlight() {
      if (this.editor) {
        this.editor.chain().focus().toggleHighlight().run()
      }
    },

    // 列表方法
    toggleOrderedList() {
      if (this.editor) {
        this.editor.chain().focus().toggleOrderedList().run()
      }
    },
    toggleBulletList() {
      if (this.editor) {
        this.editor.chain().focus().toggleBulletList().run()
      }
    },

    // 对齐方法
    setTextAlign(alignment) {
      if (this.editor) {
        this.editor.chain().focus().setTextAlign(alignment).run()
      }
    },

    // 引用方法
    toggleBlockquote() {
      if (this.editor) {
        this.editor.chain().focus().toggleBlockquote().run()
      }
    },

    // 媒体插入方法
    insertImage() {
      const url = prompt('请输入图片URL')
      if (url && this.editor) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
    insertVideo() {
      const url = prompt('请输入视频URL')
      if (url && this.editor) {
        // 需要安装视频扩展
        this.editor.chain().focus().setVideo({ src: url }).run()
      }
    },
    insertEmoji() {
      // 这里可以实现表情选择面板
      if (this.editor) {
        this.editor.chain().focus().insertContent('😊').run()
      }
    },
    insertTable() {
      if (this.editor) {
        this.editor.chain().focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      }
    },

    // 特殊内容插入方法
    insertNote() {
      if (this.editor) {
        this.editor.chain().focus().insertContent('<div class="note">补充说明内容</div>').run()
      }
    },
    insertHighlight() {
      if (this.editor) {
        // 这里可以插入自定义节点
        this.editor.chain().focus().insertContent('<div class="highlight-point">亮点内容</div>').run()
      }
    },
    insertAdvantage() {
      if (this.editor) {
        this.editor.chain().focus().insertContent('<div class="car-advantage">用车优势内容</div>').run()
      }
    },
    insertContact() {
      if (this.editor) {
        this.editor.chain().focus().insertContent('<div class="contact-info">联系方式内容</div>').run()
      }
    }
  }
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  gap: 4px;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 10px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  position: relative;
  border-right: 1px solid #e5e7eb;
  padding-right: 4px;
  margin-right: 4px;
}

.toolbar-group:last-child {
  border-right: none;
  padding-right: 0;
  margin-right: 0;
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
  background: #e5e7eb;
  color: #111827;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

.media-group .toolbar-btn,
.special-group .toolbar-btn {
  font-size: 12px;
  padding: 0 8px;
  width: auto;
}

.special-group .toolbar-btn {
  white-space: nowrap;
  color: #4b5563;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-toolbar {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 6px;
  }
  
  .toolbar-group {
    margin-bottom: 4px;
  }
  
  .special-group {
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
  }
  
  .special-group .toolbar-btn {
    margin-bottom: 4px;
    font-size: 11px;
  }
  
  .toolbar-btn {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
}
</style>