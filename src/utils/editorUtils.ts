export function getCursorPosition(editor: import('@tiptap/core').Editor) {
    const { selection } = editor.state
    return {
        from: selection.from,        // 选择起始位置
        to: selection.to,            // 选择结束位置
        empty: selection.empty,      // 是否为空选择（纯光标位置）
        anchor: selection.anchor,    // 锚点位置
        head: selection.head         // 头部位置
    }
}