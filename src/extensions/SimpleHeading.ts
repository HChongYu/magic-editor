import { Node } from '@tiptap/core'

export const SimpleHeading = Node.create({
  name: 'simpleHeading',
  
  group: 'block',
  
  content: 'text*',
  
  defining: true,
  
  addAttributes() {
    return {
      level: {
        default: 2,
        parseHTML: element => {
          const level = element.tagName.match(/^H([1-6])$/)
          return level ? parseInt(level[1]) : 2
        },
        renderHTML: attributes => ({}),
      },
    }
  },
  
  parseHTML() {
    return [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const level = node.attrs.level || 2
    return [`h${level}`, { class: 'simple-heading' }, 0]
  },
})