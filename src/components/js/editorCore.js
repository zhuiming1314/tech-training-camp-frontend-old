// 引入全局实例
import _CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/markdown/markdown.js'
import marked from '../../config/marked'

const CodeMirror = window.CodeMirror || _CodeMirror

export default{
	name:'markdown-editor',
	components:{
			marked
	},
	data(){
			return{
					editor:null, //editor instance
			}
	},
	mounted(){
			this.createEditor();
			window.undo = this.undo;
			window.redo = this.redo;
			window.clear = this.clear;
			window.bold = this.bold;
			window.italic = this.italic;
			window.middleline = this.middleline;
			window.h1 = this.h1;
			window.h2 = this.h2;
			window.h3 = this.h3;
			window.ul = this.ul;
			window.ol = this.ol;
			window.img = this.img;
			window.ref = this.ref;
			window.code = this.code;
			window.link = this.link;
			window.table = this.table;
			window.save = this.save;
			window.setEditorValue = this.setEditorValue;
			
	},
	methods:{
			createEditor(){
					this.editor = CodeMirror.fromTextArea(this.$refs.textarea,{
							value:"请在此开始编写您的markdown文件...",
							showCursorWhenSelecting:true,
							theme:'monokai',
							mode:'markdown',
							autofocus:true,
							smartIndent:true,
							lineNumbers:true,
							matchBrackets:true,
							styleActiveLine:true,
							cursorHeight:1.2
					});
					this.editor.setValue('')
					this.addEditorListener();
					this.$emit('on-ready',{
							vm: this,
							insertContent: this.insertContent
					})
			},
			addEditorListener(){
					this.editor.on('change', data=>{
							this.insertContent(this.editor.getValue());
					});
					
					this.editor.on('keydown', (data, e)=>{
							if(e.keyCode==13){//回车换行
									this.editor.replaceSelection("  ");
							}
					});
			},
			insertContent(str){
					document.getElementById("result").innerHTML = marked(str);
			},
			//toolbar method
			undo(){
					this.editor.undo();
			},
			redo(){
					this.editor.redo();
					setTimeout(()=>{
							this.editor.refresh();
					}, 20);
			},
			clear(){
					this.editor.setValue("");
			},
			bold(){
					this.setup("__", "__", 2, false);
			},
			italic(){
					this.setup("*","*", 1, false);
			},
			middleline(){
					this.setup("~~","~~", 2, false);
			},
			h1(){
					this.setup("# ", "", 2, true);
			},
			h2(){
					this.setup("## ", "", 3, true);
			},
			h3(){
					this.setup("### ","", 4, true);
			},
			ul(){
					this.setup("* ","", 2, true);
			},
			ol(){
					this.setup("1. ", "", 3, true);
			},
			img(){
					this.setup("![alt text]","(img url)", 2, false);
			},
			ref(){
					this.setup("> ", "\n", 2, true);
			},
			code(){
					this.setup("```\n","\n```\n", 3, true);
			},
			link(){
					this.setup("[linkname]", "(linkurl)", 1, false)
			},
			table(){
					//console.log('this should insert table');
					this.setup('|  header   |  header  |\n|  ----  | ----  |\n| cell  | cell |\n| cell  | cell |', "", 1, true);
			},
			save(){
					return this.editor.getValue();
			},
			setEditorValue(file){
					this.editor.setValue(file);
			},
			setup(gram1, gram2, len, flag){
					const selection = this.editor.getSelection();
					if(selection){
							if(flag){//换行
									this.editor.replaceSelection("\n"+gram1+selection+gram2);
							}else{
									this.editor.replaceSelection(gram1+selection+gram2);
							}
					}else{
							const {line = 0, ch = 0} = this.editor.getCursor();
							if(flag){//换行
									this.editor.replaceSelection("\n"+gram1+gram2);
									this.editor.setCursor(line+1, len);
							}else{
									this.editor.replaceSelection(gram1+gram2);
									this.editor.setCursor(line, ch+len);
							}
							this.editor.focus();
					}

			}
	}
}
