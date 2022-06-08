<template>
  <div class="registerdiv">
    <div class="minlogin" @click="none">
      <h4 class="logintitle">注册<span class="el-icon-close" @click="close"></span></h4>
      <div class="loginformdiv" style="overflow:auto">
      <form class="loginform">
        <div class="loginemail">
          <label class="emaillabel">邮箱</label>
          <el-input placeholder="请输入账号" v-model="input" clearable ></el-input>
        </div>
        <div class="namediv" style="margin-bottom:10px">
          <label class="emaillabel">名称</label>
          <el-input placeholder="请输入名字" v-model="name" clearable ></el-input>
        </div>
        <div class="loginpassword" style="margin-bottom:10px">
          <label class="emaillabel">密码</label>
          <el-input placeholder="请输入密码" v-model="password" show-password ></el-input>
        </div>
        <div class="scpassworddiv" style="margin-bottom:10px">
          <label class="emaillabel">再次输入密码</label>
          <el-input placeholder="请再次输入密码" v-model="scpassword" show-password  ></el-input>
        </div>
        <div class="errdiv"><i class="el-icon-warning errmsg" v-if="err" style="color:red"></i><span v-if="err" class="errmsg" style="color:red">{{msg}}</span></div>
        <span class="register" @click="showlogin">去登陆</span>
        <span  class="loginbtn" @click.stop="register">注册</span>
      </form>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'register',
  data(){
    return{
      input:'',
      password:'',
      name:'',
      scpassword:'',
      err:false,
      msg:'信息填写有误，请检查!'
    }
  },
  methods:{
    showlogin(){
      let a = true
      this.$emit('login',a)
    },
    close(){
      let a = false
      this.$emit('close',a)
    },
    register(){
      if(this.input.trim() !='' && this.name.trim() != '' && this.password.trim() !='' && this.scpassword.trim() != ''&& this.password == this.scpassword){
      axios({
        url:'http://localhost:3001/register',
        method:'post',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        params:{
          name:this.name,
          email:this.input,
          password:this.password
        }
      }).then(res=>{
        if(res.data.msg != true){
          this.err = true
          this.msg = res.data.msg
        }else{
          axios({
            url:'http://localhost:3001/login',
            method:'post',
            params:{
              email:res.data.newuser.email,
              password:res.data.newuser.password
            }
          }).then(res=>{
            if(res.data.msg == 'welcome'){
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
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              this.$router.go(0)
            }
          })
        }
      })
      }else{
        console.log('false')
        this.err=true
      }
    },
    none(){
        this.err = false
    },
  }
}
</script>

<style lang="less" scoped>
.registerdiv{
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
  height:72%;
  width:35%;
  border-radius: 10px;
}
.logintitle{
    color: #000;
    font-weight: bold;
    font-size: 22px;
    text-align: center;
    height:10%;
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
    height: 15%;
}
.register{
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
    color: #000;
    border-color: #000000;
    float: left;
    width: 25%;
    height: 15%;
    background-color: rgba(0,0,0,0.1);
}
.el-icon-close{
    float: right;
    cursor: pointer;
}
input.input{
  border-radius: 10px;
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
  background: #5eb92d;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
</style>
