<template>
    <div id="editor">
        <textarea ref="textarea"></textarea>
    </div>
</template>
<script>
import markdown from './js/editorCore'
export default markdown
</script>
<style>
#editor{
    background: #000;
    /*border: 1px solid red;*/
}
#editor .CodeMirror{
    height: auto;
    background: #000;
    color: #fff;
    text-align: left;
}
</style>
