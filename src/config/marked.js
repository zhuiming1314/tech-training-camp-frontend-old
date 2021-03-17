import marked from 'marked'
var highlight = require('highlight.js')
const renderer = new marked.Renderer()

export default marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  }
})
