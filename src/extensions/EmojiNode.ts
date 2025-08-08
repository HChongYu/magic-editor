import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'
import type { NodeViewRenderer } from '@tiptap/core'

// 表情符号数据类型定义
interface EmojiData {
  emoji: string
  label: string
}

interface EmojiAttributes {
  emoji: string
  type: string
  label?: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emojiNode: {
      insertEmoji: (attributes: EmojiAttributes) => ReturnType
      setEmoji: (attributes: EmojiAttributes) => ReturnType
      updateEmoji: (attributes: EmojiAttributes) => ReturnType
      replaceEmoji: (attributes: EmojiAttributes) => ReturnType
    }
  }
}

// 表情符号数据
const EMOJI_DATA: Record<string, EmojiData> = {
  'smile': { emoji: '😊', label: '微笑' },
  'heart': { emoji: '❤️', label: '爱心' },
  'thumbsup': { emoji: '👍', label: '点赞' },
  'star': { emoji: '⭐', label: '星星' },
  'fire': { emoji: '🔥', label: '火焰' },
  'rocket': { emoji: '🚀', label: '火箭' },
  'party': { emoji: '🎉', label: '庆祝' },
  'coffee': { emoji: '☕', label: '咖啡' },
}

export const EmojiNode = Node.create({
  name: 'emojiNode',

  // 定义节点属性
  addAttributes() {
    return {
      emoji: {
        default: '😊',
        parseHTML: element => element.getAttribute('data-emoji'),
        renderHTML: attributes => ({
          'data-emoji': attributes.emoji,
        }),
      },
      type: {
        default: 'smile',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  // 定义内容结构 - 允许包含文本内容
  content: 'text*',

  // 定义组（用于工具栏按钮等）
  group: 'inline',

  // 内联渲染
  inline: true,

  // 可选择的
  selectable: true,

  // 可拖拽的
  draggable: true,

  // 解析 HTML
  parseHTML() {
    return [
      {
        tag: 'span[data-type="emoji"]',
      },
    ]
  },

  // 渲染 HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'span', 
      mergeAttributes(HTMLAttributes, { 
        class: 'emoji-node',
        style: 'display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; background: #f0f0f0; border-radius: 12px; border: 1px solid #ddd; font-size: 14px; margin: 0 2px;'
      }),
      ['span', { class: 'emoji', style: 'font-size: 16px;' }, HTMLAttributes.emoji || '😊'],
      ['span', { class: 'label', style: 'font-size: 12px; color: #666;' }, 0]
    ]
  },

  // 添加节点视图来处理可编辑内容
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span')
      dom.className = 'emoji-node draggable-node'
      dom.setAttribute('data-type', 'emoji')
      dom.setAttribute('data-emoji', node.attrs.emoji)
      dom.style.position = 'relative'
      dom.style.cursor = 'grab'
      
      // 创建拖拽手柄
      const dragHandle = document.createElement('span')
      dragHandle.className = 'emoji-drag-handle'
      dragHandle.textContent = '⋮⋮'
      dragHandle.title = '拖拽移动表情符号'
      dragHandle.style.position = 'absolute'
      dragHandle.style.left = '-12px'
      dragHandle.style.top = '50%'
      dragHandle.style.transform = 'translateY(-50%)'
      dragHandle.style.width = '8px'
      dragHandle.style.height = '16px'
      dragHandle.style.background = '#007acc'
      dragHandle.style.color = 'white'
      dragHandle.style.borderRadius = '2px'
      dragHandle.style.display = 'flex'
      dragHandle.style.alignItems = 'center'
      dragHandle.style.justifyContent = 'center'
      dragHandle.style.fontSize = '6px'
      dragHandle.style.lineHeight = '1'
      dragHandle.style.cursor = 'grab'
      dragHandle.style.opacity = '0'
      dragHandle.style.transition = 'opacity 0.2s'
      dragHandle.style.userSelect = 'none'
      
      const emojiSpan = document.createElement('span')
      emojiSpan.className = 'emoji'
      emojiSpan.textContent = node.attrs.emoji
      emojiSpan.style.fontSize = '16px'
      
      const labelSpan = document.createElement('span')
      labelSpan.className = 'label'
      labelSpan.style.fontSize = '12px'
      labelSpan.style.color = '#666'
      labelSpan.style.minWidth = '1em'
      labelSpan.style.outline = 'none'
      labelSpan.style.border = 'none'
      labelSpan.style.background = 'transparent'
      labelSpan.style.fontFamily = 'inherit'
      
      // 创建内容 DOM 用于编辑
      const contentDOM = document.createElement('span')
      contentDOM.className = 'label-content'
      
      // 添加悬停事件显示拖拽手柄
      dom.addEventListener('mouseenter', () => {
        dragHandle.style.opacity = '1'
      })
      dom.addEventListener('mouseleave', () => {
        dragHandle.style.opacity = '0'
      })
      
      // 拖拽功能
      let isDragging = false
      let dragStartPos: { x: number; y: number } | null = null
      let draggedNodeInfo: { pos: any; node?: any } | null = null
      
      const startDrag = (event: { clientX: any; clientY: any; preventDefault: () => void }) => {
        isDragging = true
        dragStartPos = { x: event.clientX, y: event.clientY }
        
        // 获取编辑器实例
        const editorView = dom.closest('.ProseMirror')
        if (editorView && (editorView as any).pmViewDesc) {
          // 使用类型断言来访问 ProseMirror 视图
          const view = (editorView as any).pmViewDesc?.view
          const pos = view.posAtDOM(dom, 0)
          const nodeAtPos = view.state.doc.nodeAt(pos)
          
          draggedNodeInfo = {
            node: nodeAtPos,
            pos: pos
          }
          
          // 存储到编辑器
          if (view.state.schema.cached.customExtension) {
            view.state.schema.cached.customExtension.draggedNodeInfo = draggedNodeInfo
          }
        }
        
        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', endDrag)
        event.preventDefault()
      }
      
      const handleDrag = (event: { clientX: number; clientY: number }) => {
        if (!isDragging) return
        
        const deltaX = dragStartPos ? event.clientX - dragStartPos.x : 0
        const deltaY = dragStartPos ? event.clientY - dragStartPos.y : 0
        
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          document.body.style.cursor = 'grabbing'
          dom.style.cursor = 'grabbing'
        }
      }
      
      const endDrag = (event: { clientX: any; clientY: any }) => {
        if (!isDragging) return
        
        isDragging = false
        document.body.style.cursor = ''
        dom.style.cursor = 'grab'
        
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', endDrag)
        
        if (draggedNodeInfo) {
          const editorView = dom.closest('.ProseMirror')
          if (editorView && (editorView as any).pmViewDesc) {
            const view = (editorView as any).pmViewDesc.view
            const targetPos = view.posAtCoords({ left: event.clientX, top: event.clientY })
            
            if (targetPos && targetPos.pos !== draggedNodeInfo.pos) {
              const { tr } = view.state
              const { node, pos } = draggedNodeInfo
              
              // 删除原节点
              tr.delete(pos, pos + node.nodeSize)
              
              // 调整插入位置
              let insertPos = targetPos.pos
              if (insertPos > pos) {
                insertPos -= node.nodeSize
              }
              
              // 插入到新位置
              tr.insert(insertPos, node)
              
              view.dispatch(tr)
            }
          }
          draggedNodeInfo = null
        }
      }
      
      // 为拖拽手柄添加事件监听
      dragHandle.addEventListener('mousedown', startDrag)
      
      dom.appendChild(dragHandle)
      dom.appendChild(emojiSpan)
      dom.appendChild(labelSpan)
      labelSpan.appendChild(contentDOM)
      
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false
          }
          
          emojiSpan.textContent = updatedNode.attrs.emoji
          dom.setAttribute('data-emoji', updatedNode.attrs.emoji)
          return true
        },
      }
    }
  },

  // 添加命令
  addCommands() {
    return {
      insertEmoji: (attributes: EmojiAttributes) => ({ commands }: { commands: any }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
          content: [
            {
              type: 'text',
              text: attributes.label || '表情',
            },
          ],
        })
      },
      setEmoji: (attributes: EmojiAttributes) => ({ commands }: { commands: any }) => {
        return commands.updateAttributes(this.name, attributes)
      },
      updateEmoji: (attributes: EmojiAttributes) => ({ chain }: { chain: any }) => {
        return chain()
          .focus()
          .updateAttributes(this.name, attributes)
          .run()
      },
      replaceEmoji: (attributes: EmojiAttributes) => ({ chain }: { chain: any }) => {
        return chain()
          .focus()
          .deleteSelection()
          .insertContent({
            type: this.name,
            attrs: attributes,
            content: [
              {
                type: 'text',
                text: attributes.label || '表情',
              },
            ],
          })
          .run()
      },
    }
  },

  // 添加键盘快捷键
  addKeyboardShortcuts() {
    return {
      'Mod-e': () => {
        return this.editor.commands.insertEmoji({
          emoji: '😊',
          type: 'smile',
          label: '微笑',
        })
      },
    }
  },
})

// 导出表情符号数据供外部使用
export { EMOJI_DATA }