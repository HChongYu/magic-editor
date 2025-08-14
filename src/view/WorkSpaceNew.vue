<template>
  <div class="workspace-layout">
    <!-- 左侧边栏组件 -->
    <LeftSidebar :editorInstance="editorInstance" @template-selected="insertTemplate"
      @category-changed="onCategoryChanged" />

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 添加产品头部组件 -->
      <ProductHeader />

      <div class="editor-container">
        <EditorToolbar :editor="editorInstance" />
        <TiptapEditor ref="tiptapEditor" :extensions="customExtensions" :initial-content="editorContent"
          :show-toolbar="showEditorToolbar" @editor-ready="onEditorReady" @update="onEditorUpdate"
          @selection-update="onSelectionUpdate" />
      </div>
    </main>

    <!-- 右侧边栏组件 -->
    <RightSidebar @toolbar-toggle="onToolbarToggle" @tab-changed="onTabChanged" @preview-generated="onPreviewGenerated"
      @open-settings="onOpenSettings" @setting-changed="onSettingChanged" @privacy-changed="onPrivacyChanged" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TiptapEditor from '@/components/TiptapEditor'
import LeftSidebar from '@/components/LeftSidebar'
import EditorToolbar from '@/components/EditorToolbar'
import RightSidebar from '@/components/RightSidebar'
import ProductHeader from '@/components/ProductHeader'

import SimpleHeading from '@/extensions/SimpleHeading'
import SimpleParagraph from '@/extensions/SimpleParagraph'
import LeftImageText1 from '@/extensions/leftImageText1'
import ColumnImageText1 from '@/extensions/ColumnImageText1'
import { TemplateNodeType } from '@/enums'

// TiptapEditor相关数据
const editorInstance = ref(null)
const showEditorToolbar = ref(true)
const editorContent = ref('')
const editorHTML = ref('')
const tiptapEditor = ref(null)

const customExtensions = [
  SimpleHeading,
  SimpleParagraph,
  LeftImageText1,
  ColumnImageText1
]

// 模版插入处理
function insertTemplate(templateData) {
  console.log('插入模板:', templateData)

  if (!editorInstance.value) {
    console.warn('编辑器实例不存在')
    return
  }

  if (templateData.type === TemplateNodeType.IMAGE_CARD || templateData.type === 'image_card') {
    editorInstance.value.chain().focus().insertRichTravelCard().run()
  }
}

// 左侧边栏事件处理
function onCategoryChanged(category) {
  console.log('分类切换:', category)
}

// 右侧边栏事件处理
function onToolbarToggle(enabled) {
  showEditorToolbar.value = enabled
}

function onTabChanged(tab) {
  console.log('标签切换:', tab)
}

function onPreviewGenerated() {
  console.log('预览已生成')
}

function onOpenSettings(setting) {
  console.log('打开设置:', setting)
}

function onSettingChanged(setting) {
  console.log('设置已更改:', setting)
}

function onPrivacyChanged(privacy) {
  console.log('隐私设置已更改:', privacy)
}

// 编辑器事件处理
function onEditorReady(editor) {
  console.log('编辑器已准备好')
  editorInstance.value = editor
}

function onEditorUpdate(editor) {
  if (editor) {
    // editorHTML.value = editor?.getHTML() || ''
  }

}

function onSelectionUpdate(editor) {
  // 处理选择更新
}
</script>

<style scoped>
.workspace-layout {
  display: flex;
  flex-direction: row;
  background: #f6f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 1300px;
  margin: 0 auto;
  min-height: 100%;
  height: auto;
  padding-top: 10px;
  background-color: transparent;

  display: flex;
  flex-basis: auto;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative ;
}

.main-content {
  /* 允许滚动 */
  background: #ffffff;

  width: 570px;
  margin-left: 380px;
  margin-right: 350px;
  padding: 0 20px;
  min-height: 100%;
  height: auto;
  /* 添加左右内边距 */
}

.editor-container {
  flex: 1;
  margin: 20px 0;
  /* 只保留上下边距 */
  border: none;
  /* 移除边框 */
  border-radius: 0;
  overflow: visible;
  /* 不限制内容溢出 */
  box-shadow: none;
  /* 移除阴影 */
}

/* 响应式设计 */
@media (max-width: 1299px) {
  .workspace-layout {
  
  }


}
</style>