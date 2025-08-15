<template>
  <div class="color-picker-container">
    <div class="color-picker" v-if="visible">
      <div class="preset-colors">
        <div class="preset-label">预置</div>
        <div class="color-grid">
          <div 
            v-for="color in presetColors" 
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></div>
        </div>
      </div>
      <div class="recent-colors" v-if="recentColors.length > 0">
        <div class="recent-label">最近使用</div>
        <div class="color-grid">
          <div 
            v-for="color in recentColors" 
            :key="color"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      presetColors: [
        // 第一行：浅色系
        '#FFFFFF', '#F2F2F2', '#F5F5DC', '#FFE4E1', '#E0F2E9', '#E6F0F8', '#E6E9F0',
        // 第二行：灰色系
        '#F0F0F0', '#E0E0E0', '#C0C0C0', '#808080', '#404040', '#202020', '#000000',
        // 第三行：红色系
        '#4B0082', '#800000', '#FF0000', '#FF4500', '#228B22', '#008000', '#006666',
        // 第四行：蓝色系
        '#000080', '#0000FF', '#4682B4', '#6495ED', '#483D8B', '#4169E1', '#000080'
      ],
      recentColors: []
    }
  },
  methods: {
    selectColor(color) {
      this.$emit('select', color)
      this.addToRecentColors(color)
    },
    addToRecentColors(color) {
      // 如果颜色已经在最近使用中，先移除它
      const index = this.recentColors.indexOf(color)
      if (index !== -1) {
        this.recentColors.splice(index, 1)
      }
      
      // 添加到最近使用的颜色列表开头
      this.recentColors.unshift(color)
      
      // 限制最近使用的颜色数量为6个
      if (this.recentColors.length > 6) {
        this.recentColors = this.recentColors.slice(0, 6)
      }
      
      // 保存到本地存储
      localStorage.setItem('recentColors', JSON.stringify(this.recentColors))
    }
  },
  mounted() {
    // 从本地存储加载最近使用的颜色
    const savedColors = localStorage.getItem('recentColors')
    if (savedColors) {
      try {
        this.recentColors = JSON.parse(savedColors)
      } catch (e) {
        console.error('Failed to parse recent colors', e)
      }
    }
    
    // 点击外部关闭颜色选择器
    document.addEventListener('click', (e) => {
      if (this.visible && !this.$el.contains(e.target)) {
        this.$emit('close')
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click')
  }
}
</script>

<style scoped>
.color-picker-container {
  position: relative;
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  width: 240px;
}

.preset-colors, .recent-colors {
  margin-bottom: 12px;
}

.preset-label, .recent-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.color-item {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: transform 0.1s ease;
}

.color-item:hover {
  transform: scale(1.1);
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>