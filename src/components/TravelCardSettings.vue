<template>
  <div class="travel-card-settings">
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
      <button @click="deleteCard" class="delete-btn">
        删除卡片
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'TravelCardSettings',
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
  setup(props, { emit }) {
    const localTitle = ref(props.node.attrs.title)
    const localSubtitle = ref(props.node.attrs.subtitle)
    const localPrice = ref(props.node.attrs.price)
    const localUnit = ref(props.node.attrs.unit)
    const localImageUrl = ref(props.node.attrs.imageUrl)
    
    // 监听节点属性变化
    watch(() => props.node.attrs, (newAttrs) => {
      localTitle.value = newAttrs.title
      localSubtitle.value = newAttrs.subtitle
      localPrice.value = newAttrs.price
      localUnit.value = newAttrs.unit
      localImageUrl.value = newAttrs.imageUrl
    }, { deep: true })
    
    return {
      localTitle,
      localSubtitle,
      localPrice,
      localUnit,
      localImageUrl
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
    
    deleteCard() {
      const pos = this.getPos()
      if (pos !== undefined) {
        this.editor.chain().focus().deleteRange({ from: pos, to: pos + this.node.nodeSize }).run()
      }
    },
  },
})
</script>

<style scoped>
.travel-card-settings {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.settings-row label {
  min-width: 60px;
  font-size: 14px;
  color: #333;
}

.settings-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.settings-input:focus {
  outline: none;
  border-color: #2196f3;
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.delete-btn:hover {
  background: #d32f2f;
}
</style>