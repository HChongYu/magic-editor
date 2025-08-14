<template>
  <aside class="control-panel">
    <!-- 顶部控制区 -->
    <div class="panel-header">
      <div class="control-tabs">
        <span 
          v-for="tab in controlTabs" 
          :key="tab.id"
          :class="['control-tab', { active: tab.active }]"
          @click="selectTab(tab)"
        >
          {{ tab.name }}
        </span>
        <div class="toggle-wrapper">
          <label class="toggle-switch">
            <input type="checkbox" v-model="toolbarEnabled" @change="onToolbarToggle">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div class="search-wrapper">
        <input 
          type="text" 
          placeholder="请输入内容" 
          class="control-search"
          v-model="searchContent"
        >
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="panel-content">
      <!-- 微信小程序预览 -->
      <div class="preview-section">
        <h4 class="section-title">微信小程序预览</h4>
        <div class="preview-card">
          <div class="preview-display">
            <div class="preview-icon">📱</div>
            <span class="preview-status">{{ previewStatus }}</span>
          </div>
          <button 
            class="preview-button"
            :class="{ generating: isGenerating }"
            @click="generatePreview"
            :disabled="isGenerating"
          >
            {{ isGenerating ? '生成中...' : '生成一键预览' }}
          </button>
        </div>
      </div>
      
      <!-- 设置表单 -->
      <div class="settings-form">
        <div 
          class="form-group"
          v-for="setting in settingsFields"
          :key="setting.id"
        >
          <div class="form-header">
            <label class="form-label">{{ setting.label }}</label>
            <a href="#" class="form-link" @click.prevent="openSettings(setting)">设置</a>
          </div>
          <input 
            type="text" 
            :placeholder="setting.placeholder"
            class="form-input"
            v-model="setting.value"
            @input="onSettingChange(setting)"
          >
        </div>
        
        <!-- 隐私政策复选框 -->
        <div class="privacy-section">
          <label class="privacy-checkbox">
            <input 
              type="checkbox" 
              v-model="privacyAccepted"
              @change="onPrivacyChange"
            >
            <span class="checkbox-text">请仔细阅读隐私政策和用户协议</span>
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'ControlPanel',
  data() {
    return {
      searchContent: '',
      toolbarEnabled: true,
      previewStatus: '未生成',
      isGenerating: false,
      privacyAccepted: false,
      controlTabs: [
        { id: 1, name: '记忆', active: false },
        { id: 2, name: '智能写作', active: false },
        { id: 3, name: '生成与优化', active: true }
      ],
      settingsFields: [
        {
          id: 'customer',
          label: '客户信息',
          placeholder: '请输入客户信息',
          value: ''
        },
        {
          id: 'department',
          label: '部门属性方式',
          placeholder: '请输入部门属性',
          value: ''
        },
        {
          id: 'subordinate',
          label: '下属方式',
          placeholder: '请输入下属方式',
          value: ''
        },
        {
          id: 'contact',
          label: '联系电话',
          placeholder: '请输入联系电话',
          value: ''
        }
      ]
    }
  },
  methods: {
    selectTab(tab) {
      this.controlTabs.forEach(t => t.active = false)
      tab.active = true
      this.$emit('tab-changed', tab)
    },
    onToolbarToggle() {
      this.$emit('toolbar-toggle', this.toolbarEnabled)
    },
    generatePreview() {
      if (this.isGenerating) return
      
      this.isGenerating = true
      this.previewStatus = '生成中...'
      
      // 模拟生成过程
      setTimeout(() => {
        this.isGenerating = false
        this.previewStatus = '已生成'
        this.$emit('preview-generated')
      }, 2000)
    },
    openSettings(setting) {
      this.$emit('open-settings', setting)
    },
    onSettingChange(setting) {
      this.$emit('setting-changed', setting)
    },
    onPrivacyChange() {
      this.$emit('privacy-changed', this.privacyAccepted)
    }
  }
}
</script>

<style scoped>
.control-panel {
  width: 300px; /* 调整宽度 */
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: none; /* 移除阴影 */
}

/* 头部控制区 */
.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e1e4e8;
  background: #fafbfc;
}

.control-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.control-tab {
  font-size: 11px;
  color: #586069;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.15s ease;
  white-space: nowrap;
  border: 1px solid #e1e4e8;
  background: #f6f8fa;
  user-select: none;
}

.control-tab:hover {
  background: #e1f5fe;
  color: #0277bd;
  border-color: #b3e5fc;
}

.control-tab.active {
  background: #0366d6;
  color: #ffffff;
  border-color: #0366d6;
  font-weight: 500;
}

.toggle-wrapper {
  margin-left: auto;
  flex-shrink: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5da;
  transition: 0.3s;
  border-radius: 18px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input:checked + .toggle-slider {
  background-color: #0366d6;
}

input:checked + .toggle-slider:before {
  transform: translateX(14px);
}

.search-wrapper {
  position: relative;
}

.control-search {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  font-size: 12px;
  background: #fafbfc;
  color: #24292e;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.control-search:focus {
  outline: none;
  border-color: #0366d6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

.control-search::placeholder {
  color: #6a737d;
}

/* 内容区域 */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
}

/* 预览区域 */
.preview-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #24292e;
  letter-spacing: -0.01em;
}

.preview-card {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  font-size: 18px;
}

.preview-status {
  font-size: 12px;
  color: #6a737d;
  font-weight: 500;
}

.preview-button {
  background: #0366d6;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
  align-self: flex-start;
}

.preview-button:hover:not(:disabled) {
  background: #0256cc;
  box-shadow: 0 2px 4px rgba(3, 102, 214, 0.3);
}

.preview-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-button.generating {
  background: #6a737d;
}

/* 设置表单 */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #24292e;
}

.form-link {
  font-size: 11px;
  color: #0366d6;
  text-decoration: none;
  transition: color 0.15s ease;
}

.form-link:hover {
  color: #0256cc;
  text-decoration: underline;
}

.form-input {
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  font-size: 12px;
  background: #fafbfc;
  color: #24292e;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #0366d6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

.form-input::placeholder {
  color: #6a737d;
}

/* 隐私政策 */
.privacy-section {
  margin-top: 8px;
}

.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.privacy-checkbox input[type="checkbox"] {
  margin-top: 2px;
  accent-color: #0366d6;
  cursor: pointer;
}

.checkbox-text {
  font-size: 11px;
  color: #6a737d;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f6f8fa;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #d1d5da;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #959da5;
}
</style>