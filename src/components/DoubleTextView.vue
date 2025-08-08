<template>
  <node-view-wrapper 
    class="double-text-node-view" 
    @mouseover="showToolbar = true" 
    @mouseleave="showToolbar = false"
    :style="{
      '--top-color': node.attrs.topColor,
      '--bottom-color': node.attrs.bottomColor,
      '--top-font-size': node.attrs.topFontSize,
      '--bottom-font-size': node.attrs.bottomFontSize,
      '--top-font-weight': node.attrs.topFontWeight,
      '--bottom-font-weight': node.attrs.bottomFontWeight,
      '--top-font-style': node.attrs.topFontStyle,
      '--bottom-font-style': node.attrs.bottomFontStyle,
      '--top-text-decoration': node.attrs.topTextDecoration,
      '--bottom-text-decoration': node.attrs.bottomTextDecoration
    }"
  >

    <node-view-content class="content-wrapper" />
    <div v-if="showToolbar" class="toolbar-wrapper">
      <settings-panel :node="node" :update-attributes="updateAttributes" :editor="editor" :get-pos="getPos" />
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/core'
import SettingsPanel from './SettingsPanel.vue'

export default defineComponent<NodeViewProps>({
  name: 'DoubleTextView',
  components: {
    NodeViewWrapper,
    NodeViewContent,
    SettingsPanel,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    updateAttributes: {
      type: Function,
      required: true,
    },
    editor: {
      type: Object,
      required: true,
    },
    getPos: {
      type: Function,
      required: true,
    },
    deleteNode: {
      type: Function,
      required: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  } as any,
  data() {
    return {
      showToolbar: false,
    }
  },
  methods: {

    

     

  },
})
</script>

<style scoped>
.double-text-node-view {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  background: linear-gradient(135deg, var(--top-color, #e3f2fd) 0%, var(--bottom-color, #f3e5f5) 100%);
  transition: all 0.15s ease;
  cursor: pointer;
}

.double-text-node-view:hover {
  border-color: #2196f3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
  transform: translateY(-1px);
}

.content-wrapper {
  min-height: 40px;
  outline: none;
  padding: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
}

.content-wrapper:focus {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.content-wrapper :deep(p[data-type="text-block"]:first-child) {
  color: var(--top-color, #333);
  font-size: var(--top-font-size, 16px);
  font-weight: var(--top-font-weight, normal);
  font-style: var(--top-font-style, normal);
  text-decoration: var(--top-text-decoration, none);
}

.content-wrapper :deep(p[data-type="text-block"]:last-child) {
  color: var(--bottom-color, #666);
  font-size: var(--bottom-font-size, 14px);
  font-weight: var(--bottom-font-weight, normal);
  font-style: var(--bottom-font-style, normal);
  text-decoration: var(--bottom-text-decoration, none);
}

.toolbar-wrapper {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: 1px solid #ddd;
  padding: 5px;
  display: flex;
  gap: 5px;
  z-index: 10;
}


</style>