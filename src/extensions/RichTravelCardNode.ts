import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RichTravelCardView from '../components/RichTravelCardView.vue'

// 富文本旅游卡片节点属性类型定义
interface RichTravelCardAttributes {
  imageUrl: string
  backgroundColor: string
  borderColor: string
  // 添加与 TravelCardNode 一致的默认属性
  title?: string
  subtitle?: string
  price?: string
  unit?: string
  linkText?: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    richTravelCard: {
      insertRichTravelCard: (attributes?: Partial<RichTravelCardAttributes>) => ReturnType
      updateRichTravelCard: (attributes: Partial<RichTravelCardAttributes>) => ReturnType
      setRichTravelCardImage: (imageUrl: string) => ReturnType
    }
  }
}

export const RichTravelCardNode = Node.create({
  name: 'richTravelCardNode',
  group: 'block',
  content: 'richCardTitle richCardSubtitle richCardPrice richCardUnit richCardLink',
  isolating: true,
  defining: true,
  draggable: true,
  selectable: true,  // 确保这个设置为 true
  addAttributes() {
    return {
      imageUrl: {
        default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => ({
          'data-image-url': attributes.imageUrl,
        }),
      },
      backgroundColor: {
        default: '#ffffff',
        parseHTML: element => element.getAttribute('data-bg-color'),
        renderHTML: attributes => ({
          'data-bg-color': attributes.backgroundColor,
        }),
      },
      borderColor: {
        default: '#e2e8f0',
        parseHTML: element => element.getAttribute('data-border-color'),
        renderHTML: attributes => ({
          'data-border-color': attributes.borderColor,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="rich-travel-card"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'rich-travel-card',
      }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(RichTravelCardView)
  },

  addCommands() {
    return {
      insertRichTravelCard:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              // 使用默认属性值
              title: '旅游目的地',
              subtitle: '探索美丽风景',
              price: '¥999',
              unit: '起/人',
              linkText: '立即预订',
              ...attributes
            },
            content: [
              {
                type: 'richCardTitle',
                content: [{ type: 'text', text: attributes.title || '旅游目的地' }]
              },
              {
                type: 'richCardSubtitle', 
                content: [{ type: 'text', text: attributes.subtitle || '探索美丽风景' }]
              },
              {
                type: 'richCardPrice',
                content: [{ type: 'text', text: attributes.price || '¥999' }]
              },
              {
                type: 'richCardUnit',
                content: [{ type: 'text', text: attributes.unit || '起/人' }]
              },
              {
                type: 'richCardLink',
                content: [{ type: 'text', text: attributes.linkText || '立即预订' }]
              }
            ]
          })
      },
      updateRichTravelCard:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes)
        },
      setRichTravelCardImage:
        (imageUrl) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { imageUrl })
        },
    }
  },
})

export default RichTravelCardNode