<template>
    <node-view-wrapper class="spot-card-wrapper" :class="{ 'spot-card-selected': diySelected }">
        <!-- 使用抽取的悬浮操作栏组件 -->
        <NodeFloatingActions v-if="diySelected" :node="node" :getPos="getPos" :editor="editor"
            :deleteNode="deleteNode" />

        <div class="spot-card-container">
            <!-- 图片区域 - 现在在左侧 -->
            <div class="image-container">
                <img :src="node.attrs.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'"
                    alt="景点图片" @error="handleImageError" class="spot-image" />
            </div>

            <div class="spot-card-content">
                <NodeViewContent class="content-area">
                    <!-- SimpleHeading 和 SimpleParagraph 将在这里渲染 -->
                </NodeViewContent>

                <!-- 评分和标签区域 -->
                <div class="rating-tags">
                    <div class="rating">
                        <span class="rating-value">{{ node.attrs.rating }}</span>
                        <span class="rating-text">非常棒！</span>
                    </div>
                    <div class="tags">
                        <span v-if="node.attrs.landmark" class="tag landmark">地标</span>
                        <span v-if="node.attrs.checkin" class="tag checkin">打卡点</span>
                    </div>
                </div>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/core'
import NodeFloatingActions from './NodeFloatingActions.vue'
import { compareNodes } from '@/utils/editorUtils'

interface SpotCardNodeAttrs {
    imageUrl: string
    rating: number
    landmark: boolean
    checkin: boolean
}

export default defineComponent({
    name: 'SpotCardView',
    components: {
        NodeViewWrapper,
        NodeViewContent,
        NodeFloatingActions,
    },
    props: {
        node: {
            type: Object as PropType<Node>,
            required: true,
        },
        updateAttributes: {
            type: Function as PropType<(attributes: Partial<SpotCardNodeAttrs>) => void>,
            required: true,
        },
        editor: {
            type: Object as PropType<Editor>,
            required: true,
        },
        getPos: {
            type: Function as PropType<() => number>,
            required: true,
        },
        deleteNode: {
            type: Function as PropType<() => void>,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            diySelected: false
        }
    },
    watch: {
        'editor.state.selection.$from': {
            handler(newVal) {
                if (newVal) {
                    this.diySelected = compareNodes(newVal, this.node, this.getPos);
                }
            },
        },
    },
    methods: {
        handleImageError(e: Event) {
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/600x400?text=Image+not+found'
        },
    }
})
</script>

<style scoped>
.spot-card-wrapper {
    position: relative;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background-color: white;
    transition: box-shadow 0.3s ease;
}

.spot-card-selected {
    box-shadow: 0 0 0 2px #4285f4;
}

/* 新增容器用于水平布局 */
.spot-card-container {
    display: flex;
    flex-direction: row;
    height: 180px;
    /* 设置固定高度 */
}

.image-container {
    width: 180px;
    /* 固定宽度 */
    height: 100%;
    flex-shrink: 0;
    /* 防止图片区域被压缩 */
}

.spot-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.spot-card-content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.content-area {
    flex-grow: 1;
}

.rating-tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.rating {
    display: flex;
    align-items: center;
}

.rating-value {
    font-size: 18px;
    font-weight: bold;
    color: #ff6b00;
    margin-right: 8px;
}

.rating-text {
    color: #ff6b00;
    font-size: 14px;
}

.tags {
    display: flex;
    gap: 8px;
}

.tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.landmark {
    background-color: #f0f0f0;
    color: #666;
}

.checkin {
    background-color: #f0f0f0;
    color: #666;
}

.spot-card-container {
  display: flex;
  flex-direction: row;
  height: 180px; /* 设置固定高度 */
}

.image-container {
  width: 180px; /* 固定宽度 */
  height: 100%;
  flex-shrink: 0; /* 防止图片区域被压缩 */
}

.spot-card-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>