<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          autoplay
          :src="mvsrc"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="singersrc" alt="" />
          </div>
          <span class="name">{{mvmsg.artistName}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{mvmsg.name}}</h2>
          <span class="date">发布：{{mvmsg.publishTime}}</span>
          <span class="number">播放 {{this.mvmsg.playCount}} 次</span>
          <p class="desc">
            {{mvmsg.desc}}
          </p>
        </div>
      </div>

    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item,index) in alikeMv" :key="index" @click="tomv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount>10000?(parseInt(item.playCount/10000)+'W'):item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | time}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'mv',
  data() {
    return {
      id:this.$route.query.id,
      //mv视频地址
      mvsrc:'',
      //mvid
      mvid:0,
      //mv信息
      mvmsg:{},
      //歌手id
      singerid:0,
      //歌手图片
      singersrc:'',
      //相关mv信息
      alikeMv:[]
    };
  },
  methods:{
    //获取mv播放地址
    getmvsrc(){
      axios({
        url:'http://localhost:3000/mv/url',
        method:'get',
        params:{
          id:this.id
        }
      }).then(res=>{
        this.mvsrc = res.data.data.url
        this.mvid = res.data.data.id
        this.getmvmsg()
        this.getMvAlike()
      })
    },
    //获取mv信息
    getmvmsg(){
      axios({
        url:'http://localhost:3000/mv/detail',
        method:'get',
        params:{
          mvid:this.mvid
        }
      }).then(res=>{
        this.mvmsg = res.data.data
        if(this.mvmsg.playCount>10000){
          this.mvmsg.playCount = parseInt(this.mvmsg.playCount/10000)+'W'
        }
        this.getsinger()
      })
    },
    //获取歌手信息
    getsinger(){
      axios({
        url:'http://localhost:3000/artists',
        method:'get',
        params:{
          id:this.mvmsg.artists[0].id
        }
      }).then(res=>{
        this.singersrc = res.data.artist.picUrl
      })
    },
    //相关mv
    getMvAlike(){
      axios({
        url:'http://localhost:3000/simi/mv',
        method:'get',
        params:{
          mvid:this.mvid
        }
      }).then(res=>{
        this.alikeMv = res.data.mvs
        //console.log(res)
      })
    },
    tomv(id){
          this.$router.push('/mv?id='+id)
          this.$router.go(0)
    }
    },
  created(){
    this.getmvsrc()
    this.$parent.$refs.player.pause()
  },
};
</script>
<style scoped>
.num-wrap{
  background-color: rgba(0,0,0,.2);
  border-radius: 3px;
}
</style>
