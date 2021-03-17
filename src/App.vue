<template>
  <div id="app">
    <toolbar></toolbar>
    <editor class="body"></editor>
    <result class="body"></result>
  </div>
</template>

<script>
import Editor from './components/Editor.vue'
import Result from './components/Result.vue'
import Toolbar from './components/Toolbar.vue'

export default {
  name: 'App',
  components: {
    Editor,
    Result,
    Toolbar

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.body{
  width: 48%;
  float:left;
  height: 800px;
}
</style>
