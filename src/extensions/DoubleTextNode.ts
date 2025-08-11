import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
// 确保 DoubleTextView.vue 文件存在于正确的路径下
import DoubleTextView from '../components/DoubleTextView.vue'

// DoubleText 节点属性类型定义
interface DoubleTextAttributes {
  topColor: string
  bottomColor: string
  topText: string
  bottomText: string
  topFontSize: string
  bottomFontSize: string
  topFontWeight: string
  bottomFontWeight: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    doubleText: {
      setDoubleTextColor: (which: 'top' | 'bottom', color: string) => ReturnType
      setDoubleTextContent: (which: 'top' | 'bottom', text: string) => ReturnType
      setDoubleTextStyle: (which: 'top' | 'bottom', style: Record<string, string>) => ReturnType
    }
  }
}

export const DoubleTextNode = Node.create({
    name: 'doubleTextNode',
    group: 'block',
    isolating: true,
    defining: true,
    content: 'textBlock textBlock', // 严格限制为两个 textBlock
    draggable: true,

    addAttributes() {
        return {
            topColor: {
                default: '#333',
                parseHTML: el => el.getAttribute('data-top-color') || '#333',
                renderHTML: attrs => ({ 'data-top-color': attrs.topColor }),
            },
            bottomColor: {
                default: '#666',
                parseHTML: el => el.getAttribute('data-bottom-color') || '#666',
                renderHTML: attrs => ({ 'data-bottom-color': attrs.bottomColor }),
            },
            topText: {
                default: '上段文字',
                parseHTML: el => el.getAttribute('data-top-text') || '上段文字',
                renderHTML: attrs => ({ 'data-top-text': attrs.topText }),
            },
            bottomText: {
                default: '下段文字',
                parseHTML: el => el.getAttribute('data-bottom-text') || '下段文字',
                renderHTML: attrs => ({ 'data-bottom-text': attrs.bottomText }),
            },
            topFontSize: {
                default: '16px',
                parseHTML: el => el.getAttribute('data-top-font-size') || '16px',
                renderHTML: attrs => ({ 'data-top-font-size': attrs.topFontSize }),
            },
            bottomFontSize: {
                default: '14px',
                parseHTML: el => el.getAttribute('data-bottom-font-size') || '14px',
                renderHTML: attrs => ({ 'data-bottom-font-size': attrs.bottomFontSize }),
            },
            topFontWeight: {
                default: 'normal',
                parseHTML: el => el.getAttribute('data-top-font-weight') || 'normal',
                renderHTML: attrs => ({ 'data-top-font-weight': attrs.topFontWeight }),
            },
            bottomFontWeight: {
                default: 'normal',
                parseHTML: el => el.getAttribute('data-bottom-font-weight') || 'normal',
                renderHTML: attrs => ({ 'data-bottom-font-weight': attrs.bottomFontWeight }),
            },
            topFontStyle: {
                default: 'normal',
                parseHTML: el => el.getAttribute('data-top-font-style') || 'normal',
                renderHTML: attrs => ({ 'data-top-font-style': attrs.topFontStyle }),
            },
            bottomFontStyle: {
                default: 'normal',
                parseHTML: el => el.getAttribute('data-bottom-font-style') || 'normal',
                renderHTML: attrs => ({ 'data-bottom-font-style': attrs.bottomFontStyle }),
            },
            topTextDecoration: {
                default: 'none',
                parseHTML: el => el.getAttribute('data-top-text-decoration') || 'none',
                renderHTML: attrs => ({ 'data-top-text-decoration': attrs.topTextDecoration }),
            },
            bottomTextDecoration: {
                default: 'none',
                parseHTML: el => el.getAttribute('data-bottom-text-decoration') || 'none',
                renderHTML: attrs => ({ 'data-bottom-text-decoration': attrs.bottomTextDecoration }),
            },
            // 新增文本对齐属性
            topTextAlign: {
                default: 'left',
                parseHTML: el => el.getAttribute('data-top-text-align') || 'left',
                renderHTML: attrs => ({ 'data-top-text-align': attrs.topTextAlign }),
            },
            bottomTextAlign: {
                default: 'left',
                parseHTML: el => el.getAttribute('data-bottom-text-align') || 'left',
                renderHTML: attrs => ({ 'data-bottom-text-align': attrs.bottomTextAlign }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-type="double-text"]' }]
    },

    renderHTML({ HTMLAttributes }) {
        // 拼接 style，支持 CSS 变量
        const style = `margin: 1em 0; padding: 1em; border: 1px solid #eee; border-radius: 8px;`
        
        // 设置 CSS 变量，用于子元素样式
        const cssVars = `
            --top-color: ${HTMLAttributes.topColor || '#333'};
            --bottom-color: ${HTMLAttributes.bottomColor || '#666'};
            --top-font-size: ${HTMLAttributes.topFontSize || '16px'};
            --bottom-font-size: ${HTMLAttributes.bottomFontSize || '14px'};
            --top-font-weight: ${HTMLAttributes.topFontWeight || 'normal'};
            --bottom-font-weight: ${HTMLAttributes.bottomFontWeight || 'normal'};
            --top-font-style: ${HTMLAttributes.topFontStyle || 'normal'};
            --bottom-font-style: ${HTMLAttributes.bottomFontStyle || 'normal'};
            --top-text-decoration: ${HTMLAttributes.topTextDecoration || 'none'};
            --bottom-text-decoration: ${HTMLAttributes.bottomTextDecoration || 'none'};
        `
        
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'double-text',
                class: 'double-text-node',
                style: style + cssVars,
                'data-top-color': HTMLAttributes.topColor || '#333',
                'data-bottom-color': HTMLAttributes.bottomColor || '#666',
                'data-top-font-size': HTMLAttributes.topFontSize || '16px',
                'data-bottom-font-size': HTMLAttributes.bottomFontSize || '14px',
                'data-top-font-weight': HTMLAttributes.topFontWeight || 'normal',
                'data-bottom-font-weight': HTMLAttributes.bottomFontWeight || 'normal',
                'data-top-font-style': HTMLAttributes.topFontStyle || 'normal',
                'data-bottom-font-style': HTMLAttributes.bottomFontStyle || 'normal',
                'data-top-text-decoration': HTMLAttributes.topTextDecoration || 'none',
                'data-bottom-text-decoration': HTMLAttributes.bottomTextDecoration || 'none',
            }),
            // 渲染子节点（两个段落）
            0
        ]
    },

    addCommands() {
        return {
            
            insertDoubleText: (attrs: Record<string, any>) => ({ chain }: { chain: any }) => {
                return chain().insertContent({
                    type: this.name,
                    attrs,
                    content: [
                        { type: 'textBlock', content: [{ type: 'text', text: attrs.topText }] },
                        { type: 'textBlock', content: [{ type: 'text', text: attrs.bottomText }] }
                    ]
                }).run()
            },
            setDoubleTextColor: (which: 'top' | 'bottom', color: string) => ({ chain }: { chain: any }) => {
                return chain().updateAttributes(this.name, { [`${which}Color`]: color }).run()
            },
            setDoubleTextContent: (which: 'top' | 'bottom', text: string) => ({ tr, editor, dispatch }: { tr: any, editor: any, dispatch: any }) => {
                const { selection } = tr
                const node = editor.state.doc.nodeAt(selection.from)
                
                if (node && node.type.name === this.name) {
                    const attrs = { ...node.attrs, [`${which}Text`]: text }
                    const newNode = node.type.create(attrs, node.content, node.marks)
                    tr.replaceWith(selection.from, selection.from + node.nodeSize, newNode)
                    
                    if (dispatch) {
                        dispatch(tr)
                    }
                    return true
                }
                return false
            },
            setDoubleTextStyle: (which: 'top' | 'bottom', style: Record<string, string>) => ({ chain }: { chain: any }) => {
                const styleString = Object.entries(style)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('; ')
                return chain().updateAttributes(this.name, { [`${which}Style`]: styleString }).run()
            }
        }
    },

    // addNodeView() {
    //     return VueNodeViewRenderer(DoubleTextView)
    // },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('doubleTextNodeGuard'),
                filterTransaction: (transaction) => {
                    // If the document hasn't changed, we don't need to check anything
                    if (!transaction.docChanged) {
                        return true;
                    }

                    // We check the document that would result from this transaction
                    const newDoc = transaction.doc;
                    let isInvalid = false;

                    // Iterate over all nodes in the new document
                    newDoc.descendants((node) => {
                        // Check only our doubleTextNode
                        if (node.type.name === this.name) {
                            // It must have exactly two children
                            if (node.childCount !== 2) {
                                isInvalid = true;
                                return false; // stop iterating
                            }
                            // The children must be of type textBlock
                            if (node.child(0).type.name !== 'textBlock' || node.child(1).type.name !== 'textBlock') {
                                isInvalid = true;
                                return false; // stop iterating
                            }
                        }
                    });

                    // If the transaction is invalid, we filter it out (don't apply it)
                    if (isInvalid) {
                        return false;
                    }

                    // Otherwise, allow the transaction
                    return true;
                },
            }),
        ];
    },

})

export default DoubleTextNode