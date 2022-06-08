<template>
  <div class="discovery-container" v-loading="loading">
    <!-- 轮播图 -->
    <el-carousel class="img" :interval="4000" type="card">
      <el-carousel-item v-for="(item,index) in banners" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item homo" v-for="(item,index) in result" :key="index" @click="gomusiclist(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="(item,index) in songs" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play" @click="add(item)"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.copywriter}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item,index) in mvs" :key="index" @click="tomv(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//导入axios
import axios from 'axios'
export default {
  name: 'discovery',
  data(){
    return{
      //轮播图数据
      banners:[],
      //推荐歌单数据
      result:[],
      //最新音乐数据
      songs:[],
      //mv数据
      mvs:[],
      loading:true
    }
  },
  created(){
    //轮播图接口
    axios({
      url:'http://localhost:3000/banner',
      method:'get',
      params:{},
    }).then(res=>{
      this.banners = res.data.banners
    }),
    //推荐歌单接口
    axios({
      url:'http://localhost:3000/personalized',
      method:'get',
      params:{
        limit:15
      },
    }).then(res=>{
      this.result = res.data.result
    }),
    //最新音乐接口
    axios({
      url:'http://localhost:3000/personalized/newsong',
      method:'get',
      params:{},
    }).then(res=>{
      this.songs = res.data.result
    }),
    //mv接口
    axios({
      url:'http://localhost:3000/personalized/mv',
      method:'get',
      params:{}
    }).then(res=>{
      this.mvs = res.data.result
    })
  },
  methods:{
    //将获取到的数据更新到列表
    add(item){
      axios({
      url:'http://localhost:3000/song/url',
      method:'get',
      params:{
        id:item.id
      }
    }).then(res=>{
      let song = {}
      song.name=item.name
      song.url=res.data.data[0].url
      song.cover=item.picUrl
      song.md5 = res.data.data[0].md5
      if(item.copywriter != null){
        song.artist = item.copywriter
      }else{
        song.artist = ''
      }
      song.id = String(item.id)
      this.$parent.upadtelist(song)
      //console.log(res)
    })
    },
    gomusiclist(id){
      this.$router.push('/playlist?id='+id)
    },
    tomv(id){
      this.$router.push('/mv?id='+id)
    }
  },
  updated(){
    this.loading = false
  }
};
</script>

<style lang="less" scoped>
.homo:hover{
  cursor:pointer
}
/deep/ .img {
    z-index: 0;
}
</style>
