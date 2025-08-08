import { Node } from '@tiptap/core'
import type { KeyboardShortcutCommand } from '@tiptap/core'

export const TextBlockNode = Node.create({
  name: 'textBlock',
  group: 'block',
  content: 'inline*',
  marks: '', // 禁止任何标记，确保纯文本

  parseHTML() {
    return [{ tag: 'p[data-type="text-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', { ...HTMLAttributes, 'data-type': 'text-block' }, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // 检查光标是否在 doubleTextNode 内的 textBlock 中
        if ($from.depth >= 2) {
          const parentNode = $from.node(1); // 获取 textBlock 的父节点
          if (parentNode.type.name === 'doubleTextNode') {
            // 如果是，则将光标移动到 doubleTextNode 的末尾
            const endPos = $from.before(1) + parentNode.nodeSize;
            return this.editor.chain().focus().setTextSelection(endPos).run();
          }
        }

        // 否则，执行默认的 Enter 行为
        return false;
      },
    };
  },
})

export default TextBlockNode