<template>
  <div class="editor-toolbar">
    <button class="toolbar-left-btn" title="模版库">
      <img src="@/assets/svg/redo.svg" />
      <text>模版库</text>
    </button>
    <div class="editor-right">
      <div class="toolbar-group-top">
        <button class="toolbar-btn" title="撤销" :disabled="!canUndo"
          @click="() => { editor.chain().focus().undo().run() }">
          <img src="@/assets/svg/revoke.svg" />
        </button>
        <button class="toolbar-btn" title="重做" :disabled="!canUndo"
          @click="() => { editor.chain().focus().redo().run() }">
          <img src="@/assets/svg/redo.svg">
        </button>
        <button class="toolbar-btn" title="格式刷" @click="() => {
          editor.commands.enableFormatPainter({
            once: false, // 设置为true表示单次使用，false表示持续使用直到再次点击
            getChain: () => this.editor.chain()
          })
        }">
          <img src="@/assets/svg/format.svg">
        </button>
        <div class="fill"></div>
        <button class="toolbar-btn" title="颜色" @click="toggleItalic">
          <img src="@/assets/svg/color.svg">
        </button>
        <button class="toolbar-btn" title="加粗" @click="() => { editor.chain().focus().toggleBold().run() }">
          <img src="@/assets/svg/bold.svg">
        </button>
        <button class="toolbar-btn" title="斜体" @click="() => { editor.chain().focus().toggleItalic().run() }">
          <img src="@/assets/svg/italic.svg">
        </button>
        <button class="toolbar-btn" title="下划线" @click="() => { editor.chain().focus().toggleUnderline().run() }">
          <img src="@/assets/svg/underline.svg">
        </button>
        <button class="toolbar-btn" title="背景色" @click="() => { }">
          <img src="@/assets/svg/backgroundColor.svg">
        </button>
        <div class="fill"></div>
        <button class="toolbar-btn" title="有序列表" @click="() => { editor.chain().focus().toggleOrderedList().run() }">
          <img src="@/assets/svg/orderedList.svg">
        </button>
        <button class="toolbar-btn" title="无序列表" @click="() => { editor.chain().focus().toggleBulletList().run() }">
          <img src="@/assets/svg/unorderedList.svg">
        </button>
        <button class="toolbar-btn" title="文字居左" @click="() => { editor.chain().focus().setTextAlign('left').run() }">
          <img src="@/assets/svg/alignLeft.svg">
        </button>
        <button class="toolbar-btn" title="文字居中" @click="() => { editor.chain().focus().setTextAlign('center').run() }">
          <img src="@/assets/svg/alignCenter.svg">
        </button>
        <button class="toolbar-btn" title="文字居右" @click="() => { editor.chain().focus().setTextAlign('right').run() }">
          <img src="@/assets/svg/alignRight.svg">
        </button>
        <button class="toolbar-btn" title="左右对齐"
          @click="() => { editor.chain().focus().setTextAlign('justify').run() }">
          <img src="@/assets/svg/alignJustify.svg">
        </button>
        <div class="fill"></div>
        <button class="toolbar-btn" title="引用" @click="() => { editor.chain().focus().toggleBlockquote().run() }">
          <img src="@/assets/svg/blockquote.svg">
        </button>
      </div>
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
  computed: {
    canUndo() {
      const result = this.editor.can().undo();
      return result;
    },
    canRedo() {
      const result = this.editor.can().redo();
      return result;
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
  padding: 12px;
}

.toolbar-left-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 12px; */
  border-radius: 4px;
  border: 1px solid #E1E6EF;
  background-color: #fff;
  min-height: 88px;
  min-width: 58px;

  img {
    margin-bottom: 3px;
    width: 20px;
    height: 20px;
  }

  text {
    font-size: 14px;
    font-weight: 400;
  }
}

.editor-right {
  flex: 1;
  margin-left: 10px;
}

.toolbar-group-top {
  display: flex;
  align-items: center;
  position: relative;
  gap: 12px;

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: #fff;
    outline: none;
    border: none;

    img {
      width: 16px;
      height: 16px;
    }
  }

  > :last-child {
    margin-right: 0;
    /* background-color: red; */
  }

  .toolbar-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .toolbar-btn.active {
    background: #e5e7eb;
    color: #111827;
  }

  .fill {
    width: 1px;
    height: 14px;

    background: #e5e7eb;
  }


}
</style
