<template>
  <div class="right-sidebar">
    <div class="sidebar-content">
      <h3>编辑器控制</h3>
      <div class="editor-controls">
        <h4>外部方法调用示例</h4>
        
        <div class="control-group">
          <button @click="$emit('get-content')" class="control-btn">获取内容</button>
          <button @click="$emit('set-content')" class="control-btn">设置内容</button>
        </div>
        
        <div class="control-group">
          <button @click="$emit('focus-editor')" class="control-btn">聚焦编辑器</button>
          <button @click="$emit('clear-editor')" class="control-btn danger">清空内容</button>
        </div>
        
        <div class="control-group">
          <button @click="$emit('toggle-toolbar')" class="control-btn">
            {{ showToolbar ? '隐藏工具栏' : '显示工具栏' }}
          </button>
        </div>
      </div>
      
      <div class="editor-info">
        <h4>编辑器信息</h4>
        <p><strong>扩展数量:</strong> {{ extensionsCount }}</p>
        <p><strong>工具栏状态:</strong> {{ showToolbar ? '显示' : '隐藏' }}</p>
        <p><strong>编辑器实例:</strong> {{ hasEditorInstance ? '已创建' : '未创建' }}</p>
      </div>
      
      <div class="settings-panel">
        <h4>文档设置</h4>
        <div class="setting-item">
          <label>字体大小:</label>
          <select @change="$emit('font-size-change', $event.target.value)">
            <option>12px</option>
            <option>14px</option>
            <option selected>16px</option>
            <option>18px</option>
            <option>20px</option>
          </select>
        </div>
        <div class="setting-item">
          <label>主题:</label>
          <select @change="$emit('theme-change', $event.target.value)">
            <option>默认</option>
            <option>暗色</option>
            <option>护眼</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightSidebar',
  props: {
    showToolbar: {
      type: Boolean,
      default: true
    },
    extensionsCount: {
      type: Number,
      default: 0
    },
    hasEditorInstance: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'get-content',
    'set-content', 
    'focus-editor',
    'clear-editor',
    'toggle-toolbar',
    'font-size-change',
    'theme-change'
  ]
}
</script>

<style scoped>
/* 右侧边栏样式 */
.right-sidebar {
  width: 100%; /* 改为100%，让父级控制宽度 */
  height: 100vh; /* 设置全屏高度 */
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  padding: 20px;
  overflow-y: auto;
  position: relative; /* 确保定位正确 */
}

.sidebar-content h3 {
  margin-top: 0;
  color: #495057;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

/* 编辑器控制面板样式 */
.editor-controls {
  margin-bottom: 30px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.editor-controls h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #495057;
  font-size: 14px;
}

.control-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.control-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.control-btn.danger {
  background: #dc3545;
  border-color: #dc3545;
}

.control-btn.danger:hover {
  background: #c82333;
  border-color: #c82333;
}

/* 编辑器信息面板样式 */
.editor-info {
  margin-bottom: 30px;
  padding: 15px;
  background: #e8f4fd;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.editor-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
  font-size: 14px;
}

.editor-info p {
  margin: 5px 0;
  font-size: 12px;
  color: #6c757d;
}

.editor-info strong {
  color: #495057;
}

/* 设置面板样式 */
.settings-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-panel h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #495057;
  font-size: 14px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.setting-item select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 12px;
  background: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .right-sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e9ecef;
  }
}
</style>