import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageTextListView from '../components/ImageTextListView.vue'

// 图文列表节点属性类型定义
interface ImageTextListAttributes {
    title: string
    items: Array<{
        id: string
        image: string
        title: string
        description: string
    }>
    moreText: string
    moreLink: string
}

// 声明命令类型
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageTextList: {
            setImageTextList: (attrs: Partial<ImageTextListAttributes>) => ReturnType
            updateImageTextListItem: (itemId: string, data: Partial<ImageTextListAttributes['items'][0]>) => ReturnType
            addImageTextListItem: (item: ImageTextListAttributes['items'][0]) => ReturnType
            removeImageTextListItem: (itemId: string) => ReturnType
        }
    }
}

export const ImageTextListNode = Node.create({
    name: 'imageTextList',
    group: 'block',
    content: '', // 改为空，不再支持内联内容
    isolating: true,
    defining: true,
    draggable: true,
    selectable: true,
    atom: true, // 保持原子性

    addAttributes() {
        return {
            title: {
                default: '图文组合列表',
                parseHTML: el => el.getAttribute('data-title') || '图文组合列表',
                renderHTML: attrs => ({ 'data-title': attrs.title }),
            },
            items: {
                default: [
                    {
                        id: '1',
                        image: '/api/placeholder/150/100',
                        title: '标题一',
                        description: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
                    },
                    {
                        id: '2',
                        image: '/api/placeholder/150/100',
                        title: '标题二',
                        description: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
                    }
                ],
                parseHTML: el => {
                    const itemsStr = el.getAttribute('data-items')
                    return itemsStr ? JSON.parse(itemsStr) : []
                },
                renderHTML: attrs => ({ 'data-items': JSON.stringify(attrs.items) }),
            },
            moreText: {
                default: '查看更多',
                parseHTML: el => el.getAttribute('data-more-text') || '查看更多',
                renderHTML: attrs => ({ 'data-more-text': attrs.moreText }),
            },
            moreLink: {
                default: '#',
                parseHTML: el => el.getAttribute('data-more-link') || '#',
                renderHTML: attrs => ({ 'data-more-link': attrs.moreLink }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'div[data-type="image-text-list"]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-text-list' })]
    },

    addCommands() {
        return {
            insertImageTextList:
                (attributes = {}) =>
                    ({ commands }: { commands: any }) => {
                        const defaultAttrs = {
                            title: '图文组合列表',
                            items: [
                                {
                                    id: '1',
                                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
                                    title: '标题一',
                                    description: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
                                },
                                {
                                    id: '2',
                                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
                                    title: '标题二',
                                    description: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
                                }
                            ],
                            moreText: '查看更多',
                            moreLink: '#'
                        }

                        return commands.insertContent({
                            type: 'imageTextList',
                            attrs: { ...defaultAttrs, ...attributes }
                        })
                    },
            setImageTextList: (attrs) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs,
                })
            },

            updateImageTextListItem: (itemId, data) => ({ tr, state }) => {
                const { selection } = state
                const { $from } = selection

                for (let i = $from.depth; i > 0; i--) {
                    const node = $from.node(i)
                    if (node.type.name === this.name) {
                        const pos = $from.start(i) - 1
                        const items = [...node.attrs.items]
                        const itemIndex = items.findIndex(item => item.id === itemId)

                        if (itemIndex !== -1) {
                            items[itemIndex] = { ...items[itemIndex], ...data }
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, items })
                            return true
                        }
                    }
                }
                return false
            },

            addImageTextListItem: (item) => ({ tr, state }) => {
                const { selection } = state
                const { $from } = selection

                for (let i = $from.depth; i > 0; i--) {
                    const node = $from.node(i)
                    if (node.type.name === this.name) {
                        const pos = $from.start(i) - 1
                        const items = [...node.attrs.items, item]
                        tr.setNodeMarkup(pos, undefined, { ...node.attrs, items })
                        return true
                    }
                }
                return false
            },

            removeImageTextListItem: (itemId) => ({ tr, state }) => {
                const { selection } = state
                const { $from } = selection

                for (let i = $from.depth; i > 0; i--) {
                    const node = $from.node(i)
                    if (node.type.name === this.name) {
                        const pos = $from.start(i) - 1
                        const items = node.attrs.items.filter((item: { id: string }) => item.id !== itemId)
                        tr.setNodeMarkup(pos, undefined, { ...node.attrs, items })
                        return true
                    }
                }
                return false
            },
        }
    },

    addNodeView() {
        return VueNodeViewRenderer(ImageTextListView)
    },
})

export default ImageTextListNode