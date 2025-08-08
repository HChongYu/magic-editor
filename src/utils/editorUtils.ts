import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Extension } from '@tiptap/core'
import { JSONContent } from '@tiptap/core'
import { EmojiNode } from '@/extensions/EmojiNode'
import { DoubleTextNode } from '@/extensions/DoubleTextNode'
import TextBlockNode from '@/extensions/TextBlockNode'
import { TravelCardNode } from '@/extensions/TravelCardNode'

// 编辑器工具类
export class EditorUtils {
    private editor: Editor | null = null

    constructor(editor?: Editor) {
        this.editor = editor || null
    }

    // 设置编辑器实例
    setEditor(editor: Editor) {
        this.editor = editor
    }

    // 检查编辑器是否可用
    private checkEditor(): boolean {
        if (!this.editor) {
            console.warn('编辑器实例未设置')
            return false
        }
        return true
    }

    // ========== 节点插入方法 ==========

    // 插入旅游卡片节点
    insertTravelCard(attrs?: {
        title?: string
        description?: string
        imageUrl?: string
        location?: string
        price?: string
    }) {
        if (!this.checkEditor()) return false

        const defaultAttrs = {
            title: '旅游目的地',
            description: '这里是描述信息',
            imageUrl: 'https://via.placeholder.com/300x200',
            location: '位置信息',
            price: '¥999'
        }

        return this.editor!.chain()
            .focus()
            .insertTravelCard({ ...defaultAttrs, ...attrs })
            .run()
    }

    // 插入双文本节点
    insertDoubleText(attrs?: {
        topText?: string
        bottomText?: string
        topColor?: string
        bottomColor?: string
        topFontSize?: string
        bottomFontSize?: string
    }) {
        if (!this.checkEditor()) return false

        const defaultAttrs = {
            topText: '上段文字',
            bottomText: '下段文字',
            topColor: '#333333',
            bottomColor: '#666666',
            topFontSize: '16px',
            bottomFontSize: '14px'
        }

        return this.editor!.chain()
            .focus()
            .insertContent({
                type: 'doubleTextNode',
                attrs: { ...defaultAttrs, ...attrs }
            })
            .run()
    }

    // 插入表情符号节点
    insertEmoji(attrs?: {
        emoji?: string
        label?: string
    }) {
        if (!this.checkEditor()) return false

        const defaultAttrs = {
            emoji: '😊',
            label: '点击编辑标签'
        }

        return this.editor!.chain()
            .focus()
            .insertEmoji({ type: 'emoji', ...defaultAttrs, ...attrs })
            .run()
    }

    // 插入文本块节点
    insertTextBlock(attrs?: {
        content?: string
        backgroundColor?: string
        textColor?: string
    }) {
        if (!this.checkEditor()) return false

        const defaultAttrs = {
            content: '这是一个文本块',
            backgroundColor: '#f5f5f5',
            textColor: '#333333'
        }

        return this.editor!.chain()
            .focus()
            .insertContent({
                type: 'textBlockNode',
                attrs: { ...defaultAttrs, ...attrs }
            })
            .run()
    }

    // ========== 内容操作方法 ==========

    // 获取编辑器内容
    getContent(format: 'html' | 'json' | 'text' = 'html') {
        if (!this.checkEditor()) return ''

        switch (format) {
            case 'html':
                return this.editor!.getHTML()
            case 'json':
                return this.editor!.getJSON()
            case 'text':
                return this.editor!.getText()
            default:
                return this.editor!.getHTML()
        }
    }

    // 设置编辑器内容
    setContent(content: string | JSONContent) {
        if (!this.checkEditor()) return false

        return this.editor!.commands.setContent(content)
    }

    // 清空编辑器
    clearContent() {
        if (!this.checkEditor()) return false

        return this.editor!.commands.clearContent()
    }

    // ========== 文本格式化方法 ==========

    // 加粗
    toggleBold() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleBold().run()
    }

    // 斜体
    toggleItalic() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleItalic().run()
    }

    // 下划线
    toggleUnderline() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleUnderline().run()
    }

    // 删除线
    toggleStrike() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleStrike().run()
    }

    // 设置标题级别
    setHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleHeading({ level }).run()
    }

    // 设置段落
    setParagraph() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().setParagraph().run()
    }

    // 项目符号列表
    toggleBulletList() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleBulletList().run()
    }

    // 有序列表
    toggleOrderedList() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleOrderedList().run()
    }

    // 引用块
    toggleBlockquote() {
        if (!this.checkEditor()) return false
        return this.editor!.chain().focus().toggleBlockquote().run()
    }

    // ========== 选择与光标操作 ==========

    // 聚焦编辑器
    focus() {
        if (!this.checkEditor()) return false
        return this.editor!.commands.focus()
    }

    // 获取当前选择范围
    getSelection() {
        if (!this.checkEditor()) return null
        return this.editor!.state.selection
    }

    // 设置选择范围
    setSelection(from: number, to?: number) {
        if (!this.checkEditor()) return false
        return this.editor!.commands.setTextSelection({ from, to: to || from })
    }

    // 选择全部内容
    selectAll() {
        if (!this.checkEditor()) return false
        return this.editor!.commands.selectAll()
    }

    // ========== 节点操作方法 ==========

    // 获取选中的节点信息
    getSelectedNodeInfo() {
        if (!this.checkEditor()) return null

        const { selection } = this.editor!.state
        const { $from } = selection

        for (let i = $from.depth; i > 0; i--) {
            const node = $from.node(i)
            if (['doubleTextNode', 'emojiNode', 'travelCardNode', 'textBlockNode'].includes(node.type.name)) {
                return {
                    type: node.type.name,
                    attrs: node.attrs,
                    content: node.content
                }
            }
        }

        return null
    }

    // 复制选中的节点
    copySelectedNode() {
        if (!this.checkEditor()) return false

        const { state } = this.editor!
        const { selection, doc } = state
        let nodeInfo: any = null

        // 查找选中的自定义节点
        doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
            if (['doubleTextNode', 'emojiNode', 'travelCardNode', 'textBlockNode'].includes(node.type.name)) {
                nodeInfo = { node, pos }
                return false
            }
        })

        if (!nodeInfo) {
            const resolvedPos = doc.resolve(selection.from)
            for (let depth = resolvedPos.depth; depth > 0; depth--) {
                const nodeAtDepth = resolvedPos.node(depth)
                if (['doubleTextNode', 'emojiNode', 'travelCardNode', 'textBlockNode'].includes(nodeAtDepth.type.name)) {
                    nodeInfo = { node: nodeAtDepth, pos: resolvedPos.start(depth) - 1 }
                    break
                }
            }
        }

        if (nodeInfo) {
            const { tr } = state
            const insertPos = selection.to
            tr.insert(insertPos, nodeInfo.node.copy())
            this.editor!.view.dispatch(tr)
            return true
        }

        return false
    }

    // 删除选中的节点
    deleteSelectedNode() {
        if (!this.checkEditor()) return false

        const { state } = this.editor!
        const { selection, doc } = state
        let nodeInfo: any = null

        // 查找选中的自定义节点
        doc.nodesBetween(selection.from, selection.to, (node: any, pos: number) => {
            if (['doubleTextNode', 'emojiNode', 'travelCardNode', 'textBlockNode'].includes(node.type.name)) {
                nodeInfo = { node, pos, size: node.nodeSize }
                return false
            }
        })

        if (!nodeInfo) {
            const resolvedPos = doc.resolve(selection.from)
            for (let depth = resolvedPos.depth; depth > 0; depth--) {
                const nodeAtDepth = resolvedPos.node(depth)
                if (['doubleTextNode', 'emojiNode', 'travelCardNode', 'textBlockNode'].includes(nodeAtDepth.type.name)) {
                    const posAtDepth = resolvedPos.start(depth) - 1
                    nodeInfo = { node: nodeAtDepth, pos: posAtDepth, size: nodeAtDepth.nodeSize }
                    break
                }
            }
        }

        if (nodeInfo) {
            const { tr } = state
            tr.delete(nodeInfo.pos, nodeInfo.pos + nodeInfo.size)
            this.editor!.view.dispatch(tr)
            return true
        }

        return false
    }

    // ========== 扩展管理方法 ==========

    // 获取默认扩展配置
    static getDefaultExtensions() {
        return [
            StarterKit.configure({
                bulletList: false,
                heading: false,
                paragraph: false,
                blockquote: false,
            }),
            EmojiNode,
            DoubleTextNode,
            TextBlockNode,
            TravelCardNode,
        ]
    }

    // 创建编辑器实例
    static createEditor(options: {
        content?: string | JSONContent
        extensions?: Extension[]
        onUpdate?: (editor: Editor) => void
        onSelectionUpdate?: (editor: Editor) => void
        onFocus?: (editor: Editor) => void
        onBlur?: (editor: Editor) => void
    } = {}) {
        const {
            content = '',
            extensions = EditorUtils.getDefaultExtensions(),
            onUpdate,
            onSelectionUpdate,
            onFocus,
            onBlur
        } = options

        return new Editor({
            content,
            extensions,
            onUpdate: (editor) => {
                // 自动保存逻辑
            },
            onSelectionUpdate: (editor) => {


            },
            onFocus: (editor) => {

                // 显示编辑提示
            },
            onBlur: (editor) => {
                console.log('编辑器失去焦点')
                // 保存草
            }
        })
    }

    // ========== 实用工具方法 ==========

    // 获取编辑器统计信息
    getStats() {
        if (!this.checkEditor()) return null

        const content = this.editor!.getText()
        const words = content.trim().split(/\s+/).filter(word => word.length > 0)

        return {
            characters: content.length,
            charactersWithoutSpaces: content.replace(/\s/g, '').length,
            words: words.length,
            paragraphs: content.split('\n\n').filter(p => p.trim().length > 0).length
        }
    }

    // 撤销
    undo() {
        if (!this.checkEditor()) return false
        return this.editor!.commands.undo()
    }

    // 重做
    redo() {
        if (!this.checkEditor()) return false
        return this.editor!.commands.redo()
    }

    // 检查是否可以撤销
    canUndo() {
        if (!this.checkEditor()) return false
        return this.editor!.can().undo()
    }

    // 检查是否可以重做
    canRedo() {
        if (!this.checkEditor()) return false
        return this.editor!.can().redo()
    }

    // 销毁编辑器
    destroy() {
        if (this.editor) {
            this.editor.destroy()
            this.editor = null
        }
    }
}

// 单例模式的编辑器工具实例
let globalEditorUtils: EditorUtils | null = null

// 获取全局编辑器工具实例
export const getEditorUtils = (editor?: Editor): EditorUtils => {
    if (!globalEditorUtils) {
        globalEditorUtils = new EditorUtils(editor)
    } else if (editor) {
        globalEditorUtils.setEditor(editor)
    }
    return globalEditorUtils
}

// 工具栏动作创建函数
export const createToolbarActions = (editorUtils: EditorUtils) => {
    return {
        // 格式化动作
        formatting: {
            bold: () => editorUtils.toggleBold(),
            italic: () => editorUtils.toggleItalic(),
            underline: () => editorUtils.toggleUnderline(),
            strike: () => editorUtils.toggleStrike(),
            h1: () => editorUtils.setHeading(1),
            h2: () => editorUtils.setHeading(2),
            h3: () => editorUtils.setHeading(3),
            paragraph: () => editorUtils.setParagraph(),
            bulletList: () => editorUtils.toggleBulletList(),
            orderedList: () => editorUtils.toggleOrderedList(),
            blockquote: () => editorUtils.toggleBlockquote(),
        },

        // 节点插入动作
        insert: {
            travelCard: (attrs?: any) => editorUtils.insertTravelCard(attrs),
            doubleText: (attrs?: any) => editorUtils.insertDoubleText(attrs),
            emoji: (attrs?: any) => editorUtils.insertEmoji(attrs),
            textBlock: (attrs?: any) => editorUtils.insertTextBlock(attrs),
        },

        // 节点操作动作
        node: {
            copy: () => editorUtils.copySelectedNode(),
            delete: () => editorUtils.deleteSelectedNode(),
            getInfo: () => editorUtils.getSelectedNodeInfo(),
        },

        // 编辑器操作动作
        editor: {
            undo: () => editorUtils.undo(),
            redo: () => editorUtils.redo(),
            selectAll: () => editorUtils.selectAll(),
            focus: () => editorUtils.focus(),
            clear: () => editorUtils.clearContent(),
            getStats: () => editorUtils.getStats(),
        }
    }
}

// 默认导出
export default EditorUtils