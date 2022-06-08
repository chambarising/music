<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{this.$route.query.result}}</h2>
      <span class="sub-title">找到{{total}}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th class="songtitle">音乐标题</th>
            <th class="singer">歌手</th>
            <th class="album">专辑</th>
            <th class="time">时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in songlist" :key="index">
              <td>{{index+1}}</td>
             <td>
            <div class="img-wrap">
              <img :src="pic != []?pic[index]:''" alt="" />
              <span class="iconfont icon-play" @click="play(item)"></span>
            </div>
          </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mvid!=0" @click="tomv(item.mvid)"></span>
                  </div>
                  <span>{{item.alias.length != 0 ? item.alias[0]:''}}</span>
                </div>
              </td>
              <td>{{item.artists.length>1?(item.artists.length>2?`${item.artists[0].name} / ${item.artists[1].name} /..`:`${item.artists[0].name} / ${item.artists[1].name}`):item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <td>{{item.duration | time}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item,index) in musiclist" :key="index">
            <div class="img-wrap" @click="showmusiclist(item.id)">
              <div class="desc-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl?item.coverImgUrl:''" alt="" />
              <span class="iconfont icon-play" @click.stop="playall(item.id)"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item,index) in mvlist" :key="index" @click="tomv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover?item.cover:''" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | time}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName?item.artistName:'null'}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
      <el-pagination
      @current-change="handleCurrentChange"
      :v-if="this.songlist==[]"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="limit"
      >
      </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'result',
  data() {
    return {
      activeIndex: 'songs',
      //搜索框内容
      item:this.$route.query.result,
      //当前页
      page:1,
      //每页个数
      limit:20,
      //总条数
      total:100,
      //搜索类型
      type:1,
      //歌曲列表
      songlist:[],
      //歌单列表
      musiclist:[],
      //mv列表
      mvlist:[],
      //保存搜索歌曲的图片
      pic:[],
      //存储歌单歌曲id
      id:[],
      //存储歌单歌曲详情
      songMusicList:[]
    };
  },
  methods:{
    //请求歌曲列表
     async getsonglist(){
       await axios({
        url:'http://localhost:3000/search',
        method:'get',
        params:{
          keywords:this.item,
          limit:this.limit,
          offset:(this.page-1)*this.limit,
          type:this.type
        }
      }).then(res=>{
        if(res.data.msg != '参数错误'){
        this.songlist = res.data.result.songs
        this.total = res.data.result.songCount
        this.getpic()
        //console.log(res)
        }
      })
    },
    //请求歌单列表
    getmusiclist(){
      axios({
        url:'http://localhost:3000/search',
        method:'get',
        params:{
          keywords:this.item,
          limit:this.limit,
          offset:(this.page-1)*this.limit,
          type:this.type
        }
      }).then(res=>{
        if(res.data.msg != '参数错误'){
          this.musiclist = res.data.result.playlists
          this.total = res.data.result.playlistCount
          for(let i=0;i<this.musiclist.length;i++){
            if(this.musiclist[i].playCount>10000){
              this.musiclist[i].playlistCount=parseInt(`${this.musiclist[i].playlistCount/1000}W`)
            }
          }
        }
      })
    },
    //请求mv列表
    getmvlist(){
      axios({
        url:'http://localhost:3000/search',
        method:'get',
        params:{
          keywords:this.item,
          limit:this.limit,
          offset:(this.page-1)*this.limit,
          type:this.type
        }
      }).then(res=>{
        if(res.data.msg != '参数错误'){
          this.mvlist = res.data.result.mvs
          this.total = res.data.result.mvCount
          for(let i=0;i<this.mvlist.length;i++){
            if(this.mvlist[i].playCount>10000){
              this.mvlist[i].playCount = parseInt(`${this.mvlist[i].playCount/1000}W`)
            }
          }
        }
      })
    },
    //播放歌曲
    play(item){
      let song={}
      axios({
        url:'http://localhost:3000/song/url',
        method:'get',
        params:{
          id:item.id
        }
      }).then(res=>{
        song.name = item.name
        song.url = res.data.data[0].url
        song.cover = item.picUrl
        song.md5 = res.data.data[0].md5
        if(item.artists[0].name){
          let singer =[]
          for(let i=0;i<item.artists.length;i++){
            singer.push(item.artists[i].name) 
          }
          song.artist = singer
        }
        song.id = String(item.id)
        this.$parent.upadtelist(song)
      })
    },
    //获取歌曲图片
    async getpic(){
    this.pic = []
      for(let i=0;i<this.songlist.length;i++){
         await axios({
            url:'http://localhost:3000/song/detail',
            method:'get',
            params:{
              ids:this.songlist[i].id
            }
          }).then(res=>{
            if(res.data.songs[0].al.picUrl){
            this.songlist[i].picUrl = res.data.songs[0].al.picUrl
            this.pic.push(res.data.songs[0].al.picUrl)
            }else{
              this.songlist[i].picUrl = ''
            }
          })
     }
    },
    //分页
    handleCurrentChange(val){
      this.page=val
      switch (this.type){
        case 1 :
          this.getsonglist()
          break
        case 1000 :
          this.getmusiclist()
          break
        case 1004 :
          this.getmvlist()
          break
        default:
        break
      }
    },
    //跳转歌单详情
    showmusiclist(id){
      this.$router.push('/playlist?id='+id)
    },
    //转跳mv页面
    tomv(id){
      this.$router.push('/mv?id='+id)
    },
    //直接播放歌单音乐
    playall(id){
      axios({
        url:'http://localhost:3000/playlist/detail',
        method:'get',
        params:{
          id
        }
      }).then(res=>{
        //保存歌曲id
        if(res.data.msg !='参数错误'){
          this.id = res.data.playlist.trackIds[0].id
        }
        for(let i=1;i<res.data.playlist.trackIds.length;i++){
          this.id = this.id+','+String(res.data.playlist.trackIds[i].id)
        }
        //请求歌单歌曲详情
        axios({
          url:'http://localhost:3000/playlist/track/all',
          method:'get',
          params:{
            id
          }
        }).then(res=>{
        if(res.data.msg != '参数错误'){
          this.songMusicList = res.data.songs
        }})
        //请求歌曲播放地址并进行播放
        axios({
          url:'http://localhost:3000/song/url',
          method:'get',
          params:{
            id:this.id
          }
        }).then(res=>{
          if(res.data.msg !='参数错误'){
            let ids = this.id.split(',')
            let newsonglist = []
            for(let q=0;q<res.data.data.length;q++){
              res.data.data.some(item=>{
                if(item.id == ids[q]){
                  newsonglist.push(item)
                  return true
                }
              })
            }
        let newsongLists = []
        let allArtist = []
        let allsong = {}
        for(let i=0;i<res.data.data.length;i++){
          allsong = {}
          allArtist = []
          allsong.name = this.songMusicList[i].name
          allsong.url = newsonglist[i].url
          allsong.cover = this.songMusicList[i].al.picUrl
          allsong.md5 = newsonglist[i].md5
          for(let j=0;j<this.songMusicList[i].ar.length;j++){
            allArtist.push(this.songMusicList[i].ar[j].name)
            allsong.artist = allArtist
          }
          allsong.id = newsonglist[i].id
          newsongLists.push(allsong)
        }
        //console.log(newsongList)
        this.$parent.playmusicall(newsongLists)            
          }
        })
      })
    }
  },
  created(){
    if(this.type==1){
    this.getsonglist()
    }else if(this.type == 1000){
      this.getmusiclist()
    }else if(this.type == 1004){
      this.getmvlist()
    }
 },
  watch:{
   item(){
     if(this.activeIndex == 'songs'){
       this.getsonglist()
     }else{
      this.activeIndex = 'songs'
     }
     this.type = 1
     this.page = 1
   },
   activeIndex(){
     switch (this.activeIndex){
       case 'songs':
         this.type = 1
         this.getsonglist()
         break
       case 'lists':
         this.type = 1000
         this.getmusiclist()
         break
       case 'mv':
         this.type =  1004
         this.getmvlist()
         break
       default:
         break
     }
   },
 },
 updated(){
   this.item = this.$route.query.result
 }
};
</script>

<style lang='less' scoped>
/deep/ .songtitle {
    margin-right: 100px;
    position: relative;
    left: 180px;
}
/deep/ .singer {
    position: relative;
    left: 250px;
}
/deep/ .album{
  position: relative;
    left: 190px;
}
/deep/ .time{
  position: relative;
    left: 380px;
}
/deep/ .el-table.playlit-table th:nth-child(2) {
    width: 180px;
}
/deep/ .el-table.playlit-table th:nth-child(3) {
    width: 250px;
}
/deep/ .el-table.playlit-table th:nth-child(4) {
    width: 195px;
}
/deep/ .item {
    overflow: hidden;
    margin-right: 75px;
    margin-bottom: 40px;
}
/deep/ .name {
    font-size: 17px;
    margin-top: 10px;
    padding-left: 5px;
}
.result-container .items .item .name:hover{
  color: #00a1d6;
}
/deep/ .desc-wrap {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    font-size: 16px;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    max-height: 50px;
    padding: 5px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    top:0;
    transform: translateY(-100%);
    transition: .5s;
}
/deep/ .img-wrap:hover .desc-wrap{
  transform: translateY(0)
}
/deep/ .mv .item{
  margin-right: 25px;
  margin-bottom: 40px;
}
/deep/ .mv .item .img-wrap .num-wrap{
  background-color:rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
/deep/ .name-wrap{
  height: 19px;
  overflow: hidden;
}
</style>
