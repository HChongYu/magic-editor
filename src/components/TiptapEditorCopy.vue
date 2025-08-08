<template>
    <div class="tiptap-editor">
        <!-- 显示脱离焦点前的位置信息 -->
        <div v-if="!editorFocused && lastCursorPosition" class="cursor-position-indicator">
            <div class="position-info">
                <span class="position-text">上次光标位置：第 {{ lastCursorPosition.line }} 行，第 {{ lastCursorPosition.column }} 列</span>
                <button @click="restoreLastPosition" class="restore-btn">恢复到此位置</button>
            </div>
        </div>
        
        <div v-if="showToolbar" class="toolbar">
            <!-- <button @click="editor?.chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }">
        粗体
      </button>
      <button @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }">
        斜体
      </button>
      <button @click="editor?.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor?.isActive('bulletList') }">
        项目符号
      </button>
      <button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }">
        标题1
      </button>
      <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }">
        标题2
      </button>
      <button @click="editor?.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor?.isActive('blockquote') }">
        引用
      </button>
      <button @click="changeParagraphColor('red')">红色段落</button>
      <button @click="changeParagraphColor('blue')">蓝色段落</button>
      <button @click="changeParagraphColor('green')">绿色段落</button> -->

            <!-- 表情符号按钮 -->
            <div class="emoji-section">
                <span class="emoji-label">表情符号:</span>
                <button @click="insertEmoji('smile')" class="emoji-btn">😊</button>
                <button @click="insertEmoji('heart')" class="emoji-btn">❤️</button>
                <button @click="insertEmoji('thumbsup')" class="emoji-btn">👍</button>
                <button @click="insertEmoji('star')" class="emoji-btn">⭐</button>
                <button @click="insertEmoji('fire')" class="emoji-btn">🔥</button>
                <button @click="insertEmoji('rocket')" class="emoji-btn">🚀</button>
                <button @click="insertEmoji('party')" class="emoji-btn">🎉</button>
                <button @click="insertEmoji('coffee')" class="emoji-btn">☕</button>

                <!-- 添加编辑表情符号的按钮 -->
                <button @click="editSelectedEmoji()" class="edit-btn">编辑选中表情</button>
            </div>

            <!-- 双文本节点按钮 -->
            <div class="double-text-section">
                <button @click="insertDoubleTextNode">插入双文本节点</button>
                <button @click="setDoubleTextColor('top', '#e53e3e')">上段红色</button>
                <button @click="setDoubleTextColor('bottom', '#3182ce')">下段蓝色</button>

                <!-- 节点操作按钮 -->
                <div class="node-operation-buttons">
                    <button @click="copySelectedNode" class="copy-btn" title="复制选中的节点">复制节点</button>
                    <button @click="deleteSelectedNode" class="delete-btn" title="删除选中的节点">删除节点</button>
                </div>
                
                <!-- 编辑文本内容按钮 -->
                <div class="edit-text-buttons">
                    <button @click="editDoubleTextContent('top')" title="编辑上段文字">编辑上段文字</button>
                    <button @click="editDoubleTextContent('bottom')" title="编辑下段文字">编辑下段文字</button>
                </div>
                
                <!-- 文本格式化按钮 -->
                <div class="format-buttons">
                    <button @click="toggleDoubleTextStyle('top', 'fontWeight', 'bold')" title="上段加粗">上段加粗</button>
                    <button @click="toggleDoubleTextStyle('top', 'fontStyle', 'italic')" title="上段斜体">上段斜体</button>
                    <button @click="toggleDoubleTextStyle('top', 'textDecoration', 'underline')" title="上段下划线">上段下划线</button>
                    <button @click="toggleDoubleTextStyle('bottom', 'fontWeight', 'bold')" title="下段加粗">下段加粗</button>
                    <button @click="toggleDoubleTextStyle('bottom', 'fontStyle', 'italic')" title="下段斜体">下段斜体</button>
                    <button @click="toggleDoubleTextStyle('bottom', 'textDecoration', 'underline')" title="下段下划线">下段下划线</button>
                </div>
                
                <!-- 字号选择 -->
                <div class="font-size-buttons">
                    <select @change="setDoubleTextFontSize('top', $event.target.value)">
                        <option value="12px">上段 12px</option>
                        <option value="14px">上段 14px</option>
                        <option value="16px" selected>上段 16px</option>
                        <option value="18px">上段 18px</option>
                        <option value="20px">上段 20px</option>
                    </select>
                    <select @change="setDoubleTextFontSize('bottom', $event.target.value)">
                        <option value="12px">下段 12px</option>
                        <option value="14px" selected>下段 14px</option>
                        <option value="16px">下段 16px</option>
                        <option value="18px">下段 18px</option>
                        <option value="20px">下段 20px</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="editor-content">
            <editor-content :editor="editor" />
        </div>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
import { EmojiNode, EMOJI_DATA } from '../extensions/EmojiNode'
import { DoubleTextNode } from '../extensions/DoubleTextNode'
import TextBlockNode from '../extensions/TextBlockNode'

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

export default {
    name: 'TiptapEditor',
    components: {
        EditorContent,
    },
    props: {
        // 外部注入的扩展
        extensions: {
            type: Array,
            default: () => []
        },
        // 初始内容
        initialContent: {
            type: String,
            default: ''
        },
        // 是否启用默认工具栏
        showToolbar: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            editor: null,
            editorFocused: false,
            lastCursorPosition: null,
            savedSelection: null,
            selectedNodeInfo: null,
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
        }
    },
    mounted() {
        // 获取要使用的扩展
        const extensionsToUse = this.getExtensions()
        
        // 获取初始内容
        const content = this.initialContent || this.getDefaultContent()
        
        this.editor = new Editor({
            content,
            extensions: extensionsToUse,
            onUpdate: ({ editor }) => {
                console.log('编辑器内容已更新', editor)
                this.$emit('update', editor)
            },
            onSelectionUpdate: ({ editor }) => {
                this.checkSelectedNode(editor)
                this.$emit('selection-update', editor)
            },
            // 新增：焦点事件处理
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
        })
        
        // 添加键盘快捷键监听
        this.addKeyboardListeners()
        
        // 暴露编辑器实例给父组件
        this.$emit('editor-ready', this.editor)
    },
    beforeUnmount() {
        this.removeKeyboardListeners()
        this.editor.destroy()
    },
    methods: {
        // 保存当前光标位置
        saveCurrentCursorPosition(editor) {
            if (!editor) return
            
            const { selection } = editor.state
            const { from, to } = selection
            
            // 保存选择范围用于恢复
            this.savedSelection = { from, to }
            
            // 计算行列位置用于显示
            const doc = editor.state.doc
            const pos = selection.$anchor.pos
            
            let line = 1
            let column = 1
            let currentPos = 0
            
            // 遍历文档计算行列位置
            doc.descendants((node, nodePos) => {
                if (currentPos >= pos) return false
                
                if (node.isText) {
                    const text = node.text
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
        
        // 恢复到上次光标位置
        restoreLastPosition() {
            if (!this.editor || !this.savedSelection) return
            
            // 聚焦编辑器并恢复选择位置
            this.editor.chain()
                .focus()
                .setTextSelection(this.savedSelection)
                .run()
            
            console.log('恢复到位置:', this.savedSelection)
        },
        
        // 清除保存的位置信息
        clearSavedPosition() {
            this.lastCursorPosition = null
            this.savedSelection = null
        },

        // 获取要使用的扩展
        getExtensions() {
            // 如果外部传入了扩展，使用外部扩展
            if (this.extensions && this.extensions.length > 0) {
                return this.extensions
            }
            
            // 否则使用默认扩展
            return this.getDefaultExtensions()
        },
        
        // 获取默认扩展
        getDefaultExtensions() {
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
        },
        
        // 获取默认内容
        getDefaultContent() {
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
        },
        
        // 暴露给外部的方法
        // 获取编辑器实例
        getEditor() {
            return this.editor
        },
        
        // 获取编辑器内容
        getContent() {
            return this.editor?.getHTML() || ''
        },
        
        // 设置编辑器内容
        setContent(content) {
            if (this.editor) {
                this.editor.commands.setContent(content)
            }
        },
        
        // 聚焦编辑器
        focus() {
            if (this.editor) {
                this.editor.commands.focus()
            }
        },
        
        // 清空编辑器
        clear() {
            if (this.editor) {
                this.editor.commands.clearContent()
            }
        },
        
        // 销毁编辑器
        destroy() {
            if (this.editor) {
                this.removeKeyboardListeners()
                this.editor.destroy()
                this.editor = null
            }
        },
        changeParagraphColor(color) {
            if (this.editor) {

                // 方法1: 尝试更新属性
                try {
                    this.editor.chain().focus().updateAttributes('paragraph', { color }).run()
                    console.log('方法1成功')
                } catch (error) {
                    console.log('方法1失败:', error)

                    // 方法2: 尝试设置节点属性
                    try {
                        this.editor.chain().focus().setNode('paragraph', { color }).run()
                        console.log('方法2成功')
                    } catch (error2) {
                        console.log('方法2失败:', error2)

                        // 方法3: 尝试为当前选中的内容设置属性
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
        insertEmoji(type) {
            if (!this.editor) return

            const emojiData = EMOJI_DATA[type]
            if (emojiData) {
                this.editor.chain().focus().insertEmoji({
                    emoji: emojiData.emoji,
                    label: emojiData.label,
                    type: type,
                }).run()
            }
        },
        editSelectedEmoji() {
            if (!this.editor) return

            // 检查当前选中的是否是表情符号节点
            const { selection } = this.editor.state
            const node = selection.$from.node()

            if (node && node.type.name === 'emojiNode') {
                // 如果选中的是表情符号节点，提示用户编辑
                const newLabel = prompt('请输入新的标签文字:', node.textContent || '表情')
                if (newLabel !== null) {
                    // 更新表情符号的文本内容
                    this.editor.chain().focus().insertContent(newLabel).run()
                }
            } else {
                // 如果没有选中表情符号，提示用户
                alert('请先选中一个表情符号节点')
            }
        },
        insertDoubleTextNode() {
            if (!this.editor) return
            const { selection } = this.editor.state;
            const { $from} = selection;
            const node = $from.node();
            console.log(node.type.name)
            if(node.type.name==='doubleTextNode'|| node.type.name==='textBlock'){
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
            
            // 获取当前节点的属性
            const attrs = this.editor.getAttributes('doubleTextNode')
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
            this.editor.chain().focus().setDoubleTextStyle(which, styleType, newValue).run()
        },
        
        setDoubleTextFontSize(which, size) {
            if (!this.editor) return
            
            this.editor.chain().focus().setDoubleTextStyle(which, 'fontSize', size).run()
        },

        
        // 编辑双文本节点的文本内容
        editDoubleTextContent(which) {
            if (!this.editor) return
            
            const { state } = this.editor
            const { selection, doc } = state
            let found = false;
            let node = null;
            
            // 1. 查找选区内的 doubleTextNode 节点
            doc.nodesBetween(selection.from, selection.to, (n) => {
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
                    this.editor.chain().focus().setDoubleTextContent(which, newText).run();
                }
            } else {
                alert('请先选中一个双文本节点');
            }
        },

        checkSelectedNode(editor) {
            const { selection } = editor.state;
            const { $from } = selection;
            let node = null;

            // 检查光标所在位置的节点及其父节点
            for (let i = $from.depth; i > 0; i--) {
                const currentNode = $from.node(i);
                if (currentNode.type.name === 'doubleTextNode') {
                    node = currentNode;

                    break;
                }
            }

            if (node) {
                this.selectedNodeInfo = `双文本节点 - 上段: ${node.attrs.topColor}, 下段: ${node.attrs.bottomColor}`;
            } else {
                this.selectedNodeInfo = null;
            }
        },

        // 复制选中的节点
        copySelectedNode() {
            if (!this.editor) return;
            
            const { state } = this.editor;
            const { selection, doc } = state;
            let nodeInfo = null;
            
            // 查找选中的节点
            doc.nodesBetween(selection.from, selection.to, (node, pos) => {
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
                this.editor.view.dispatch(tr);
                
                console.log('节点已复制:', nodeInfo.node.type.name);
            } else {
                alert('请先选中一个节点（双文本节点或表情符号）');
            }
        },
        
        // 删除选中的节点
        deleteSelectedNode() {
            if (!this.editor) return;
            
            const { state } = this.editor;
            const { selection, doc } = state;
            let nodeInfo = null;
            
            // 查找选中的节点
            doc.nodesBetween(selection.from, selection.to, (node, pos) => {
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
                    this.editor.view.dispatch(tr);
                    
                    console.log('节点已删除:', nodeInfo.node.type.name);
                }
            } else {
                alert('请先选中一个节点（双文本节点或表情符号）');
            }
        },

        // 添加键盘快捷键监听器
        addKeyboardListeners() {
            this.keyboardHandler = (event) => {
                // Ctrl+D 或 Cmd+D 复制节点
                if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                    event.preventDefault()
                    this.copySelectedNode()
                    return
                }
                
                // Delete 键删除节点（只在选中特定节点时）
                if (event.key === 'Delete') {
                    const { state } = this.editor
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
                        this.deleteSelectedNode()
                    }
                }
            }
            
            document.addEventListener('keydown', this.keyboardHandler)
        },
        
        // 移除键盘快捷键监听器
        removeKeyboardListeners() {
            if (this.keyboardHandler) {
                document.removeEventListener('keydown', this.keyboardHandler)
                this.keyboardHandler = null
            }
        },



    },
}
</script>

<style scoped>
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
.tiptap-editor:not(.focused) .ProseMirror {
  border-color: #ced4da;
  box-shadow: none;
}

.tiptap-editor.focused .ProseMirror {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.tiptap-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.toolbar button:hover {
  background: #f0f0f0;
}

.toolbar button.is-active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.emoji-section {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #ddd;
}

.emoji-label {
  font-size: 12px;
  color: #666;
  margin-right: 5px;
}

.emoji-btn {
  padding: 4px 8px !important;
  font-size: 16px !important;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.emoji-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.edit-btn {
  padding: 4px 8px !important;
  font-size: 14px !important;
  background: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #d0d0d0;
}

:deep(.double-text-node > p:nth-child(1)) {
  color: var(--top-color, #333);
  font-size: var(--top-font-size, 16px);
  font-weight: var(--top-font-weight, normal);
  font-style: var(--top-font-style, normal);
  text-decoration: var(--top-text-decoration, none);
  margin-bottom: 0.5em;
}
:deep(.double-text-node > p:nth-child(2)) {
  color: var(--bottom-color, #666);
  font-size: var(--bottom-font-size, 14px);
  font-weight: var(--bottom-font-weight, normal);
  font-style: var(--bottom-font-style, normal);
  text-decoration: var(--bottom-text-decoration, none);
}

/* 保持原有样式 */
.double-text-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #ddd;
}

.node-operation-buttons {
  display: flex;
  gap: 10px;
  margin: 5px 0;
}

.copy-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background: #c82333;
}

.double-text-section button {
  padding: 4px 8px !important;
  font-size: 12px !important;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.double-text-section button:hover {
  background: #e9ecef;
}

.format-buttons,
.font-size-buttons,
.edit-text-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.format-buttons button,
.edit-text-buttons button {
  padding: 4px 8px !important;
  font-size: 12px !important;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-buttons button:hover,
.edit-text-buttons button:hover {
  background: #e9ecef;
}

.font-size-buttons select {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
}

.color-picker-btn {
  padding: 4px 8px !important;
  font-size: 12px !important;
  background: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-picker-btn:hover {
  background: #d0d0d0;
}

:deep(.double-text-node) {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #eee;
  border-radius: 8px;
  /* background: #fafafa; */
}

:deep(.double-text-node .top-text),
:deep(.double-text-node .bottom-text) {
  min-height: 1.5em;
  outline: none;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

:deep(.double-text-node .top-text:hover),
:deep(.double-text-node .bottom-text:hover) {
  background: rgba(0, 123, 255, 0.1);
}

:deep(.double-text-node .top-text:focus),
:deep(.double-text-node .bottom-text:focus) {
  background: rgba(0, 123, 255, 0.15);
  outline: 2px solid rgba(0, 123, 255, 0.3);
}

.editor-content {
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 300px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
}



.storage-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.storage-info h3 {
  margin-top: 0;
  color: #333;
}

.storage-info p {
  margin: 5px 0;
  color: #666;
}

.tips {
  margin: 10px 0;
  padding: 10px;
  background: #e9ecef;
  border-radius: 4px;
}

.tips h4 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 14px;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 4px 0;
  font-size: 12px;
  color: #6c757d;
}

/* 表情符号节点样式 */
:deep(.emoji-node) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 14px;
  margin: 0 2px;
  cursor: text;
  transition: all 0.2s;
}

:deep(.emoji-node:hover) {
  background: #e8e8e8;
  border-color: #bbb;
}

:deep(.emoji-node:focus-within) {
  background: #fff;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

:deep(.emoji-node .emoji) {
  font-size: 16px;
  user-select: none;
  cursor: default;
}

:deep(.emoji-node .label) {
  font-size: 12px;
  color: #666;
  min-width: 1em;
  outline: none;
  border: none;
  background: transparent;
  font-family: inherit;
  display: flex;
  align-items: center;
}

:deep(.emoji-node .label-content) {
  outline: none;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  color: #666;
  min-width: 1em;
}

:deep(.emoji-node .label-content:focus) {
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  padding: 1px 2px;
}


</style>