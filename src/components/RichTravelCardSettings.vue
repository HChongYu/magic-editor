<template>
  <div class="rich-travel-card-settings">
    <div class="settings-row">
      <label>标题:</label>
      <input 
        v-model="localTitle" 
        @input="updateTitle"
        type="text" 
        class="settings-input"
      />
    </div>
    
    <div class="settings-row">
      <label>副标题:</label>
      <input 
        v-model="localSubtitle" 
        @input="updateSubtitle"
        type="text" 
        class="settings-input"
      />
    </div>
    
    <div class="settings-row">
      <label>价格:</label>
      <input 
        v-model="localPrice" 
        @input="updatePrice"
        type="text" 
        class="settings-input"
      />
    </div>
    
    <div class="settings-row">
      <label>单位:</label>
      <input 
        v-model="localUnit" 
        @input="updateUnit"
        type="text" 
        class="settings-input"
      />
    </div>
    
    <div class="settings-row">
      <label>图片URL:</label>
      <input 
        v-model="localImageUrl" 
        @input="updateImageUrl"
        type="url" 
        class="settings-input"
        placeholder="输入图片URL或点击图片上传"
      />
    </div>
    
    <div class="settings-row">
      <label>背景色:</label>
      <input 
        v-model="localBackgroundColor" 
        @input="updateBackgroundColor"
        type="color" 
        class="color-input"
      />
    </div>
    
    <div class="settings-row">
      <label>边框色:</label>
      <input 
        v-model="localBorderColor" 
        @input="updateBorderColor"
        type="color" 
        class="color-input"
      />
    </div>
    
    <div class="settings-actions">
      <button @click="deleteCard" class="delete-btn">删除卡片</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RichTravelCardSettings',
  props: {
    node: {
      type: Object,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
    editor: {
      type: Object,
      required: true,
    },
    getPos: {
      type: Function,
      required: true,
    },
  },
  emits: ['image-change'],
  data() {
    return {
      localTitle: this.node.attrs.title,
      localSubtitle: this.node.attrs.subtitle,
      localPrice: this.node.attrs.price,
      localUnit: this.node.attrs.unit,
      localImageUrl: this.node.attrs.imageUrl,
      localBackgroundColor: this.node.attrs.backgroundColor,
      localBorderColor: this.node.attrs.borderColor,
    }
  },
  watch: {
    'node.attrs': {
      handler(newAttrs) {
        this.localTitle = newAttrs.title
        this.localSubtitle = newAttrs.subtitle
        this.localPrice = newAttrs.price
        this.localUnit = newAttrs.unit
        this.localImageUrl = newAttrs.imageUrl
        this.localBackgroundColor = newAttrs.backgroundColor
        this.localBorderColor = newAttrs.borderColor
      },
      deep: true
    }
  },
  methods: {
    updateTitle() {
      this.updateAttributes({ title: this.localTitle })
    },
    
    updateSubtitle() {
      this.updateAttributes({ subtitle: this.localSubtitle })
    },
    
    updatePrice() {
      this.updateAttributes({ price: this.localPrice })
    },
    
    updateUnit() {
      this.updateAttributes({ unit: this.localUnit })
    },
    
    updateImageUrl() {
      this.updateAttributes({ imageUrl: this.localImageUrl })
      this.$emit('image-change', this.localImageUrl)
    },
    
    updateBackgroundColor() {
      this.updateAttributes({ backgroundColor: this.localBackgroundColor })
    },
    
    updateBorderColor() {
      this.updateAttributes({ borderColor: this.localBorderColor })
    },
    
    deleteCard() {
      const pos = this.getPos()
      if (pos !== undefined) {
        this.editor.chain().focus().deleteRange({ from: pos, to: pos + this.node.nodeSize }).run()
      }
    },
  },
}
</script>

<style scoped>
.rich-travel-card-settings {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.settings-row:last-child {
  margin-bottom: 0;
}

label {
  font-size: 12px;
  font-weight: 500;
  color: #4a5568;
  min-width: 60px;
}

.settings-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 12px;
}

.color-input {
  width: 40px;
  height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #feb2b2;
  border-color: #fc8181;
}
</style>