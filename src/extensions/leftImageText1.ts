import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SpotCardView from '@/components/SpotCardView.vue'

// 景点卡片节点属性类型定义
interface SpotCardAttributes {
  imageUrl: string
  title: string
  subtitle: string
  rating: number
  landmark: boolean
  checkin: boolean
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spotCard: {
      insertSpotCard: (attributes?: Partial<SpotCardAttributes>) => ReturnType
      updateSpotCard: (attributes: Partial<SpotCardAttributes>) => ReturnType
      setSpotCardImage: (imageUrl: string) => ReturnType
    }
  }
}

const SpotCardNode = Node.create({
  name: 'spotCardNode',

  group: 'block',

  defining: true,

  draggable: false,

  selectable: true,

  content: 'simpleHeading simpleParagraph',

  addAttributes() {
    return {
      imageUrl: {
        default: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => ({
          'data-image-url': attributes.imageUrl,
        }),
      },
      rating: {
        default: 4.5,
        parseHTML: element => parseFloat(element.getAttribute('data-rating') || '4.5'),
        renderHTML: attributes => ({
          'data-rating': attributes.rating,
        }),
      },
      landmark: {
        default: true,
        parseHTML: element => element.getAttribute('data-landmark') === 'true',
        renderHTML: attributes => ({
          'data-landmark': attributes.landmark,
        }),
      },
      checkin: {
        default: false,
        parseHTML: element => element.getAttribute('data-checkin') === 'true',
        renderHTML: attributes => ({
          'data-checkin': attributes.checkin,
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="spot-card"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'spot-card' }), 0]
  },
  
  addNodeView() {
    return VueNodeViewRenderer(SpotCardView as any)
  },

  addCommands() {
    return {
      insertSpotCard:
        (attributes = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                imageUrl: attributes.imageUrl || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                rating: attributes.rating || 4.5,
                landmark: attributes.landmark !== undefined ? attributes.landmark : true,
                checkin: attributes.checkin !== undefined ? attributes.checkin : false,
              },
              content: [
                {
                  type: 'simpleHeading',
                  attrs: {
                    text: attributes.title || '涉谷十字路口',
                    level: 2,
                  },
                  content: [{
                    type: 'text',
                    text: attributes.title || '涉谷十字路口'
                  }]
                },
                {
                  type: 'simpleParagraph',
                  attrs: {
                    text: attributes.subtitle || 'Fushimi inari-tatisha Shrine',
                  },
                  content: [{
                    type: 'text',
                    text: attributes.subtitle || 'Fushimi inari-tatisha Shrine'
                  }]
                }
              ],
            })
          },
      updateSpotCard:
        (attributes) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, attributes)
          },
      setSpotCardImage:
        (imageUrl) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, { imageUrl })
          },
    }
  },
})

export default SpotCardNode