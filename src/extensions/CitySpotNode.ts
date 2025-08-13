import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CitySpotView from '@/components/CitySpotView.vue'

// 城市景点卡片节点属性类型定义
interface CitySpotAttributes {
  imageUrl: string
  title: string
  description: string
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

const CitySpotNode = Node.create({
  name: 'citySpotNode',

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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'city-spot' }), 0]
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
              attrs: {
                imageUrl: attributes.imageUrl || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
              },
              content: [
                {
                  type: 'simpleHeading',
                  attrs: {
                    text: attributes.title || '城市景点',
                  },
                  content: [{
                    type: 'text',
                    text: attributes.title || '城市景点'
                  }]
                },
                {
                  type: 'simpleParagraph',
                  attrs: {
                    text: attributes.description || '城市描述',
                  },
                  content: [{
                    type: 'text',
                    text: attributes.description || '城市描述'
                  }]
                }
              ],
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