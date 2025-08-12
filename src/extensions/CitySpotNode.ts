import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CitySpotView from '@/components/CitySpotView.vue'

// 城市景点卡片节点属性类型定义
interface CitySpotAttributes {
  imageUrl: string
  title: string
  description: string
  qrCode?: string
  backgroundColor: string
  borderColor: string
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    citySpot: {
      insertCitySpot: (attributes?: Partial<CitySpotAttributes>) => ReturnType
      updateCitySpot: (attributes: Partial<CitySpotAttributes>) => ReturnType
      setCitySpotImage: (imageUrl: string) => ReturnType
    }
  }
}

export const CitySpotNode = Node.create({
  name: 'citySpotNode',
  
  group: 'block',
  
  isolating: true,
  
  defining: true,
  
  draggable: true,
  
  selectable: true,

  addAttributes() {
    return {
      imageUrl: {
        default: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => ({
          'data-image-url': attributes.imageUrl,
        }),
      },
      title: {
        default: '涉谷十字路口',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => ({
          'data-title': attributes.title,
        }),
      },
      description: {
        default: '将行程安排、景色照片、出行保险、路线特色等内容做成二维码',
        parseHTML: element => element.getAttribute('data-description'),
        renderHTML: attributes => ({
          'data-description': attributes.description,
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="city-spot"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'city-spot' }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(CitySpotView as any)
  },

  addCommands() {
    return {
      insertCitySpot:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
      updateCitySpot:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes)
        },
      setCitySpotImage:
        (imageUrl) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { imageUrl })
        },
    }
  },
})

export default CitySpotNode