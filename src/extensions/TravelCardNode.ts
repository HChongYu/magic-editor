import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TravelCardView from '../components/TravelCardView.vue'

// 旅游卡片节点属性类型定义
interface TravelCardAttributes {
  imageUrl: string
  title: string
  subtitle: string
  price: string
  unit: string
  linkText: string
  backgroundColor: string
  borderColor: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    travelCard: {
      insertTravelCard: (attributes?: Partial<TravelCardAttributes>) => ReturnType
      updateTravelCard: (attributes: Partial<TravelCardAttributes>) => ReturnType
      setTravelCardImage: (imageUrl: string) => ReturnType
    }
  }
}

export const TravelCardNode = Node.create({
  name: 'travelCardNode',
  
  group: 'block',
  
  isolating: true,
  
  defining: true,
  
  draggable: true,
  
  selectable: true,

  addAttributes() {
    return {
      imageUrl: {
        default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => ({
          'data-image-url': attributes.imageUrl,
        }),
      },
      title: {
        default: '阿勒泰8日游',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => ({
          'data-title': attributes.title,
        }),
      },
      subtitle: {
        default: '一价全包0自费 0景交0保底',
        parseHTML: element => element.getAttribute('data-subtitle'),
        renderHTML: attributes => ({
          'data-subtitle': attributes.subtitle,
        }),
      },
      price: {
        default: '18888',
        parseHTML: element => element.getAttribute('data-price'),
        renderHTML: attributes => ({
          'data-price': attributes.price,
        }),
      },
      unit: {
        default: '元/人',
        parseHTML: element => element.getAttribute('data-unit'),
        renderHTML: attributes => ({
          'data-unit': attributes.unit,
        }),
      },
      linkText: {
        default: '点击查看',
        parseHTML: element => element.getAttribute('data-link-text'),
        renderHTML: attributes => ({
          'data-link-text': attributes.linkText,
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
        default: '#2196f3',
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
        tag: 'div[data-type="travel-card"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'travel-card',
        class: 'travel-card-node',
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TravelCardView)
  },

  addCommands() {
    return {
      insertTravelCard:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
      updateTravelCard:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes)
        },
      setTravelCardImage:
        (imageUrl) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { imageUrl })
        },
    }
  },
})

export default TravelCardNode