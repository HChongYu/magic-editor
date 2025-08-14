<template>
    <div class="product-header" :style="backgroundStyle">
        <div class="header-content">
            <!-- 产品名称区域 -->
            <div class="product-title-section">
                <EditorToolbar :editor="titleEditorInstance" v-if="showTitleToolbar" />
                <div class="product-title-container" @click="focusTitle">
                    <TiptapEditor ref="titleEditor" :extensions="titleExtensions" :initial-content="titleContent"
                        :show-toolbar="false" @editor-ready="onTitleEditorReady" @update="onTitleUpdate" />
                </div>
            </div>

            <!-- 产品描述区域 -->
            <div class="product-description-section">
                <EditorToolbar :editor="descEditorInstance" v-if="showDescToolbar" />
                <div class="product-description-container" @click="focusDescription">
                    <TiptapEditor ref="descriptionEditor" :extensions="descriptionExtensions"
                        :initial-content="descriptionContent" :show-toolbar="false" @editor-ready="onDescEditorReady"
                        @update="onDescriptionUpdate" />
                </div>
            </div>
        </div>

        <!-- 背景图片设置按钮 -->
        <div class="background-settings">
            <button class="bg-change-btn" @click="changeBackground">
                更换背景图片
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TiptapEditor from '@/components/TiptapEditor'
import EditorToolbar from '@/components/EditorToolbar'
import SimpleHeading from '@/extensions/SimpleHeading'
import SimpleParagraph from '@/extensions/SimpleParagraph'

// 背景图片
const backgroundImage = ref('https://iknow-pic.cdn.bcebos.com/5882b2b7d0a20cf4adf1084064094b36adaf99c8')

// 标题编辑器
const titleEditor = ref(null)
const titleEditorInstance = ref(null)
const titleContent = ref('<h1>产品名称</h1>')
const showTitleToolbar = ref(false)
const titleExtensions = [
    SimpleHeading
]

// 描述编辑器
const descriptionEditor = ref(null)
const descEditorInstance = ref(null)
const descriptionContent = ref('<p>产品描述</p>')
const showDescToolbar = ref(false)
const descriptionExtensions = [
    SimpleParagraph
]

const backgroundStyle = computed(() => {
    return {
        backgroundImage: `url(${backgroundImage.value})`,
    }
})

// 标题编辑器方法
function onTitleEditorReady(editor) {
    titleEditorInstance.value = editor
}

function onTitleUpdate(editor) {
    console.log('标题更新', editor)
    if (editor) {
        // titleContent.value = editor?.getHTML()

    }
}

function focusTitle() {
    titleEditorInstance.value?.commands.focus()
    showTitleToolbar.value = true
    showDescToolbar.value = false
}

// 描述编辑器方法
function onDescEditorReady(editor) {
    descEditorInstance.value = editor
}

function onDescriptionUpdate(editor) {
    descriptionContent.value = editor.getHTML()
}

function focusDescription() {
    descEditorInstance.value?.commands.focus()
    showDescToolbar.value = true
    showTitleToolbar.value = false
}

function changeBackground() {
    const url = prompt('请输入背景图片URL')
    if (url) {
        backgroundImage.value = url
    }
}
</script>

<style scoped>
.product-header {
    position: relative;
    width: 100%;
    min-height: 300px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
}

.header-content {
    position: relative;
    z-index: 2;
    color: white;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.product-title-section,
.product-description-section {
    margin-bottom: 20px;
}

.product-title-container,
.product-description-container {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 10px;
    cursor: text;
    transition: background-color 0.3s;
}

.product-title-container:hover,
.product-description-container:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.background-settings {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 3;
}

.bg-change-btn {
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.bg-change-btn:hover {
    background-color: rgba(255, 255, 255, 1);
}

/* 确保编辑器内容在暗背景上可见 */
:deep(.ProseMirror) {
    color: white;
    outline: none;
}

:deep(.ProseMirror h1) {
    margin: 0;
    font-size: 32px;
    line-height: 1.2;
}

:deep(.ProseMirror p) {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
}
</style>