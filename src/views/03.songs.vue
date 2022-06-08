<template>
  <div class="songs-container" v-loading="loading">
    <div class="tab-bar">
      <span class="item" :class="{active:tag==0}" @click="tag=0">全部</span>
      <span class="item" :class="{active:tag==7}" @click="tag=7">华语</span>
      <span class="item" :class="{active:tag==96}" @click="tag=96">欧美</span>
      <span class="item" :class="{active:tag==8}" @click="tag=8">日本</span>
      <span class="item right" :class="{active:tag==16}" @click="tag=16">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item,index) in songs" :key="index">
          <td>{{index+1}}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <span class="iconfont icon-play" @click="play(item)"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span v-if="showmv" class="iconfont icon-mv" @click="tomv(item.mvid)"></span>
              </div>
              <span>{{item.alias["0"] ? item.alias["0"]:''}}</span>
            </div>
          </td>
          <td>{{item.album.artists.length>1?(item.album.artists.length>2?`${item.album.artists[0].name} / ${item.album.artists[1].name} /..`:`${item.album.artists[0].name} / ${item.album.artists[1].name}`):item.album.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration | time}}</td>
        </tr>
      </tbody>
    </table>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10"
      id="page"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'songs',
  data() {
    return {
      //请求回来的歌曲数据
      songs:[],
      //设置分类
      tag:0,
      //当前页码
      page:1,
      //总数据数量
      total:0,
      showmv:true,
      loading:true
    };
  },
  created(){
    this.song()
  },
  watch:{
    //监听分类改变
    tag(){
      this.song()
      this.page=1
    },
  },
  methods:{
    song(){
    //获取最新音乐数据
    //`type`: 地区类型 id,对应以下:全部:0,华语:7,欧美:96,日本:8,韩国:16
    axios({
      url:'http://localhost:3000/top/song',
      method:'get',
      params:{
        type:this.tag
      }
    }).then(res=>{
      this.songs=[]
      for(let i=0;i<10;i++){
        this.songs.push(res.data.data[((this.page-1)*10)+i])
        if(this.songs[i].mvid==0){
          this.showmv = false
        }
      }
      this.total = res.data.data.length
      this.loading = false
    })
    },
    //播放音乐，同时添加到播放列表
    play(item){
      axios({
        url:'http://localhost:3000/song/url',
        method:'get',
        params:{
          id:item.id
        }
      }).then(res=>{
        let song = {}
        song.name = item.name
        song.url = res.data.data[0].url
        song.cover = item.album.picUrl
        song.md5 = res.data.data[0].md5
        if(item.album.artists["0"].name != null){
          song.artist = item.album.artists["0"].name
        }else{
          song.artist = ''
        }
        song.id = String(item.id)
        this.$parent.upadtelist(song)
      })
    },
    //页码改变调用函数
    handleCurrentChange(val){
      this.page = val
      this.song()
    },
    //跳转mv
    tomv(id){
      this.$router.push('/mv?id='+id)
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table tr:nth-child(2n) {
    background-color: #fff;
}
/deep/ .el-table tr:nth-child(2n):hover{
    background-color: #fafafa;
}
.right{
  margin-right:0!important; 
}
.tab-bar{
  margin-bottom: 10px;
}
#page{
  margin-top:20px
}
</style>
