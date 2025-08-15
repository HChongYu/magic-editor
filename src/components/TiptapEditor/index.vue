<template>
    <editor-content class="tiptap-editor" :editor="editor" />
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
// 导入扩展
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
export default {
    name: 'TiptapEditor',
    components: {
        EditorContent
    },
    props: {
        extensions: {
            type: Array,
            default: () => []
        },
        initialContent: {
            type: String,
            default: ''
        },
        showToolbar: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update', 'selection-update', 'editor-ready', 'focus', 'blur'],
    data() {
        return {
            editor: null,
            editorFocused: false,
            lastCursorPosition: null,
            savedSelection: null,
            selectedNodeInfo: null,
            keyboardHandler: null,
            colorOptions: [
                { value: '#333', label: '黑色' },
                { value: '#666', label: '灰色' },
                { value: '#999', label: '浅灰色' },
                { value: '#007bff', label: '蓝色' },
                { value: '#28a745', label: '绿色' },
                { value: '#dc3545', label: '红色' },
                { value: '#ffc107', label: '黄色' },
                { value: '#17a2b8', label: '青色' },
                { value: '#6c757d', label: '深灰色' },
                { value: '#fff', label: '白色' },
            ],
            baseExtensions: [
                StarterKit,
                BulletList,
                OrderedList,
                Heading,
                Paragraph,
                ListItem,
                Underline,
                Highlight,
                TextAlign.configure({
                    types: ['heading', 'paragraph']
                })
            ]
        }
    },
    mounted() {
        this.initEditor()
    },
    beforeUnmount() {
        this.removeKeyboardListeners()
        if (this.editor) {
            this.editor.destroy()
        }
    },
    methods: {
        // 初始化编辑器
        initEditor() {
            const extensionsToUse = this.getExtensions()
            const content = this.initialContent || this.getDefaultContent()
            this.editor = new Editor({
                content,
                extensions: extensionsToUse,
                onUpdate: ({ editor }) => {
                    console.log('编辑器内容已更新', editor)
                    this.$emit('update', { editor })
                },
                onSelectionUpdate: ({ editor }) => {

                    this.$emit('selection-update', editor)
                },
                onFocus: ({ editor, event }) => {
                    console.log('编辑器获得焦点')
                    this.editorFocused = true
                    this.$emit('focus', { editor, event })
                },
                onBlur: ({ editor, event }) => {
                    console.log('编辑器失去焦点')
                    this.editorFocused = false
                    this.saveCurrentCursorPosition(editor)
                    this.$emit('blur', { editor, event })
                },
                onCreate: ({ editor }) => {
                    // 暴露编辑器实例给父组件
                    this.$emit('editor-ready', editor)
                }
            })

            // 添加键盘快捷键监听
            this.addKeyboardListeners()
        },

        // 获取要使用的扩展
        getExtensions() {
            return [...this.baseExtensions, ...this.extensions]
        },


        // 获取默认内容
        getDefaultContent() {
            return `
                <h1>欢迎使用扩展的 Tiptap 编辑器</h1>
                <p>这是一个演示如何扩展现有 Tiptap 扩展的示例。</p> 
            `
        },

        // 保存当前光标位置
        saveCurrentCursorPosition(editorInstance) {
            if (!editorInstance) return

            const { selection } = editorInstance.state
            const { from, to } = selection

            this.savedSelection = { from, to }

            const doc = editorInstance.state.doc
            const pos = selection.$anchor.pos

            let line = 1
            let column = 1
            let currentPos = 0

            doc.descendants((node) => {
                if (currentPos >= pos) return false

                if (node.isText) {
                    const text = node.text || ''
                    for (let i = 0; i < text.length && currentPos < pos; i++) {
                        if (text[i] === '\n') {
                            line++
                            column = 1
                        } else {
                            column++
                        }
                        currentPos++
                    }
                } else if (node.isBlock) {
                    if (currentPos < pos) {
                        line++
                        column = 1
                    }
                }

                return currentPos < pos
            })

            this.lastCursorPosition = {
                line,
                column,
                absolutePosition: pos
            }

            console.log('保存光标位置:', this.lastCursorPosition)
        },

        // 暴露给外部的方法
        getEditor() {
            return this.editor
        },

        getContent() {
            // return this.editor?.getHTML() || ''
        },

        setContent(content) {
            if (this.editor) {
                this.editor.commands.setContent(content)
            }
        },

        focus() {
            if (this.editor) {
                this.editor.commands.focus()
            }
        },

        clear() {
            if (this.editor) {
                this.editor.commands.clearContent()
            }
        },

        destroy() {
            if (this.editor) {
                this.removeKeyboardListeners()
                this.editor.destroy()
                this.editor = null
            }
        },

        restoreLastPosition() {
            if (!this.editor || !this.savedSelection) return

            this.editor.chain()
                .focus()
                .setTextSelection(this.savedSelection)
                .run()

            console.log('恢复到位置:', this.savedSelection)
        },

        clearSavedPosition() {
            this.lastCursorPosition = null
            this.savedSelection = null
        },

        changeParagraphColor(color) {
            if (this.editor) {
                try {
                    this.editor.chain().focus().updateAttributes('paragraph', { color }).run()
                    console.log('方法1成功')
                } catch (error) {
                    console.log('方法1失败:', error)
                    try {
                        this.editor.chain().focus().setNode('paragraph', { color }).run()
                        console.log('方法2成功')
                    } catch (error2) {
                        console.log('方法2失败:', error2)
                        try {
                            const { from } = this.editor.state.selection
                            this.editor.chain().focus().setNodeSelection(from).updateAttributes('paragraph', { color }).run()
                            console.log('方法3成功')
                        } catch (error3) {
                            console.log('方法3失败:', error3)
                        }
                    }
                }
            }
        },
        editSelectedEmoji() {
            if (!this.editor) return

            const { selection } = this.editor.state
            const node = selection.$from.node()

            if (node && node.type.name === 'emojiNode') {
                const newLabel = prompt('请输入新的标签文字:', node.textContent || '表情')
                if (newLabel !== null) {
                    this.editor.chain().focus().insertContent(newLabel).run()
                }
            } else {
                alert('请先选中一个表情符号节点')
            }
        },

        insertDoubleTextNode() {
            if (!this.editor) return
            const { selection } = this.editor.state
            const { $from } = selection
            const node = $from.node()

            if (node.type.name === 'doubleTextNode' || node.type.name === 'textBlock') {
                return
            }

            this.editor.chain().focus().insertContent({
                type: 'doubleTextNode',
                attrs: {
                    topColor: '#e53e3e',
                    bottomColor: '#3182ce',
                    topText: '上段文字',
                    bottomText: '下段文字',
                    topFontSize: '16px',
                    bottomFontSize: '14px',
                    topFontWeight: 'normal',
                    bottomFontWeight: 'normal',
                    topFontStyle: 'normal',
                    bottomFontStyle: 'normal',
                    topTextDecoration: 'none',
                    bottomTextDecoration: 'none'
                },
                content: [
                    {
                        type: 'textBlock',
                        content: [{ type: 'text', text: '上段文字' }]
                    },
                    {
                        type: 'textBlock',
                        content: [{ type: 'text', text: '下段文字' }]
                    }
                ]
            }).run()
        },

        setDoubleTextColor(which, color) {
            if (!this.editor) return
            this.editor.chain().focus().setDoubleTextColor(which, color).run()
        },

        toggleDoubleTextStyle(which, styleType, value) {
            if (!this.editor) return

            const attrs = this.editor.getAttributes('doubleTextNode')
            const attrName = which === 'top' ?
                (styleType === 'fontWeight' ? 'topFontWeight' :
                    styleType === 'fontStyle' ? 'topFontStyle' : 'topTextDecoration') :
                (styleType === 'fontWeight' ? 'bottomFontWeight' :
                    styleType === 'fontStyle' ? 'bottomFontStyle' : 'bottomTextDecoration')

            const currentValue = attrs[attrName]
            const newValue = currentValue === value ?
                (styleType === 'textDecoration' ? 'none' : 'normal') : value

            this.editor.chain().focus().setDoubleTextStyle(which, styleType, newValue).run()
        },

        setDoubleTextFontSize(which, size) {
            if (!this.editor) return
            this.editor.chain().focus().setDoubleTextStyle(which, 'fontSize', size).run()
        },

        editDoubleTextContent(which) {
            if (!this.editor) return

            const { state } = this.editor
            const { selection, doc } = state
            let found = false
            let node = null

            doc.nodesBetween(selection.from, selection.to, (n) => {
                if (n.type.name === 'doubleTextNode') {
                    node = n
                    found = true
                    return false
                }
            })

            if (!found) {
                const resolvedPos = doc.resolve(selection.from)
                for (let depth = resolvedPos.depth; depth > 0; depth--) {
                    const nodeAtDepth = resolvedPos.node(depth)
                    if (nodeAtDepth.type.name === 'doubleTextNode') {
                        node = nodeAtDepth
                        found = true
                        break
                    }
                }
            }

            if (found && node) {
                let currentText = ''
                if (which === 'top' && node.content.content[0]) {
                    currentText = node.content.content[0].textContent || node.attrs.topText || '上段文字'
                } else if (which === 'bottom' && node.content.content[1]) {
                    currentText = node.content.content[1].textContent || node.attrs.bottomText || '下段文字'
                } else {
                    currentText = which === 'top' ? node.attrs.topText : node.attrs.bottomText
                }

                const newText = prompt(`请输入${which === 'top' ? '上' : '下'}段文字:`, currentText)

                if (newText !== null) {
                    this.editor.chain().focus().setDoubleTextContent(which, newText).run()
                }
            } else {
                alert('请先选中一个双文本节点')
            }
        },


        copySelectedNode() {
            if (!this.editor) return

            const { state } = this.editor
            const { selection, doc } = state
            let nodeInfo = null

            doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                if (node.type.name === 'doubleTextNode' || node.type.name === 'emojiNode') {
                    nodeInfo = { node, pos }
                    return false
                }
            })

            if (!nodeInfo) {
                const resolvedPos = doc.resolve(selection.from)
                for (let depth = resolvedPos.depth; depth > 0; depth--) {
                    const nodeAtDepth = resolvedPos.node(depth)
                    const posAtDepth = resolvedPos.start(depth) - 1
                    if (nodeAtDepth.type.name === 'doubleTextNode' || nodeAtDepth.type.name === 'emojiNode') {
                        nodeInfo = { node: nodeAtDepth, pos: posAtDepth }
                        break
                    }
                }
            }

            if (nodeInfo) {
                const { tr } = state
                const insertPos = selection.to
                tr.insert(insertPos, nodeInfo.node.copy())
                this.editor.view.dispatch(tr)

                console.log('节点已复制:', nodeInfo.node.type.name)
            } else {
                alert('请先选中一个节点（双文本节点或表情符号）')
            }
        },

        deleteSelectedNode() {
            if (!this.editor) return

            const { state } = this.editor
            const { selection, doc } = state
            let nodeInfo = null

            doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                if (node.type.name === 'doubleTextNode' || node.type.name === 'emojiNode') {
                    nodeInfo = { node, pos, size: node.nodeSize }
                    return false
                }
            })

            if (!nodeInfo) {
                const resolvedPos = doc.resolve(selection.from)
                for (let depth = resolvedPos.depth; depth > 0; depth--) {
                    const nodeAtDepth = resolvedPos.node(depth)
                    const posAtDepth = resolvedPos.start(depth) - 1
                    if (nodeAtDepth.type.name === 'doubleTextNode' || nodeAtDepth.type.name === 'emojiNode') {
                        nodeInfo = { node: nodeAtDepth, pos: posAtDepth, size: nodeAtDepth.nodeSize }
                        break
                    }
                }
            }

            if (nodeInfo) {
                const nodeTypeName = nodeInfo.node.type.name === 'doubleTextNode' ? '双文本节点' : '表情符号'
                if (confirm(`确定要删除这个${nodeTypeName}吗？`)) {
                    const { tr } = state
                    tr.delete(nodeInfo.pos, nodeInfo.pos + nodeInfo.size)
                    this.editor.view.dispatch(tr)

                    console.log('节点已删除:', nodeInfo.node.type.name)
                }
            } else {
                alert('请先选中一个节点（双文本节点或表情符号）')
            }
        },

        addKeyboardListeners() {
            this.keyboardHandler = (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                    event.preventDefault()
                    this.copySelectedNode()
                    return
                }

                if (event.key === 'Delete') {
                    const { state } = this.editor
                    const { selection, doc } = state
                    let hasCustomNode = false

                    doc.nodesBetween(selection.from, selection.to, (node) => {
                        if (node.type.name === 'doubleTextNode' || node.type.name === 'emojiNode') {
                            hasCustomNode = true
                            return false
                        }
                    })

                    if (!hasCustomNode) {
                        const resolvedPos = doc.resolve(selection.from)
                        for (let depth = resolvedPos.depth; depth > 0; depth--) {
                            const nodeAtDepth = resolvedPos.node(depth)
                            if (nodeAtDepth.type.name === 'doubleTextNode' || nodeAtDepth.type.name === 'emojiNode') {
                                hasCustomNode = true
                                break
                            }
                        }
                    }

                    if (hasCustomNode) {
                        event.preventDefault()
                        this.deleteSelectedNode()
                    }
                }
            }

            document.addEventListener('keydown', this.keyboardHandler)
        },

        removeKeyboardListeners() {
            if (this.keyboardHandler) {
                document.removeEventListener('keydown', this.keyboardHandler)
                this.keyboardHandler = null
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tiptap-editor {
    max-width: 800px;
    margin: 0 20px;

    :deep(.template-node) {
        // margin-top: 6px 20px 0;
        padding: 20px 14px;
        border-radius: 8px;
        background: #FFF;
        position: relative;
    }

    :deep(.template-node-selected) {
        border: 1px solid #8C88F8;
        box-shadow: 0 4px 18px 0 rgba(182, 182, 182, 0.25);
    }


}


.position-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.position-text {
    color: #495057;
    font-size: 14px;
    font-weight: 500;
}

.restore-btn {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.restore-btn:hover {
    background: #0056b3;
}



/* 编辑器失去焦点时的视觉提示 */
:deep(.ProseMirror) {
    border: none;
    /* 移除边框 */
    border-radius: 0;
    min-height: 200px;
    height: auto;
    outline: none;
    transition: none;
}

.tiptap-editor:has(.ProseMirror:focus) :deep(.ProseMirror) {
    border-color: transparent;
    box-shadow: none;
    /* 移除聚焦时的阴影 */
}

.bubble-menu {
    display: flex;
    background-color: #0D0D0D;
    padding: 0.2rem;
    border-radius: 0.5rem;
}

.bubble-menu button {
    border: none;
    background: none;
    color: #FFF;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.2rem 0.4rem;
    margin: 0 0.2rem;
    border-radius: 0.3rem;
    cursor: pointer;
}
</style>