export default {
  data(){
    return {
      tool_noicon:[
        {name:'B', msg:'加粗'}, 
        {name:'I', msg:'斜体'}, 
        {name:'--', msg:'中划线'},
        {name:'H1', msg:'一级标题'},
        {name:'H2', msg:'二级标题'}, 
        {name:'H3', msg:'三级标题'}
      ],
      tool_icon:[
        {name:'ul', icon:'el-icon-notebook-1', msg:'无序列表'},
        {name:'ol', icon:'el-icon-notebook-2', msg:'有序列表'},
        {name:'img', icon:'el-icon-picture-outline', msg:'图片'},
        {name:'ref', icon:'el-icon-paperclip', msg:'引用'}, 
        {name:'code', icon:'el-icon-chat-square', msg:'代码块'},
        {name:'link', icon:'el-icon-link', msg:'链接'},
        {name:'table', icon:'el-icon-s-grid', msg:'表格'},
        {name:'undo', icon:'el-icon-back', msg:'撤销'},
        {name:'redo', icon:'el-icon-right', msg:'重做'},
        {name:'clear', icon:'el-icon-circle-close', msg:'清空'},
        {name:'creat', icon:'el-icon-document-add', msg:'新建文档'},
        {name:'delete', icon:'el-icon-document-delete', msg:'删除当前文档'},
        {name:'save', icon:'el-icon-document-checked', msg:'保存'},
      ],
      userName: this.$store.getters.getToken ? this.$store.getters.getToken : 'M',
      hoverContent: this.userName=='M' ? "点击登录" : "点击登出",
      activeName: 'login',
      dialogVisible: false,
      uname: '',
      pwd: '',
      repwd: '',
      fileName: '',
      fileList: this.$store.getters.getFile ? this.$store.getters.getFile.split(",") : [],
      logined: this.$store.getters.getToken ? true: false
    }
  },
  components:{
  },
  methods:{
    showLoginDialog () {
      if (this.logined) {
        this.$confirm('确认退出登录？').then( _ => {
          this.t_logout()
        }).catch( _ => {})
      }else{
        this.dialogVisible=true
      }
    },
    selectMeth(item){
      switch(item){
          case "save":
            this.t_save();
            break;
          case "undo":
            undo();
            break;
          case "redo":
            redo();
            break;
          case "clear":
            clear();
            break;
          case "B":
            bold();
            break;
          case '--':
            middleline();
            break;
          case 'I':
            italic();
            break;
          case 'H1':
            h1();
            break;
          case 'H2':
            h2();
            break;
          case 'H3':
            h3();
            break;
          case 'ul':
            ul();
            break;
          case 'ol':
            ol();
            break;
          case 'img':
            img();
            break;
          case 'ref':
            ref();
            break;
          case 'code':
            code();
            break;
          case 'link':
            link();
            break;
          case 'table':
            table();
            break;
          case 'creat':
            this.fileName="new file"
            clear();
            break;
          case 'delete':
            this.$confirm('确认删除当前文件？').then(_ => {
              this.t_deleteMd();
            }).catch(_ => {});
            break;
      }
    },
    submit(){
      this.$http({
        method:'post',
        url:"http://127.0.0.1:8081/process_login",
        params:{
          username:this.uname.trim(),
          password:this.pwd.trim()
        }
      }).then((res)=>{
        if(res.data.code==0){
          this.$store.commit('setToken',res.data.message);
          var file_str='';
          var len = 0;
          if(res.data.file){
            len = res.data.file.length;
          }
          for(var i=0; i<len; i++){
            file_str+=res.data.file[i].filename;
            if(i!=len-1) file_str+=',';
          }
          this.$store.commit('setFile', file_str);
          this.$message({
            message:"登录成功",
            type:'success',
            offset:200
          });
          this.$router.go(0);
        }else{
          alert(res.data.message);
        }  
      });
      this.dialogVisible=false;
    },
    regis(){
      this.$http({
        method:'post',
        url:"http://127.0.0.1:8081/process_register",
        params:{
            username:this.uname.trim(),
            password:this.pwd.trim(),
            repassword:this.repwd.trim()
        }
      }).then(function(res){
        if(res.data.code==0){
          this.$message({
            message:"注册成功",
            type:'success',
            offset:200
          });
        }else{
          alert(res.data.message);
        }
      })
    },
    t_logout(){
      sessionStorage.clear();
      this.$router.go(0);
    },
    t_save(){
      if(this.userName=='M'){
        alert('您尚未登录');
        return;
      }
      if(this.fileName!="new file" &&this.fileName){
        this.t_uploadMd("update");
      }else{
        this.$prompt('请输入文件名', '保存markdown文件到云端',{
          confirmButtonText:'确定',
          cacelButtonText:'取消',
          inputPattern:/^(.)+$/,
          inputErrorMessage:'文件名不能为空'
        }).then(value=>{
          this.$message({
              type:'success',
              message:'保存为：'+value.value+'.md'
          });
          this.fileName = value.value;
          this.t_uploadMd("insert");
        }).catch(err=>{
          this.$message({
            type:'info',
            message:'取消输入'
          })
        });
      }
    },
    t_uploadMd(_operation){
      var file = save();
      this.$http({
        method:'post',
        url:"http://127.0.0.1:8081/process_upload",
        params:{
            username:this.userName,
            filename:this.fileName,
            filecontent:file,
            operation:_operation
        }
      }).then(res=>{
        console.log(res);
        if(res.data.code==0){
          this.$message({
              message:"保存成功",
              type:'success',
              offset:200
          });
          if(_operation=="insert"){
              this.$store.commit("setFile",this.$store.getters.getFile+","+res.data.message);
              this.$router.go(0);
          }
          }else{
            alert(res.data.message);
          }
      })
    },
    t_fileSelect(command){
      console.log('-----',this.fileList);
      if(!this.fileList){
        alert("您尚未创建任何文件");
        return;
      }
      this.fileName=this.fileList[command];
      this.$http({
        method:'post',
        url:"http://127.0.0.1:8081/process_download",
        params:{
            username:this.userName,
            fileindex:command
        }
      }).then(res=>{
        if(res.data.code==0){
          this.$message({
            message:"读取成功",
            type:'success',
            offset:200
          });
          setEditorValue(res.data.message);          
        }else{
          alert(res.data.message);
        }
      })
    },
    t_deleteMd(){
      this.$http({
        method:'post',
        url:"http://127.0.0.1:8081/process_delete",
        params:{
            username:this.userName,
            filename:this.fileName
        }
      }).then( (res) => {
        if (res.data.code == 0) {
          var file_str = ''
          var arrTemp = this.fileList.filter(function (item) {
            return item !== res.data.message
          })
          var len = arrTemp.length
          for (var i = 0; i < len; i++) {
            file_str += arrTemp[i]
            if (i !== len - 1) file_str += ','
          }
          this.$store.commit('setFile', file_str)
          this.$message({
            message: '删除成功',
            type: 'success',
            offset: 200
          })
          this.$router.go(0)
        } else {
          alert(res.data.message)
        }
      })
    }
  }
}
