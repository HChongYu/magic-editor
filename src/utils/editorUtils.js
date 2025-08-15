
/**
 * 判断选中节点是否是当前节点
 * @param {Object} selectNode - 选择位置的ResolvedPos对象（通常是editor.state.selection.$from）
 * @param {Object} curNode - 当前节点对象
 * @param {Function} getPos - 获取当前节点位置的函数
 * @returns {boolean} 是否是当前节点
 */
export function compareNodes(selectNode, curNode, getPos) {
    if (!selectNode || !curNode || !getPos) return false;

    // 获取当前节点的位置
    const currentNodePos = getPos();
    const nodeSize = curNode.nodeSize;
    
    // 检查选择是否在当前节点范围内（包括子节点）
    const nodeFrom = currentNodePos;
    const nodeTo = currentNodePos + nodeSize;
    const selectionPos = selectNode.pos;
    
    // 如果选择位置在节点范围内，则认为节点被选中
    if (selectionPos >= nodeFrom && selectionPos < nodeTo) {
        return true;
    }
    
    // 原有的逻辑：遍历从光标位置向上的所有节点层级
    for (let depth = selectNode.depth; depth > 0; depth--) {
        const pos = selectNode.start(depth) - 1; // 获取该层级节点的起始位置

        // 通过位置比较判断是否是同一个节点
        if (pos === currentNodePos) {
            return true;
        }
    }
    return false;
}

export function addCurrentNode(editor, node, getPos) {
    // 获取当前节点的位置
    const pos = getPos()
    console.log(pos)
    // 复制当前节点并在其后插入
    const nodeJSON = node.toJSON()
    console.log(pos, nodeJSON)
    // return
    editor.chain().focus().insertContentAt(pos + node.nodeSize, nodeJSON).run()
}

export function moveNodeDown(editor, node, getPos) {
    try {
        // 获取当前节点的位置
        const pos = getPos();
        const { doc } = editor.state;
        
        // 基本验证
        if (pos < 0 || pos >= doc.content.size) {
            console.log("无效的节点位置");
            return;
        }
        
        // 解析位置
        const $pos = doc.resolve(pos);
        const parent = $pos.parent;
        const index = $pos.index($pos.depth);
        
        // 检查是否是最后一个节点
        if (index >= parent.childCount - 1) {
            console.log("已经是最后一个节点，无法向下移动");
            return;
        }
        
        // 获取下一个节点
        const nextNode = parent.child(index + 1);
        const nextNodePos = pos + node.nodeSize;
        
        // 创建节点的JSON表示
        const currentNodeJSON = node.toJSON();
        const nextNodeJSON = nextNode.toJSON();
        
        // 使用insertContent方法，这是一个更高级别的API，可能更可靠
        editor.chain()
            .focus()
            // 先删除两个节点
            .command(({ tr }) => {
                tr.delete(nextNodePos, nextNodePos + nextNode.nodeSize);
                tr.delete(pos, pos + node.nodeSize);
                return true;
            })
            // 然后按照新的顺序插入它们
            .insertContentAt(pos, nextNodeJSON)
            .insertContentAt(pos + nextNode.nodeSize, currentNodeJSON)
            .run();
    } catch (error) {
        console.error("移动节点时发生错误:", error);
        console.log("错误详情:", error.message);
    }
}