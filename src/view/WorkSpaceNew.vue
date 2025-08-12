<template>
  <div class="workspace-layout">
    <!-- 左侧边栏组件 -->
    <LeftSidebar @template-selected="insertTemplate" @category-changed="onCategoryChanged" />

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="editor-container">
        <TiptapEditor ref="tiptapEditor" extensions="customExtensions" :initial-content="editorContent"
          :show-toolbar="showEditorToolbar" @editor-ready="onEditorReady" @update="onEditorUpdate"
          @selection-update="onSelectionUpdate" />
      </div>
    </main>

    <!-- 右侧边栏组件 -->
    <ControlPanel @toolbar-toggle="onToolbarToggle" @tab-changed="onTabChanged" @preview-generated="onPreviewGenerated"
      @open-settings="onOpenSettings" @setting-changed="onSettingChanged" @privacy-changed="onPrivacyChanged" />
  </div>
</template>

<script>
import TiptapEditor from '@/components/TiptapEditor'
import LeftSidebar from '@/components/LeftSidebar'
import ControlPanel from '../components/RightSidebar/ControlPanel.vue'

// 导入自定义节点扩展
import CitySpotNode from '@/extensions/CitySpotNode'

import { TemplateNodeType } from '@/enums'

export default {
  name: 'WorkSpaceNew',
  components: {
    TiptapEditor,
    LeftSidebar,
    ControlPanel
  },
  data() {
    return {
      // TiptapEditor相关数据
      editorInstance: null,
      showEditorToolbar: true,
      editorContent: '',
      editorHTML: '',
      customExtensions: [
        CitySpotNode
      ]
    }
  },
  methods: {
    // 模版插入处理
    insertTemplate(templateData) {
      console.log('插入模板:', templateData)

      if (!this.editorInstance) {
        console.warn('编辑器实例不存在')
        return
      }

      if (templateData.type === TemplateNodeType.IMAGE_CARD || templateData.type === 'image_card') {
        this.editorInstance.chain().focus().insertRichTravelCard().run()
      }
    },

    // 左侧边栏事件处理
    onCategoryChanged(category) {
      console.log('分类切换:', category)
    },

    // 右侧边栏事件处理
    onToolbarToggle(enabled) {
      this.showEditorToolbar = enabled
    },

    onTabChanged(tab) {
      console.log('标签切换:', tab)
    },

    onPreviewGenerated() {
      console.log('预览已生成')
    },

    onOpenSettings(setting) {
      console.log('打开设置:', setting)
    },

    onSettingChanged(setting) {
      console.log('设置变更:', setting)
    },

    onPrivacyChanged(accepted) {
      console.log('隐私政策:', accepted)
    },

    // TiptapEditor事件处理方法
    onEditorReady(editor) {
      console.log('编辑器已准备就绪:', editor)
      this.editorInstance = editor
    },

    onEditorUpdate() {
      console.log('编辑器内容已更新')
    },

    onSelectionUpdate() {
      console.log('编辑器选择已更新')
    }
  }
}
</script>

<style scoped>
.workspace-layout {
  display: flex;
  height: 100vh;
  background: #f6f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  margin: 0;
}

.editor-container {
  flex: 1;
  margin: 20px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .workspace-layout {
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    min-height: 400px;
  }
}
</style>