<template>
  <div class="holy-grail-layout">
    <!-- 头部 -->
    <header class="header">
      <h1>Tiptap 扩展示例 - 圣杯布局</h1>
    </header>

    <!-- 主体容器 -->
    <div class="container">
      <!-- 左侧边栏 -->
      <LeftSidebar :total-docs="totalDocs" :today-edits="todayEdits" :word-count="wordCount" @nav-click="handleNavClick"
        @tool-click="handleToolClick" @insert-template="insertTemplate" />

      <!-- 主内容区（优先加载） -->
      <div class="main">
        <ProductHeader :product-name="productName" :product-description="productDescription"
          :product-image="productImage" @name-change="handleProductNameChange"
          @description-change="handleProductDescriptionChange" @image-change="handleProductImageChange" />
        <!-- 编辑器区域 -->
        <div class="editor-container">
          <TiptapEditor ref="tiptapEditor" :extensions="customExtensions" :initial-content="editorContent"
            :show-toolbar="showEditorToolbar" @editor-ready="onEditorReady" @update="onEditorUpdate"
            @selection-update="onSelectionUpdate" />
        </div>
        <div v-html="editorHTML" class="editor-html"></div>

        <!-- 富文本工具栏演示区域 -->
        <div class="toolbar-demo-container">
          <RichTextToolbarDemo />
        </div>
      </div>

      <!-- 右侧边栏 -->
      <RightSidebar :show-toolbar="showEditorToolbar" :extensions-count="customExtensions.length"
        :has-editor-instance="!!editorInstance" @get-content="getEditorContent" @set-content="setEditorContent"
        @focus-editor="focusEditor" @clear-editor="clearEditor" @toggle-toolbar="toggleToolbar"
        @font-size-change="handleFontSizeChange" @theme-change="handleThemeChange" />
    </div>

    <!-- 底部 -->
    <footer class="footer">
      <p>&copy; 2024 Tiptap Editor Demo. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import TiptapEditor from '../components/TiptapEditor'
import LeftSidebar from '../components/LeftSidebar'
import RightSidebar from '../components/RightSidebar'
import ProductHeader from '../components/ProductHeader'
import RichTextToolbarDemo from '../components/RichTextToolbarDemo'
// 导入Tiptap扩展
import StarterKit from '@tiptap/starter-kit'
import { EmojiNode } from '@/extensions/EmojiNode'
import { DoubleTextNode } from '@/extensions/DoubleTextNode'
import TextBlockNode from '@/extensions/TextBlockNode'
import TravelCardNode from '@/extensions/TravelCardNode'
import ImageTextListNode from '@/extensions/ImageTextListNode'
import { RichTravelCardNode } from '@/extensions/RichTravelCardNode'
import {
  RichCardTitleNode,
  RichCardSubtitleNode,
  RichCardPriceNode,
  RichCardUnitNode,
  RichCardLinkNode
} from '@/extensions/RichCardNodes'
import { TemplateNodeType } from '@/enums'



export default {
  name: 'WorkSpace',
  components: {
    TiptapEditor,
    LeftSidebar,
    RightSidebar,
    RichTextToolbarDemo,
    ProductHeader,
  },
  data() {
    return {
      productName: '产品名称',
      productDescription: '产品描述',
      productImage: null,

      // TiptapEditor相关数据
      editorInstance: null,
      showEditorToolbar: true,
      editorContent: '<h1>欢迎使用改造后的编辑器</h1><p>这个编辑器的扩展是从外部注入的！</p>',
      editorHTML: '',
      // 自定义扩展配置
      customExtensions: [
        StarterKit,
        EmojiNode,
        DoubleTextNode,
        TextBlockNode,
        TravelCardNode,
        ImageTextListNode,
        RichTravelCardNode,
        RichCardTitleNode,
        RichCardSubtitleNode,
        RichCardPriceNode,
        RichCardUnitNode,
        RichCardLinkNode
      ],

      // 左侧边栏统计数据
      totalDocs: 12,
      todayEdits: 3,
      wordCount: 0
    }
  },

  methods: {

    insertTemplate(templateData) {
      console.log('插入模板:', templateData)

      if (!this.editorInstance) {
        console.warn('编辑器实例不存在')
        return
      }

      if (templateData.type === TemplateNodeType.IMAGE_CARD) {
        this.editorInstance.chain().focus().insertRichTravelCard().run()
      } else if (templateData.type === TemplateNodeType.HEADER) {
        this.editorInstance.chain().focus().insertContent({
          type: 'doubleTextNode',
          attrs: {
            topColor: '#e53e3e',
            bottomColor: '#3182ce',
            topText: '上段文字',
            bottomText: '下段文字',
            topFontSize: '16px',
            bottomFontSize: '14px',
            topFontWeight: 'normal',
            bottomFontWeight: 'normal',
            topFontStyle: 'normal',
            bottomFontStyle: 'normal',
            topTextDecoration: 'none',
            bottomTextDecoration: 'none'
          },
          content: [
            {
              type: 'textBlock',
              content: [{ type: 'text', text: '上段文字' }]
            },
            {
              type: 'textBlock',
              content: [{ type: 'text', text: '下段文字' }]
            }
          ]
        }).run()
      } else if (templateData.type === TemplateNodeType.WECHAT_STYLE) {
        this.editorInstance.chain().focus().insertImageTextList().run();
      }
    },
    // ProductHeader 事件处理方法
    handleProductNameChange(newName) {
      this.productName = newName
    },
    handleProductDescriptionChange(newDescription) {
      this.productDescription = newDescription
    },
    handleProductImageChange(newImage) {
      this.productImage = newImage
    },

    // TiptapEditor事件处理方法
    onEditorReady(editor) {
      console.log('编辑器已准备就绪:', editor)
      this.editorInstance = editor
    },

    onEditorUpdate() {
      console.log('编辑器内容已更新')
      // 可以在这里处理内容变化
    },

    onSelectionUpdate() {
      console.log('编辑器选择已更新')
      // 可以在这里处理选择变化
    },

    // 外部调用编辑器方法的示例
    getEditorContent() {
      if (this.$refs.tiptapEditor) {
        const content = this.$refs.tiptapEditor.getContent()

        this.editorHTML = content
        console.log('编辑器内容:', content)
        alert('编辑器内容已输出到控制台')
      }
    },

    setEditorContent() {
      if (this.$refs.tiptapEditor) {
        const newContent = '<h2>新的内容</h2><p>这是通过外部方法设置的内容</p>'
        this.$refs.tiptapEditor.setContent(newContent)
      }
    },

    focusEditor() {
      if (this.$refs.tiptapEditor) {
        this.$refs.tiptapEditor.focus()
      }
    },

    clearEditor() {
      if (this.$refs.tiptapEditor) {
        if (confirm('确定要清空编辑器内容吗？')) {
          this.$refs.tiptapEditor.clear()
        }
      }
    },

    toggleToolbar() {
      this.showEditorToolbar = !this.showEditorToolbar
    },

    // 左侧边栏事件处理
    handleNavClick(section) {
      console.log('导航点击:', section)
      // 这里可以添加路由跳转或其他导航逻辑
    },

    handleToolClick(tool) {
      console.log('工具点击:', tool)
      switch (tool) {
        case 'new-doc':
          if (this.$refs.tiptapEditor) {
            this.$refs.tiptapEditor.clear()
            this.productName = '新文档'
            this.productDescription = '请输入文档描述'
          }
          break
        case 'export':
          if (this.$refs.tiptapEditor) {
            const content = this.$refs.tiptapEditor.getContent()
            console.log('导出内容:', content)
            alert('文档内容已输出到控制台')
          }
          break
        default:
          alert(`${tool} 功能开发中...`)
      }
    },

    // 右侧边栏事件处理
    handleFontSizeChange(fontSize) {
      console.log('字体大小变更:', fontSize)
      // 这里可以添加字体大小变更逻辑
    },

    handleThemeChange(theme) {
      console.log('主题变更:', theme)
      // 这里可以添加主题变更逻辑
    }
  }
}
</script>

<style scoped>
/* 圣杯布局样式 */
.holy-grail-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 101;
  margin-left: 250px;
  margin-right: 300px;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
}

/* 主体容器 */
.container {
  flex: 1;
  grid-template-columns: 250px 1fr 300px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  gap: 0;
  position: relative;
}

/* 左侧边栏固定定位 */
.holy-grail-layout .container> :first-child {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  background: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
}

/* 右侧边栏固定定位 */
.holy-grail-layout .container> :last-child {
  position: fixed !important;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  background: #fff;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
}

/* 主内容区样式 */
.main {
  padding: 20px;
  background: #ffffff;
  min-height: 600px;
  width: 100%
}


/* 编辑器容器 */
.editor-container {
  flex: 1;
  margin-top: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}



/* 产品头部样式 */
.product-header {
  background: #fff;
  border: 2px dashed #ff8c00;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.product-header-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.product-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-image-section {
  flex: 0 0 200px;
}

.product-name-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  background: #fff;
  transition: all 0.3s ease;
}

.product-name-input:focus {
  outline: none;
  border-color: #ff8c00;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
}

.product-description-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  background: #fff;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.product-description-input:focus {
  outline: none;
  border-color: #ff8c00;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
}

.image-upload-area {
  width: 200px;
  height: 150px;
  border: 2px dashed #ff8c00;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.image-upload-area:hover {
  background: #fff8f0;
  border-color: #ff7300;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #ff8c00;
}

.upload-icon {
  font-size: 32px;
}

.upload-text {
  font-size: 12px;
  text-align: center;
  color: #6c757d;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}



/* 底部样式 */
.footer {
  grid-column: 1 / -1;
  background: #f8f9fa;
  padding: 15px 20px;
  text-align: center;
  border-top: 1px solid #e9ecef;
  margin-left: 250px;
  margin-right: 300px;
}

.footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* 工具栏演示容器样式 */
.toolbar-demo-container {
  margin-top: 30px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  /* 移动端取消固定定位 */
  .container> :first-child,
  .container> :last-child {
    position: relative;
    width: 100%;
    height: auto;
    box-shadow: none;
  }

  .header {
    margin-left: 0;
    margin-right: 0;
  }

  .main {
    margin-left: 0;
    margin-right: 0;
  }

  .footer {
    margin-left: 0;
    margin-right: 0;
  }

  .right-sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }

  .product-header {
    padding: 16px;
    margin-bottom: 16px;
  }

  .product-header-content {
    flex-direction: column;
    gap: 16px;
  }

  .product-image-section {
    flex: none;
    order: -1;
  }

  .image-upload-area {
    width: 150px;
    height: 120px;
  }

  .product-name-input {
    font-size: 16px;
  }

  .product-description-input {
    min-height: 60px;
  }

  .toolbar-demo-container {
    margin-top: 20px;
    padding: 15px;
  }
}
</style>