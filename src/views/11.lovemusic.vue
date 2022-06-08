<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="list[0].cover" alt="" />
      </div>
      <div class="info-wrap">
        <h2 class="h4title">我喜欢的音乐</h2>
        <div class="author-wrap" style="margin-top:30px">
          <span class="name">{{user.name}}</span>
        </div>
        <div class="play-wrap" style="margin-top:60px;cursor:pointer" v-if="playallbtn" @click="playall">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item,index) in list" :key="index">
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.cover" alt=""/>
                  <span class="iconfont icon-play" @click="playone(item)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name.length>30?item.name.substring(0,30)+'..':item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mv != 0"></span>
                  </div>
                  <span>{{item.alia.length>0?item.alia[0] : ''}}</span>
                </div>
              </td>
              <td>{{item.ar.length>2?(item.ar[0].name+'/'+item.ar[1].name+'/..'):(item.ar.length>1?(item.ar[0].name+'/'+item.ar[1].name):(item.ar.length>0?item.ar[0].name:''))}}</td>
              <td>{{item.al}}</td>
              <td>{{item.time | time}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'playlist',
  data() {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      //存储用户
      user:{},
      list:[],
      playallbtn : false
    };
  },
  methods: {
    //获取歌曲
    getmusiclist(){
      this.user = this.$parent.user
      let ids = this.user.loveMusic.split(',')
      let id
      let song = {}
      //第一个请求回来排序好的数组
      let songlist1 = []
      //第二个请求回来排序好的数组
      let songlist2 = []
      if(ids.length>0){
        this.playallbtn = true
        for(let i=0;i<ids.length;i++){
          if(id){
            id = id+','+ids[i]
          }else{
            id = ids[i]
          }
        }
        axios({
          url:'http://localhost:3000/song/detail',
          method:'get',
          params:{
            ids:id
          }
        }).then(res=>{
          //给第一个请求数组排序
          for(let a=0;a<res.data.songs.length;a++){
            res.data.songs.some(item=>{
              if(item.id == ids[a]){
                songlist1.push(item)
                return true
              }
            })
          }
          axios({
          url:'http://localhost:3000/song/url',
          method:'get',
          params:{
           id
          }
          }).then(result=>{
            //给第二个请求数组排序
            for(let b=0;b<result.data.data.length;b++){
              result.data.data.some(item=>{
                if(item.id == ids[b]){
                  songlist2.push(item)
                }
              })
            }
            //保存数据
            for(let i=0;i<songlist2.length;i++){
              song = {}
              //id
              song.id = songlist2[i].id
              //播放地址
              song.url = songlist2[i].url
              //md5
              song.md5 = songlist2[i].md5
              //歌曲时间
              song.time = songlist1[i].dt
              //歌曲mv，没有为0
              song.mv = songlist1[i].mv
              //歌曲副标题
              song.alia = songlist1[i].alia
              //歌曲封面
              song.cover = songlist1[i].al.picUrl
              //歌曲专辑
              song.al = songlist1[i].al.name
              //歌曲歌手
              song.ar = songlist1[i].ar
              //歌曲名字
              song.name = songlist1[i].name
              this.list.push(song)
            }
            //console.log(this.list)
          })
        })
      }else{
        this.$message('你还没有喜欢的歌曲')
        this.playallbtn = false
      }
    },
    //单独播放
    playone(item){
      let newsong ={}
      newsong.name = item.name
      newsong.md5 = item.md5
      newsong.id = item.id
      newsong.cover = item.cover
      newsong.url = item.url
      this.$parent.upadtelist(newsong)
      this.$parent.deletebtn = true
    },
    //全部播放
    playall(){
      let song = {}
      let newsonglist = []
      for(let i=0;i<this.list.length;i++){
        song = {}
        song.name = this.list[i].name
        song.url = this.list[i].url
        song.id = this.list[i].id
        song.md5 = this.list[i].md5
        song.cover = this.list[i].cover
        song.artist = this.list[i].ar
        newsonglist.push(song)
      }
      this.$parent.playmusicall(newsonglist)
      this.$parent.deletebtn = true
    }
  },
  created(){
    this.getmusiclist()
  }
};
</script>

<style >

</style>
