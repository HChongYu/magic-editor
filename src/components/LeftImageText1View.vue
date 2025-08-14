<template>
    <node-view-wrapper class="left-image-text1-wrapper" :class="{ 'left-image-text1-selected': diySelected }">
        <!-- 使用抽取的悬浮操作栏组件 -->
        <NodeFloatingActions v-if="diySelected" :node="node" :getPos="getPos" :editor="editor"
            :deleteNode="deleteNode" />

        <div class="left-image-text1-container">
            <!-- 图片区域 - 左侧 -->
            <div class="image-container">
                <img :src="node.attrs.imageUrl || 'https://via.placeholder.com/600x400?text=Click+to+upload+image'"
                    alt="图片" @error="handleImageError" class="left-image" />
            </div>

            <div class="left-image-text1-content">
                <NodeViewContent class="content-area">
                    <!-- SimpleHeading 和 SimpleParagraph 将在这里渲染 -->
                </NodeViewContent>
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

interface LeftImageText1NodeAttrs {
    imageUrl: string
}

export default defineComponent({
    name: 'LeftImageText1View',
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
            type: Function as PropType<(attributes: Partial<LeftImageText1NodeAttrs>) => void>,
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
.left-image-text1-wrapper {
    position: relative;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background-color: white;
    transition: box-shadow 0.3s ease;
}

.left-image-text1-selected {
    box-shadow: 0 0 0 2px #4285f4;
}

/* 水平布局容器 */
.left-image-text1-container {
    display: flex;
    flex-direction: row;
    height: 180px; /* 设置固定高度 */
}

.image-container {
    width: 180px; /* 固定宽度 */
    height: 100%;
    flex-shrink: 0; /* 防止图片区域被压缩 */
}

.left-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.left-image-text1-content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.content-area {
    flex-grow: 1;
}
</style>