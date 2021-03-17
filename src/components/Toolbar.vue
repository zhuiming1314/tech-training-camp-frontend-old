<template>
    <div id="toolbar">
        <el-tooltip class="item" effect="dark" :content="hoverContent" placement="bottom-end">
            <el-avatar id="user" @click.native="showLoginDialog">{{userName}}</el-avatar>
        </el-tooltip>
        <el-dropdown @command="t_fileSelect" :class="logined?'show':'notshow'">
            <span class="el-dropdown-link" id="test">
                {{fileName?fileName:'FileList'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item v-for="(item, index) in fileList" :key="index" :command="index">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <ul>
            <el-tooltip v-for="(item, index) in tool_noicon" :key="item.name+index" class="item" effect="dark" :content="item.msg" placement="bottom-end">
                <li :name="item" @click="selectMeth(item.name)">{{item.name}}</li>
            </el-tooltip>
            <el-tooltip v-for="(item, index) in tool_icon" :key="item.name+index" class="item" effect="dark" :content="item.msg" placement="bottom-end">
                <li :name="item.name" @click="selectMeth(item.name)"><i :class="item.icon"></i></li>
            </el-tooltip>
        </ul>

        <el-dialog :visible.sync="dialogVisible" width="40%">
            <el-tabs v-model="activeName">
                <el-tab-pane label="登录" name="login">
                    <el-input class="info" v-model="uname" type="text" placeholder="请输入用户名"></el-input>
                    <el-input class="info" v-model="pwd" type="password" placeholder="请输入密码"></el-input>
                    <el-button class="btn" @click="submit">登录</el-button>
                </el-tab-pane>
                <el-tab-pane label="注册" name="register">
                    <el-input class="info" v-model="uname" type="text" placeholder="请输入用户名"></el-input>
                    <el-input class="info" v-model="pwd" type="password" placeholder="请输入密码"></el-input>
                    <el-input class="info" v-model="repwd" type="password" placeholder="请再次输入密码"></el-input>
                    <el-button class="btn" @click="regis">注册</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import client from './js/client'
export default client

</script>

<style>
#toolbar{
    width: 100%;
    height: 50px;
    /*border: 1px solid #0f0;*/
    padding: 0 30px;
    background: #000;
    color: #fff;
}
#toolbar ul{
    list-style: none;
    display: inline-block;
}
#toolbar ul li{
    float: left;
    margin-left:2em ;
}
.el-dialog__body{
    text-align: center;
}
.el-tabs__nav.is-top{
    margin: 0 auto;
}
.info{
    display: block;
    margin: 5px auto;
    width: 60%;
}
.btn{
    margin-top:5px ;
}
.el-avatar{
    margin-bottom: 8px;
    background: #409EFF;
    color: #fff;
}
.el-tabs__nav{
    float:none;
}
.el-tabs__active-bar{
    left: 40%;
}
.el-dropdown{
    left: 5px;
    bottom: 20px;
    color: #fff;
}
.notshow{
    display: none;
}
.tool:hover{
    background: lightcoral;
}
.el-tooltip.item:focus{
    outline: none;
}

</style>
