<template>
  <div class="playlists-container">
    <!-- 顶部精品歌单 -->
    <div class="top-card">
      <div class="icon-wrap" style="cursor: pointer;">
        <img style="cursor: pointer" :src="toplist[0].coverImgUrl" alt="" @click="gomusiclist(toplist[0].id)"/>
      </div>
      <div class="content-wrap">
        <div class="tag" @click="gomusiclist(toplist[0].id)">精品歌单</div>
        <div class="title">
          {{toplist[0].name}}
        </div>
        <div class="info">
          {{toplist[0].description}}
        </div>
      </div>
      <img :src="toplist[0].coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span class="item" :class="{active:change=='全部'}" @click="change='全部'">全部</span>
        <span class="item" :class="{active:change=='欧美'}" @click="change='欧美'">欧美</span>
        <span class="item" :class="{active:change=='华语'}" @click="change='华语'">华语</span>
        <span class="item" :class="{active:change=='流行'}" @click="change='流行'">流行</span>
        <span class="item" :class="{active:change=='说唱'}" @click="change='说唱'">说唱</span>
        <span class="item" :class="{active:change=='摇滚'}" @click="change='摇滚'">摇滚</span>
        <span class="item" :class="{active:change=='民谣'}" @click="change='民谣'">民谣</span>
        <span class="item" :class="{active:change=='电子'}" @click="change='电子'">电子</span>
        <span class="item" :class="{active:change=='轻音乐'}" @click="change='轻音乐'">轻音乐</span>
        <span class="item" :class="{active:change=='影视原声'}" @click="change='影视原声'">影视原声</span>
        <span class="item" :class="{active:change=='ACG'}" @click="change='ACG'">ACG</span>
        <span class="item" :class="{active:change=='怀旧'}" @click="change='怀旧'">怀旧</span>
        <span class="item" :class="{active:change=='治愈'}" @click="change='治愈'">治愈</span>
        <span class="item" :class="{active:change=='旅行'}" @click="change='旅行'">旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item,index) in songlist" :key="index" @click="gomusiclist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.description}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 
    total 总条数
    current-page 当前页
    page-size 每页多少条数据
    current-change 页码改变事件
    -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
//导入axios
import axios from 'axios'
export default {
  name: 'recommend',
  data() {
    return {
      // 总条数
      total:0,
      // 页码
      page:1,
      //精品歌单数据
      toplist:[],
      //歌单列表tab栏选择数据
      change:'全部',
      //歌单列表数据
      songlist:[]
    };
  },
  methods: {
    //页面切换
    handleCurrentChange(val) {
      //val保存当前页
      this.page = val
      this.songdata()
    },
    topdata(){
    //顶部精品歌单
    axios({
      url:'http://localhost:3000/top/playlist/highquality',
      method:'get',
      params:{
        //歌单数量
        limit:1,
        //歌单分类,可选值：全部，欧美，华语，流行，说唱，摇滚，民谣，电子，轻音乐，影视原声，ACG，怀旧，治愈，旅行
        cat:this.change
      }
    }).then(res=>{
      this.toplist = res.data.playlists
      //console.log(res)
    })
    },
    songdata(){
    //歌单列表
    axios({
      url:'http://localhost:3000/top/playlist/',
      method:'get',
      //可选项：1. `limit`:获取的个数；2.offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*20, 其中 20 为 limit 的值；3.cat:歌单的标签, 可选值如下：全部，欧美，华语，流行，说唱，摇滚，民谣，电子，轻音乐，影视原声，ACG，怀旧，治愈，旅行
      params:{
        limit:10,
        offset:(this.page-1)*10,
        cat:this.change
      }
    }).then(res=>{
        this.total = res.data.total
        this.songlist = res.data.playlists
        for(let i=0;i<this.songlist.length;i++){
        if(this.songlist[i].playCount>10000){
        this.songlist[i].playCount = parseInt(this.songlist[i].playCount/10000)+'W'
      }
      }
    })
    },
    gomusiclist(id){
      this.$router.push('/playlist?id='+id)
    }
  },
  created(){
    this.topdata()
    this.songdata()
  },
  watch:{
    //监听tab栏change的变化，用监听到的change值作为请求参数再次发送请求
    change(){
    this.topdata()
    this.songdata()
    //当分类改变时将页码改为1，从第一页开始加载
    this.page = 1
    }
  }
};
</script>

<style scoped>
</style>
