<template>
  <div class="loginMain">
    <div class="minlogin" @click.stop="none">
      <h4 class="logintitle">登录<span class="el-icon-close" @click="close" style="float:right;cursor: pointer;"></span></h4>
      <div class="loginformdiv" style="overflow:auto">
      <form class="loginform">
        <div class="loginemail">
          <label class="emaillabel">账号(邮箱)</label>
          <el-input placeholder="请输入邮箱" v-model="input" clearable></el-input>
        </div>
        <div class="loginpassword">
          <label class="emaillabel">密码</label>
          <el-input placeholder="请输入密码" v-model="password" show-password @keyup.enter="login"></el-input>
        </div>
        <div class="errdiv"><i class="el-icon-warning errmsg" v-if="err" style="color:red"></i><span v-if="err" class="errmsg" style="color:red">{{msg}}</span></div>        
        <span class="register" @click.stop="showregister">注册</span>
        <span class="loginbtn" @click.stop="login">登录</span>
      </form>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'login',
  data(){
    return{
      input:'',
      password:'',
      msg:'',
      err:false
    }
  },
  methods:{
    showregister(){
      let a = true
      this.$emit('showregister',a)
    },
    close(){
      let a = false
      this.$emit('closelogin',a)
    },
    login(){
      if(this.input.trim() !='' && this.password.trim() !=''){
        axios({
          url:'http://localhost:3001/login',
          method:'post',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          params:{
            email:this.input,
            password:this.password
          }
        }).then(res=>{
          console.log(1)
          if(res.data.msg == 'welcome'){
          console.log(2)
          let user = {}
          user.name = res.data.user.name
          user.id = res.data.user._id
          user.pic = res.data.user.pic
          user.bid = res.data.user.bid
          user.loveMusic = res.data.user.loveMusic
          user.musicListId = res.data.user.musicListId
          localStorage.setItem('login','true')
          localStorage.setItem('user',JSON.stringify(user))
          this.close()
          this.$router.go(0)
          this.$message({
          message: '登录成功',
          type: 'success'
        });
          }else{
            console.log(3)
            this.msg = res.data.msg
            this.err = true
          }
        })
      }else{
        console.log(4)
        this.msg = '请填写账号或密码！'
        this.err = true
      }
    },
    none(){
      this.err = false
    }
  }
}
</script>

<style lang="less" scoped>
.loginMain{
  position: fixed;
  background-color:rgba(0,0,0,0.2);
  width:100%;
  height: 100%;
  z-index:300;
}
.minlogin{
  position:absolute;
  top:18%;
  left:38%;
  background-color:rgb(233, 229, 229);
  height:50%;
  width:30%;
  border-radius: 10px;
}
.logintitle{
    color: #000;
    font-weight: bold;
    font-size: 22px;
    text-align: center;
    height:20%;
}
.loginformdiv{
  display: flex;
  border-top: 2px solid;
  box-sizing: border-box;
  padding: 20px;
  height:80%;
}
.loginform{
  width:100%
}
.loginemail{
  margin-bottom: 10px;
}
.emaillabel{
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
}
.loginbtn{
  display: inline-block;
    padding: 12px 12px;
    margin-top: 20px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #fff;
    background-color: #337ab7;
    border-color: #000000;
    float:right;
    width: 25%;
    height: 20%;
}
.register{
  display: inline-block;
    padding: 12px 12px;
    margin-top: 20px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #000;
    border-color: #000000;
    float: left;
    width: 25%;
    height: 20%;
    background-color: rgba(0,0,0,0.1)
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.1);
  background: #2db99d;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
</style>
