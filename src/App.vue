<template>
  <div id="app">
    <login v-if="login" @showregister="showregister" @closelogin="close"/>
    <register v-if="register" @login="tologin" @close="close"/>
    <top @click="close()"  ref="top" @updata="updata" @showlogin="showlogin" @loginout="loginout"/>
    <index ref="index"  @closeSearch="closeSearch" />
  </div>
</template>

<script>
import top from './components/01.top.vue';
import index from './components/02.index.vue';
import login from '@/views/08.login'
import register from '@/views/09.register'
export default {
  name: 'app',
  components: {
    top,
    index,
    login,
    register,
  },
  data(){
    return {
      //控制登录显示
      login:false,
      //控制注册显示
      register:false,
    }
  },
  methods:{
    updata(val){
      this.$refs.index.upadtelist(val)
    },
    closeSearch(){
      this.$refs.top.none()
    },
    showlogin(val){
      this.login = val
    },
    showregister(val){
      this.login = false
      this.register = val
    },
    tologin(val){
      this.register = false
      this.login = val
    },
    close(val){
      this.register = val
      this.login = val
    },
    loginout(){
      this.$refs.index.login = false
      this.$refs.index.user = {}
    }
  }
};
</script>

<style >

</style>
