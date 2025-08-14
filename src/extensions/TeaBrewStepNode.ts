import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TeaBrewStepView from '@/components/TeaBrewStepView.vue'

// 茶叶冲泡步骤节点属性类型定义
interface TeaBrewStepAttributes {
  steps: Array<{
    imageUrl: string
    text: string
  }>
}

// 声明命令类型
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    teaBrewStep: {
      insertTeaBrewStep: (attributes?: Partial<TeaBrewStepAttributes>) => ReturnType
      updateTeaBrewStep: (attributes: Partial<TeaBrewStepAttributes>) => ReturnType
    }
  }
}

const TeaBrewStepNode = Node.create({
  name: 'teaBrewStepNode',

  group: 'block',

  defining: true,

  draggable: false,

  selectable: true,

  addAttributes() {
    return {
      steps: {
        default: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '取适量茶叶'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '闷茶1～3分钟'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
            text: '倒入茶杯品茗'
          }
        ],
        parseHTML: element => {
          const stepsAttr = element.getAttribute('data-steps')
          return stepsAttr ? JSON.parse(stepsAttr) : []
        },
        renderHTML: attributes => ({
          'data-steps': JSON.stringify(attributes.steps),
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="tea-brew-step"]',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'tea-brew-step' }), 0]
  },
  
  addNodeView() {
    return VueNodeViewRenderer(TeaBrewStepView as any)
  },

  addCommands() {
    return {
      insertTeaBrewStep:
        (attributes = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                steps: attributes.steps || [
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '取适量茶叶'
                  },
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '闷茶1～3分钟'
                  },
                  {
                    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
                    text: '倒入茶杯品茗'
                  }
                ],
              },
            })
          },
      updateTeaBrewStep:
        (attributes) =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, attributes)
          },
    }
  },
})

export default TeaBrewStepNode