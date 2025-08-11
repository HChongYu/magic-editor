<template>
  <NodeViewWrapper class="image-text-list-container" :class="{ 'selected': selected }">
    <!-- 标题 - 改为普通 input 框 -->
    <div class="list-title">
      <input 
        v-if="editing && editingField === 'title'"
        v-model="editingData.title"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        class="title-input"
        placeholder="请输入标题..."
      />
      <h3 
        v-else
        @click="startEditTitle"
        class="title-display"
      >
        {{ node.attrs.title || '图文组合列表' }}
      </h3>
    </div>

    <!-- 图文列表项 -->
    <div class="image-text-items">
      <div 
        v-for="(item, index) in node.attrs.items" 
        :key="item.id"
        class="image-text-item"
      >
        <!-- 图片 -->
        <div class="item-image">
          <img 
            :src="item.image" 
            :alt="item.title"
            @error="handleImageError($event, item.id)"
          />
          <div class="image-overlay" v-if="editing">
            <button @click="changeImage(item.id)" class="change-image-btn">
              更换图片
            </button>
          </div>
        </div>

        <!-- 内容 -->
        <div class="item-content">
          <!-- 标题 -->
          <input 
            v-if="editing && editingField === `title-${item.id}`"
            v-model="editingData.title"
            @blur="saveItemData(item.id)"
            @keyup.enter="saveItemData(item.id)"
            class="item-title-input"
          />
          <h4 
            v-else
            @click="startEditItemTitle(item)"
            class="item-title"
          >
            {{ item.title }}
          </h4>

          <!-- 描述 -->
          <textarea 
            v-if="editing && editingField === `description-${item.id}`"
            v-model="editingData.description"
            @blur="saveItemData(item.id)"
            class="item-description-input"
          ></textarea>
          <p 
            v-else
            @click="startEditItemDescription(item)"
            class="item-description"
          >
            {{ item.description }}
          </p>
        </div>

        <!-- 删除按钮 -->
        <button 
          v-if="editing && node.attrs.items.length > 1"
          @click="removeItem(item.id)"
          class="remove-item-btn"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 查看更多 -->
    <div class="more-section">
      <input 
        v-if="editing && editingField === 'moreText'"
        v-model="localMoreText"
        @blur="saveMoreText"
        @keyup.enter="saveMoreText"
        class="more-text-input"
      />
      <input 
        v-if="editing && editingField === 'moreLink'"
        v-model="localMoreLink"
        @blur="saveMoreLink"
        @keyup.enter="saveMoreLink"
        class="more-link-input"
        placeholder="输入链接地址"
      />
      <a 
        v-if="!editing"
        :href="node.attrs.moreLink"
        class="more-link"
        @click.prevent="handleMoreClick"
      >
        {{ node.attrs.moreText }}
        <span class="arrow">→</span>
      </a>
      <div v-if="editing" class="more-edit-controls">
        <button @click="startEditMoreText" class="edit-more-text-btn">编辑文本</button>
        <button @click="startEditMoreLink" class="edit-more-link-btn">编辑链接</button>
      </div>
    </div>

    <!-- 编辑控制按钮 -->
    <div class="edit-controls" v-if="selected">
      <button @click="toggleEdit" class="edit-btn">
        {{ editing ? '完成' : '编辑' }}
      </button>
      <button @click="addItem" class="add-item-btn">
        添加项目
      </button>
      <button @click="deleteNode" class="delete-btn">
        删除
      </button>
    </div>
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

export default {
  name: 'ImageTextListView',
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    editor: {
      type: Object,
      required: true,
    },
    getPos: {
      type: Function,
      required: true,
    },
    deleteNode: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      editingField: null,
      editingData: {},
      localMoreText: '',
      localMoreLink: '',
    }
  },
  methods: {
    // 新增标题编辑方法
    startEditTitle() {
      if (!this.editing) return
      this.editingField = 'title'
      this.editingData = { title: this.node.attrs.title || '图文组合列表' }
    },

    saveTitle() {
      this.updateAttributes({ title: this.editingData.title })
      this.editingField = null
      this.editingData = {}
    },

    toggleEdit() {
      this.editing = !this.editing
      this.editingField = null
    },

    // 项目编辑
    startEditItemTitle(item) {
      if (!this.editing) return
      this.editingField = `title-${item.id}`
      this.editingData = { ...item }
    },

    startEditItemDescription(item) {
      if (!this.editing) return
      this.editingField = `description-${item.id}`
      this.editingData = { ...item }
    },

    saveItemData(itemId) {
      const items = [...this.node.attrs.items]
      const itemIndex = items.findIndex(item => item.id === itemId)
      
      if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...this.editingData }
        this.updateAttributes({ items })
      }
      
      this.editingField = null
      this.editingData = {}
    },

    // 更多链接编辑
    startEditMoreText() {
      this.editingField = 'moreText'
      this.localMoreText = this.node.attrs.moreText
    },

    startEditMoreLink() {
      this.editingField = 'moreLink'
      this.localMoreLink = this.node.attrs.moreLink
    },

    saveMoreText() {
      if (this.localMoreText.trim()) {
        this.updateAttributes({ moreText: this.localMoreText.trim() })
      }
      this.editingField = null
    },

    saveMoreLink() {
      this.updateAttributes({ moreLink: this.localMoreLink.trim() || '#' })
      this.editingField = null
    },

    // 项目管理
    addItem() {
      const newItem = {
        id: Date.now().toString(),
        image: '/api/placeholder/150/100',
        title: '新标题',
        description: '请输入描述内容'
      }
      
      const items = [...this.node.attrs.items, newItem]
      this.updateAttributes({ items })
    },

    removeItem(itemId) {
      if (this.node.attrs.items.length <= 1) return
      
      const items = this.node.attrs.items.filter(item => item.id !== itemId)
      this.updateAttributes({ items })
    },

    changeImage(itemId) {
      const newImageUrl = prompt('请输入新的图片URL:', '')
      if (newImageUrl) {
        const items = [...this.node.attrs.items]
        const itemIndex = items.findIndex(item => item.id === itemId)
        
        if (itemIndex !== -1) {
          items[itemIndex].image = newImageUrl
          this.updateAttributes({ items })
        }
      }
    },

    handleImageError(event, itemId) {
      // 图片加载失败时的处理
      event.target.src = '/api/placeholder/150/100?text=图片加载失败'
    },

    handleMoreClick() {
      if (this.node.attrs.moreLink && this.node.attrs.moreLink !== '#') {
        window.open(this.node.attrs.moreLink, '_blank')
      }
    },
    handleImageError(event) {
      const target = event.target
      target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
  },
}
</script>

<style scoped>
.image-text-list-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: #fff;
  position: relative;
}

.image-text-list-container.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.list-title {
  margin-bottom: 16px;
}

.title-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;
}

.title-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.title-display {
  margin: 0;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.title-display:hover {
  border-color: #e2e8f0;
  background-color: #f8fafc;
}

/* 标题内容样式 */
.title-content {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  outline: none;
  min-height: 1.5em;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.title-content:hover {
  background-color: #f8f9fa;
}

.title-content:focus {
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.image-text-items {
  margin-bottom: 20px;
}

.image-text-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.image-text-item:hover {
  background-color: #f8f9fa;
}

.item-image {
  flex-shrink: 0;
  margin-right: 16px;
  position: relative;
  width: 150px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.item-image:hover .image-overlay {
  opacity: 1;
}

.change-image-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  cursor: pointer;
}

.item-title-input {
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
  width: 100%;
  margin-bottom: 8px;
}

.item-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  cursor: pointer;
}

.item-description-input {
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
  width: 100%;
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
}

.remove-item-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.more-section {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.more-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.more-link:hover {
  text-decoration: underline;
}

.arrow {
  margin-left: 4px;
  transition: transform 0.2s;
}

.more-link:hover .arrow {
  transform: translateX(2px);
}

.more-text-input,
.more-link-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
  margin-right: 8px;
  font-size: 14px;
}

.more-edit-controls {
  margin-top: 8px;
}

.edit-more-text-btn,
.edit-more-link-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
}

.edit-controls {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.edit-btn,
.add-item-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background: #007bff;
  color: white;
}

.add-item-btn {
  background: #28a745;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}
</style>