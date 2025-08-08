<template>
  <div class="rich-text-demo">
    <div class="demo-header">
      <h2>富文本工具栏样式演示</h2>
      <p>这是一个完整的富文本编辑器工具栏组件，包含常用的格式化功能</p>
    </div>
    
    <!-- 工具栏演示 -->
    <div class="toolbar-demo-section">
      <h3>工具栏样式</h3>
      <RichTextToolbar :editor="editor" />
    </div>
    
    <!-- 编辑器区域 -->
    <div class="editor-section">
      <h3>编辑器内容</h3>
      <div class="editor-container">
        <div ref="editorElement" class="editor-content"></div>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="features-section">
      <h3>功能特性</h3>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🎨</div>
          <h4>丰富的格式化选项</h4>
          <p>支持粗体、斜体、下划线、删除线等基础文本格式</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📏</div>
          <h4>字体大小控制</h4>
          <p>提供多种字体大小选择，满足不同排版需求</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🌈</div>
          <h4>颜色选择器</h4>
          <p>内置颜色面板，支持自定义文本颜色</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📐</div>
          <h4>文本对齐</h4>
          <p>支持左对齐、居中、右对齐、两端对齐</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📝</div>
          <h4>列表功能</h4>
          <p>支持有序列表和无序列表</p>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🔗</div>
          <h4>链接插入</h4>
          <p>快速插入和编辑超链接</p>
        </div>
      </div>
    </div>
    
    <!-- 样式变体演示 -->
    <div class="variants-section">
      <h3>样式变体</h3>
      
      <!-- 紧凑版本 -->
      <div class="variant-demo">
        <h4>紧凑版本</h4>
        <div class="toolbar-compact">
          <RichTextToolbar :editor="editor" />
        </div>
      </div>
      
      <!-- 深色主题 -->
      <div class="variant-demo">
        <h4>深色主题</h4>
        <div class="toolbar-dark">
          <RichTextToolbar :editor="editor" />
        </div>
      </div>
      
      <!-- 圆角版本 -->
      <div class="variant-demo">
        <h4>圆角版本</h4>
        <div class="toolbar-rounded">
          <RichTextToolbar :editor="editor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextToolbar from '@/components/RichTextToolbar'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'

export default {
  name: 'RichTextToolbarDemo',
  components: {
    RichTextToolbar
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      element: this.$refs.editorElement,
      extensions: [
        StarterKit,
        Underline,
        Color,
        TextStyle,
        Link.configure({
          openOnClick: false,
        })
      ],
      content: `
        <h2>欢迎使用富文本编辑器</h2>
        <p>这是一个功能完整的富文本编辑器演示。你可以使用上方的工具栏来格式化文本。</p>
        <p><strong>粗体文本</strong>、<em>斜体文本</em>、<u>下划线文本</u>和<s>删除线文本</s>。</p>
        <ul>
          <li>无序列表项目 1</li>
          <li>无序列表项目 2</li>
          <li>无序列表项目 3</li>
        </ul>
        <ol>
          <li>有序列表项目 1</li>
          <li>有序列表项目 2</li>
          <li>有序列表项目 3</li>
        </ol>
        <p>你可以尝试不同的格式化选项来体验工具栏的功能。</p>
      `,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
    })
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
    }
  }
}
</script>

<style scoped>
.rich-text-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
}

.demo-header p {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.toolbar-demo-section,
.editor-section,
.features-section,
.variants-section {
  margin-bottom: 40px;
}

.toolbar-demo-section h3,
.editor-section h3,
.features-section h3,
.variants-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
}

.editor-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.editor-content {
  min-height: 300px;
  padding: 20px;
  background: white;
  outline: none;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.feature-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.feature-item p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.variant-demo {
  margin-bottom: 30px;
}

.variant-demo h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

/* 工具栏变体样式 */
.toolbar-compact {
  transform: scale(0.9);
  transform-origin: left top;
}

.toolbar-dark {
  background: #1f2937;
  padding: 10px;
  border-radius: 8px;
}

.toolbar-dark :deep(.rich-text-toolbar) {
  background: #374151;
  border-color: #4b5563;
}

.toolbar-dark :deep(.toolbar-btn) {
  color: #e5e7eb;
}

.toolbar-dark :deep(.toolbar-btn:hover) {
  background: #4b5563;
  color: #f9fafb;
}

.toolbar-dark :deep(.toolbar-btn.active) {
  background: #3b82f6;
  color: white;
}

.toolbar-dark :deep(.toolbar-divider) {
  background: #6b7280;
}

.toolbar-dark :deep(.font-size-select) {
  background: #374151;
  border-color: #6b7280;
  color: #e5e7eb;
}

.toolbar-rounded :deep(.rich-text-toolbar) {
  border-radius: 25px;
  padding: 12px 20px;
}

.toolbar-rounded :deep(.toolbar-btn) {
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rich-text-demo {
    padding: 15px;
  }
  
  .demo-header h2 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .toolbar-compact {
    transform: scale(0.8);
  }
}

/* 编辑器内容样式 */
:deep(.ProseMirror) {
  outline: none;
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
}

:deep(.ProseMirror h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0;
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
}
</style>