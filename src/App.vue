<template>
  <div id="app">
    <WorkSpace />
  </div>
</template>

<script>
import WorkSpace from './view/WorkSpace.vue'

export default {
  name: 'App',
  components: {
    WorkSpace
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 10px; 
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>
