import { Node } from '@tiptap/core'

// 富文本卡片标题节点
export const RichCardTitleNode = Node.create({
  name: 'richCardTitle',
  content: 'text*',
  group: 'block',
  defining: true,
  
  parseHTML() {
    return [{ tag: 'h3.rich-card-title' }]
  },
  
  renderHTML() {
    return ['h3', { class: 'rich-card-title' }, 0]
  },
})

// 富文本卡片副标题节点
export const RichCardSubtitleNode = Node.create({
  name: 'richCardSubtitle',
  content: 'text*',
  group: 'block',
  defining: true,
  
  parseHTML() {
    return [{ tag: 'p.rich-card-subtitle' }]
  },
  
  renderHTML() {
    return ['p', { class: 'rich-card-subtitle' }, 0]
  },
})

// 富文本卡片价格节点
export const RichCardPriceNode = Node.create({
  name: 'richCardPrice',
  content: 'text*',
  group: 'richCardContent',
  defining: true,
  
  parseHTML() {
    return [{ tag: 'span.rich-card-price' }]
  },
  
  renderHTML() {
    return ['span', { class: 'rich-card-price' }, 0]
  },
})

// 富文本卡片单位节点
export const RichCardUnitNode = Node.create({
  name: 'richCardUnit',
  content: 'text*',
  group: 'richCardContent',
  defining: true,
  
  parseHTML() {
    return [{ tag: 'span.rich-card-unit' }]
  },
  
  renderHTML() {
    return ['span', { class: 'rich-card-unit' }, 0]
  },
})

// 富文本卡片链接节点
export const RichCardLinkNode = Node.create({
  name: 'richCardLink',
  content: 'inline*',
  group: 'richCardContent',
  defining: true,
  
  parseHTML() {
    return [{ tag: 'span.rich-card-link' }]
  },
  
  renderHTML() {
    return ['span', { class: 'rich-card-link' }, 0]
  },
})