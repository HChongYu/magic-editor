<template>
    <div class="tiptap-editor">
        <editor-content :editor="editor" />
    </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
import { JSONContent } from '@tiptap/core'
import { EmojiNode, EMOJI_DATA } from '@/extensions/EmojiNode'
import { DoubleTextNode } from '@/extensions/DoubleTextNode'
import TextBlockNode from '@/extensions/TextBlockNode'
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits, defineExpose, withDefaults } from 'vue'

// 新增：焦点和光标位置相关状态
const editorFocused = ref(false)
const lastCursorPosition = ref<{
    line: number
    column: number
    absolutePosition: number
} | null>(null)
const savedSelection = ref<{ from: number; to: number } | null>(null)

// 保存当前光标位置
const saveCurrentCursorPosition = (editorInstance: Editor) => {
    if (!editorInstance) return
    
    const { selection } = editorInstance.state
    const { from, to } = selection
    
    // 保存选择范围用于恢复
    savedSelection.value = { from, to }
    
    // 计算行列位置用于显示
    const doc = editorInstance.state.doc
    const pos = selection.$anchor.pos
    
    let line = 1
    let column = 1
    let currentPos = 0
    
    // 遍历文档计算行列位置
    doc.descendants((node, nodePos) => {
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
    
    lastCursorPosition.value = {
        line,
        column,
        absolutePosition: pos
    }
    
    console.log('保存光标位置:', lastCursorPosition.value)
}

// 恢复到上次光标位置
const restoreLastPosition = () => {
    if (!editor.value || !savedSelection.value) return
    
    // 聚焦编辑器并恢复选择位置
    editor.value.chain()
        .focus()
        .setTextSelection(savedSelection.value)
        .run()
    
    console.log('恢复到位置:', savedSelection.value)
}

// 清除保存的位置信息
const clearSavedPosition = () => {
    lastCursorPosition.value = null
    savedSelection.value = null
}

// 导入拖拽相关扩展已移除，因为未使用

// 1. 扩展项目符号列表 - 修改键盘快捷键
import BulletList from '@tiptap/extension-bullet-list'

const CustomBulletList = BulletList.extend({
    addKeyboardShortcuts() {
        return {
            'Mod-l': () => this.editor.commands.toggleBulletList(),
        }
    },
})

// 2. 扩展标题 - 修改默认设置
import Heading from '@tiptap/extension-heading'

const CustomHeading = Heading.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            levels: [1, 2, 3],
        }
    },
})

// 3. 扩展段落 - 添加颜色属性
import Paragraph from '@tiptap/extension-paragraph'

const CustomParagraph = Paragraph.extend({
    name: 'paragraph', // 确保名称正确

    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: element => element.getAttribute('data-color'),
                renderHTML: attributes => {
                    if (!attributes.color) return {}
                    return {
                        'data-color': attributes.color,
                        style: `color: ${attributes.color}`,
                    }
                },
            },
        }
    },
})

// 4. 扩展引用块 - 限制内容只能包含段落
import Blockquote from '@tiptap/extension-blockquote'

const CustomBlockquote = Blockquote.extend({
    content: 'paragraph*',
})

// 5. 创建自定义扩展 - 添加存储功能和键盘快捷键
const CustomExtension = Extension.create({
    name: 'customExtension',

    addStorage() {
          return {
            awesomeness: 100
          }
        },

    onUpdate() {
        this.storage.awesomeness += 1
    },

    addKeyboardShortcuts() {
         return {
             'Mod-e': () => {
                 this.editor.chain().focus().insertContent('😊').run()
                 return true
             },
         }
     },


})

// 6. 创建全局文本对齐扩展
const TextAlign = Extension.create({
    name: 'textAlign',

    addGlobalAttributes() {
        return [
            {
                types: ['heading', 'paragraph'],
                attributes: {
                    textAlign: {
                        default: 'left',
                        renderHTML: attributes => ({
                            style: `text-align: ${attributes.textAlign}`,
                        }),
                        parseHTML: element => element.style.textAlign || 'left',
                    },
                },
            },
        ]
    },
})

// 定义 props
const props = withDefaults(defineProps<{
  extensions?: any[],
  initialContent?: string,
  showToolbar?: boolean
}>(), {
  extensions: () => [],
  initialContent: '',
  showToolbar: true
})

// 定义 emits
const emit = defineEmits<{
  (e: 'update', editor: Editor): void
  (e: 'selection-update', editor: Editor): void
  (e: 'editor-ready', editor: Editor): void
}>()

// 响应式数据
const editor = ref<Editor | null>(null)
const selectedNodeInfo = ref<any>(null)
const keyboardHandler = ref<((event: KeyboardEvent) => void) | null>(null)
const colorOptions = ref([
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
])
// 生命周期钩子
onMounted(() => {
    // 获取要使用的扩展
    const extensionsToUse = getExtensions()
    console.log(props.initialContent)
    // 获取初始内容
    const content = props.initialContent || getDefaultContent()
    
    editor.value = new Editor({
        content,
        extensions: extensionsToUse,
        onUpdate: ({ editor: editorInstance }) => {
            console.log('编辑器内容已更新', editorInstance)
            emit('update', editorInstance)
        },
        onSelectionUpdate: ({ editor: editorInstance }) => {
            checkSelectedNode(editorInstance)
            emit('selection-update', editorInstance)
        },
        // 新增：焦点事件处理
        onFocus: ({ editor: editorInstance, event }) => {
            console.log('编辑器获得焦点')
            editorFocused.value = true
            emit('focus', { editor: editorInstance, event })
        },
        onBlur: ({ editor: editorInstance, event }) => {
            console.log('编辑器失去焦点')
            editorFocused.value = false
            saveCurrentCursorPosition(editorInstance)
            emit('blur', { editor: editorInstance, event })
        },
    })
    
    // 添加键盘快捷键监听
    addKeyboardListeners()
    
    // 暴露编辑器实例给父组件
    emit('editor-ready', editor.value)
})

onBeforeUnmount(() => {
    removeKeyboardListeners()
    if (editor.value) {
        editor.value.destroy()
    }
})
// 方法定义
// 获取要使用的扩展
const getExtensions = () => {
    // 如果外部传入了扩展，使用外部扩展
    if (props.extensions && props.extensions.length > 0) {
        return props.extensions
    }
    
    // 否则使用默认扩展
    return getDefaultExtensions()
}

// 获取默认扩展
const getDefaultExtensions = () => {
    return [
        StarterKit.configure({
            bulletList: false, // 禁用默认的项目符号列表
            heading: false,    // 禁用默认的标题
            paragraph: false,  // 禁用默认的段落
            blockquote: false, // 禁用默认的引用块
        }),
        CustomBulletList,
        CustomHeading,
        CustomParagraph,
        CustomBlockquote,
        CustomExtension,
        TextAlign,
        EmojiNode, // 添加自定义表情符号节点
        DoubleTextNode, // 新增双文本节点
        TextBlockNode,
    ]
}

// 获取默认内容
const getDefaultContent = () => {
    return `
        <h1>欢迎使用扩展的 Tiptap 编辑器</h1>
        <p>这是一个演示如何扩展现有 Tiptap 扩展的示例。</p>
        <ul>
          <li>项目符号列表现在使用 Ctrl+L 快捷键</li>
          <li>段落可以设置颜色</li>
          <li>引用块只能包含段落</li>
          <li>可以插入表情符号节点</li>
          <li>表情符号的标签文字可以编辑</li>
          <li>双文本节点支持选中后弹出颜色选择器</li>
          <li>双文本节点和表情符号支持拖拽移动</li>
          <li>使用 Ctrl+D 复制节点，Delete 键删除节点</li>
        </ul>
        <blockquote>
          <p>这是一个引用块，只能包含段落内容。</p>
        </blockquote>
        <p>试试插入一些表情符号吧！😊</p>
        <p>点击下面的表情符号，然后尝试编辑它们的标签文字：</p>
        <p>这是一个可编辑的表情符号：<span data-type="emoji" data-emoji="😊" class="emoji-node"><span class="emoji" style="font-size: 16px;">😊</span><span class="label" style="font-size: 12px; color: #666;">点击编辑我</span></span></p>
        <p>这是另一个：<span data-type="emoji" data-emoji="❤️" class="emoji-node"><span class="emoji" style="font-size: 16px;">❤️</span><span class="label" style="font-size: 12px; color: #666;">爱心标签</span></span></p>
      `
}
        
// 暴露给外部的方法
// 获取编辑器实例
const getEditor = () => {
    return editor.value
}

// 获取编辑器内容
const getContent = () => {
    return editor.value?.getHTML() || ''
}

// 设置编辑器内容
const setContent = (content: string) => {
    if (editor.value) {
        editor.value.commands.setContent(content)
    }
}

// 聚焦编辑器
const focus = () => {
    if (editor.value) {
        editor.value.commands.focus()
    }
}

// 清空编辑器
const clear = () => {
    if (editor.value) {
        editor.value.commands.clearContent()
    }
}

// 销毁编辑器
const destroy = () => {
    if (editor.value) {
        removeKeyboardListeners()
        editor.value.destroy()
        editor.value = null
    }
}

const changeParagraphColor = (color: string) => {
    if (editor.value) {
        // 方法1: 尝试更新属性
        try {
            editor.value.chain().focus().updateAttributes('paragraph', { color }).run()
            console.log('方法1成功')
        } catch (error) {
            console.log('方法1失败:', error)

            // 方法2: 尝试设置节点属性
            try {
                editor.value.chain().focus().setNode('paragraph', { color }).run()
                console.log('方法2成功')
            } catch (error2) {
                console.log('方法2失败:', error2)

                // 方法3: 尝试为当前选中的内容设置属性
                try {
                    const { from } = editor.value.state.selection
                    editor.value.chain().focus().setNodeSelection(from).updateAttributes('paragraph', { color }).run()
                    console.log('方法3成功')
                } catch (error3) {
                    console.log('方法3失败:', error3)
                }
            }
        }
    }
}

const insertEmoji = (type: string) => {
    if (!editor.value) return

    const emojiData = EMOJI_DATA[type]
    if (emojiData) {
        editor.value.chain().focus().insertEmoji({
            emoji: emojiData.emoji,
            label: emojiData.label,
            type: type,
        }).run()
    }
}

const editSelectedEmoji = () => {
    if (!editor.value) return

    // 检查当前选中的是否是表情符号节点
    const { selection } = editor.value.state
    const node = selection.$from.node()

    if (node && node.type.name === 'emojiNode') {
        // 如果选中的是表情符号节点，提示用户编辑
        const newLabel = prompt('请输入新的标签文字:', node.textContent || '表情')
        if (newLabel !== null) {
            // 更新表情符号的文本内容
            editor.value.chain().focus().insertContent(newLabel).run()
        }
    } else {
        // 如果没有选中表情符号，提示用户
        alert('请先选中一个表情符号节点')
    }
}
const insertDoubleTextNode = () => {
    if (!editor.value) return
    const { selection } = editor.value.state;
    const { $from} = selection;
    const node = $from.node();
    console.log(node.type.name)
    if(node.type.name==='doubleTextNode'|| node.type.name==='textBlock'){
        return
    }

    editor.value.chain().focus().insertContent({
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
}

const setDoubleTextColor = (which: 'top' | 'bottom', color: string) => {
    if (!editor.value) return

    editor.value.chain().focus().setDoubleTextColor(which, color).run()
}

const toggleDoubleTextStyle = (which: 'top' | 'bottom', styleType: string, value: string) => {
    if (!editor.value) return
    
    // 获取当前节点的属性
    const attrs = editor.value.getAttributes('doubleTextNode')
    const attrName = which === 'top' ? 
        (styleType === 'fontWeight' ? 'topFontWeight' : 
         styleType === 'fontStyle' ? 'topFontStyle' : 'topTextDecoration') :
        (styleType === 'fontWeight' ? 'bottomFontWeight' : 
         styleType === 'fontStyle' ? 'bottomFontStyle' : 'bottomTextDecoration')
    
    // 切换样式值
    const currentValue = attrs[attrName]
    const newValue = currentValue === value ? 
        (styleType === 'textDecoration' ? 'none' : 'normal') : value
    
    // 应用新样式
    editor.value.chain().focus().setDoubleTextStyle(which, styleType, newValue).run()
}

const setDoubleTextFontSize = (which: 'top' | 'bottom', size: string) => {
    if (!editor.value) return
    
    editor.value.chain().focus().setDoubleTextStyle(which, 'fontSize', size).run()
}

        
// 编辑双文本节点的文本内容
const editDoubleTextContent = (which: 'top' | 'bottom') => {
    if (!editor.value) return
    
    const { state } = editor.value
    const { selection, doc } = state
    let found = false;
    let node: any = null;
    
    // 1. 查找选区内的 doubleTextNode 节点
    doc.nodesBetween(selection.from, selection.to, (n: any) => {
        if (n.type.name === 'doubleTextNode') {
            node = n;
            found = true;
            return false; // 停止遍历
        }
    })
    
    // 2. 如果没找到，向上查找父节点
    if (!found) {
        const resolvedPos = doc.resolve(selection.from)
        for (let depth = resolvedPos.depth; depth > 0; depth--) {
            const nodeAtDepth = resolvedPos.node(depth)
            if (nodeAtDepth.type.name === 'doubleTextNode') {
                node = nodeAtDepth;
                found = true;
                break;
            }
        }
    }
    
    if (found && node) {
        // 获取当前文本内容 - 从节点的实际内容中获取
        let currentText = '';
        if (which === 'top' && node.content.content[0]) {
            currentText = node.content.content[0].textContent || node.attrs.topText || '上段文字';
        } else if (which === 'bottom' && node.content.content[1]) {
            currentText = node.content.content[1].textContent || node.attrs.bottomText || '下段文字';
        } else {
            // 回退到属性值
            currentText = which === 'top' ? node.attrs.topText : node.attrs.bottomText;
        }
        
        const newText = prompt(`请输入${which === 'top' ? '上' : '下'}段文字:`, currentText);
        
        if (newText !== null) {
            editor.value.chain().focus().setDoubleTextContent(which, newText).run();
        }
    } else {
        alert('请先选中一个双文本节点');
    }
}

const checkSelectedNode = (editorInstance: Editor) => {
    const { selection } = editorInstance.state;
    const { $from } = selection;
    let node: any = null;

    // 检查光标所在位置的节点及其父节点
    for (let i = $from.depth; i > 0; i--) {
        const currentNode = $from.node(i);
        if (currentNode.type.name === 'doubleTextNode') {
            node = currentNode;
            break;
        }
    }

    if (node) {
        selectedNodeInfo.value = `双文本节点 - 上段: ${node.attrs.topColor}, 下段: ${node.attrs.bottomColor}`;
    } else {
        selectedNodeInfo.value = null;
    }
}

// 复制选中的节点
const copySelectedNode = () => {
    if (!editor.value) return;
    
    const { state } = editor.value;
    const { selection, doc } = state;
    let nodeInfo: any = null;
    
    // 查找选中的节点
    doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
        if (node.type.name === 'doubleTextNode' || node.type.name === 'emojiNode') {
            nodeInfo = { node, pos };
            return false; // 停止遍历
        }
    });
    
    // 如果没找到，向上查找父节点
    if (!nodeInfo) {
        const resolvedPos = doc.resolve(selection.from);
        for (let depth = resolvedPos.depth; depth > 0; depth--) {
            const nodeAtDepth = resolvedPos.node(depth);
            const posAtDepth = resolvedPos.start(depth) - 1;
            if (nodeAtDepth.type.name === 'doubleTextNode' || nodeAtDepth.type.name === 'emojiNode') {
                nodeInfo = { node: nodeAtDepth, pos: posAtDepth };
                break;
            }
        }
    }
    
    if (nodeInfo) {
        // 复制节点到光标位置之后
        const { tr } = state;
        const insertPos = selection.to;
        tr.insert(insertPos, nodeInfo.node.copy());
        editor.value.view.dispatch(tr);
        
        console.log('节点已复制:', nodeInfo.node.type.name);
    } else {
        alert('请先选中一个节点（双文本节点或表情符号）');
    }
}

// 删除选中的节点
const deleteSelectedNode = () => {
    if (!editor.value) return;
    
    const { state } = editor.value;
    const { selection, doc } = state;
    let nodeInfo: any = null;
    
    // 查找选中的节点
    doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
        if (node.type.name === 'doubleTextNode' || node.type.name === 'emojiNode') {
            nodeInfo = { node, pos, size: node.nodeSize };
            return false; // 停止遍历
        }
    });
    
    // 如果没找到，向上查找父节点
    if (!nodeInfo) {
        const resolvedPos = doc.resolve(selection.from);
        for (let depth = resolvedPos.depth; depth > 0; depth--) {
            const nodeAtDepth = resolvedPos.node(depth);
            const posAtDepth = resolvedPos.start(depth) - 1;
            if (nodeAtDepth.type.name === 'doubleTextNode' || nodeAtDepth.type.name === 'emojiNode') {
                nodeInfo = { node: nodeAtDepth, pos: posAtDepth, size: nodeAtDepth.nodeSize };
                break;
            }
        }
    }
    
    if (nodeInfo) {
        // 确认删除
        const nodeTypeName = nodeInfo.node.type.name === 'doubleTextNode' ? '双文本节点' : '表情符号';
        if (confirm(`确定要删除这个${nodeTypeName}吗？`)) {
            const { tr } = state;
            tr.delete(nodeInfo.pos, nodeInfo.pos + nodeInfo.size);
            editor.value.view.dispatch(tr);
            
            console.log('节点已删除:', nodeInfo.node.type.name);
        }
    } else {
        alert('请先选中一个节点（双文本节点或表情符号）');
    }
}

// 添加键盘快捷键监听器
const addKeyboardListeners = () => {
    keyboardHandler.value = (event: KeyboardEvent) => {
        // Ctrl+D 或 Cmd+D 复制节点
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault()
            copySelectedNode()
            return
        }
        
        // Delete 键删除节点（只在选中特定节点时）
        if (event.key === 'Delete') {
            const { state } = editor.value
            const { selection, doc } = state
            let hasCustomNode = false
            
            // 检查是否选中了自定义节点
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
                deleteSelectedNode()
            }
        }
    }
    
    document.addEventListener('keydown', keyboardHandler.value)
}

// 移除键盘快捷键监听器
const removeKeyboardListeners = () => {
    if (keyboardHandler.value) {
        document.removeEventListener('keydown', keyboardHandler.value)
        keyboardHandler.value = null
    }
}

// 暴露方法给父组件
defineExpose({
    getEditor,
    getContent,
    setContent,
    focus,
    clear,
    destroy,
    restoreLastPosition,
    clearSavedPosition
})
</script>

<style scoped>
.tiptap-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 光标位置指示器样式 */
.cursor-position-indicator {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 12px;
  min-height: 200px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tiptap-editor:has(.ProseMirror:focus) :deep(.ProseMirror) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>