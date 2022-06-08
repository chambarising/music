<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="list.coverImgUrl?list.coverImgUrl:''" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{list.name}}</p>
        <i class="el-icon-circle-plus-outline" style="position: absolute;top: 115px;right: 150px;border: 1px solid rgba(0,0,0,0.3);border-radius: 50px;padding: 5px;cursor: pointer;" @click="addlovelist"></i>
        <div class="author-wrap">
          <img class="avatar" :src="list.creator.avatarUrl?list.creator.avatarUrl:''" alt="" />
          <span class="name">{{list.creator.nickname}}</span>
          <span class="time">{{this.$moment(this.list.createTime).format('YYYY-MM-DD')}} 创建</span>
        </div>
        <div class="play-wrap" @click="playall()">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap" v-if="list.tags">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in list.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap" v-if="list.description != ''">
          <span class="title">简介:</span>
          <span class="desc">
            {{list.description}}
            <span v-if="down" class="el-icon-arrow-down" @click="open()"></span>
            <span v-if="up" class="el-icon-arrow-up" @click="close()"></span>
          </span>
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
            <tr class="el-table__row" v-for="(item,index) in songlist" :key="index">
              <td>{{index+1}}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl?item.al.picUrl:''" alt="" />
                  <span class="iconfont icon-play" @click="play(item)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span v-if="item.mv" class="iconfont icon-mv" @click="tomv(item.mv)"></span>
                  </div>
                  <span>{{item.alia[0]!=[]?item.alia[0]:''}}</span>
                </div>
              </td>
              <td>{{item.ar.length>1?(item.ar.length>2?`${item.ar[0].name} / ${item.ar[1].name} /..`:`${item.ar[0].name} / ${item.ar[1].name}`):item.ar[0].name}}</td>
              <td>{{item.al.name}}</td>
              <td>{{item.dt | time}}</td>
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
      //歌单详情
      list:{},
      //歌单歌曲详情
      songlist:[],
      //判断简介是否过长
      down:false,
      up:false,
      //存储简介
      description:'',
      //修改样式
      classname:'',
      //存储id
      id:[],
      queryid:''
    };
  },
  methods: {
    //根据歌单id请求歌单详情
    getplaylist(){
      axios({
        url:'http://localhost:3000/playlist/detail',
        method:'get',
        params:{
          id:this.$route.query.id
        }
      }).then(res=>{
        if(res.data.msg !='参数错误' ){
          this.list = res.data.playlist
          this.description = this.list.description
          this.id = this.list.trackIds[0].id
        }
        if(this.list.description.length>50){
            this.list.description = `${this.list.description.substring(0,50)}...`
            this.classname = 'el-icon-arrow-down'
            this.down = true
          }
          for(let i=1;i<this.list.trackIds.length;i++){
            this.id = this.id+','+String(this.list.trackIds[i].id)
          }
      })
    },
    //根据歌单歌曲id请求歌曲数据
    getsonglist(){
      axios({
        url:'http://localhost:3000/playlist/track/all',
        method:'get',
        params:{
          id:this.$route.query.id
        }
      }).then(res=>{
        if(res.data.msg != '参数错误'){
          this.songlist = res.data.songs
        }
      })
    },
    //单独播放
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
        song.cover = item.al.picUrl
        song.md5 = res.data.data[0].md5
        song.id = String(item.id)
        if(item.ar[0].name != []){
          song.artist = item.ar[0].name
        }else{
          song.artist = ''
        }
        //console.log(song)
        this.$parent.upadtelist(song)
      })
    },
    //全部播放
    async playall(){
      await axios({
        url:'http://localhost:3000/song/url',
        methods:'get',
        params:{
          id:this.id
        }
        }).then(res=>{
        if(res.data.msg !='参数错误'){
        let ids = this.id.split(',')
        let newsonglist = []
        //根据id重新进行排序，防止请求结果因时间不同导致顺序出错
        for(let q=0;q<res.data.data.length;q++){
          res.data.data.some(item=>{
            if(item.id == ids[q]){
              newsonglist.push(item)
              return true
            }
          })
        }
        //console.log(newsonglist)
        let newsongLists = []
        let allArtist = []
        let allsong = {}
        for(let i=0;i<res.data.data.length;i++){
          allsong = {}
          allArtist = []
          allsong.name = this.songlist[i].name
          allsong.url = newsonglist[i].url
          allsong.cover = this.songlist[i].al.picUrl
          allsong.md5 = newsonglist[i].md5
          for(let j=0;j<this.songlist[i].ar.length;j++){
            allArtist.push(this.songlist[i].ar[j].name)
            allsong.artist = allArtist
          }
          allsong.id = newsonglist[i].id
          newsongLists.push(allsong)
        }
        //console.log(newsongList)
        this.$parent.playmusicall(newsongLists)
        this.$parent.deletebtn = true
        }
      })
    },
    //打开简介
    open(){
      if(this.classname = 'el-icon-arrow-down'){
        this.list.description = this.description
        this.down = false
        this.up = true
      }
    },
    close(){
      if(this.classname = 'el-icon-arrow-up'){
        this.list.description = `${this.list.description.substring(0,50)}...`
        this.up = false
        this.down = true
      }
    },
    tomv(id){
      this.$router.push('/mv?id='+id)
    },
    //把歌单添加到收藏的歌单
    addlovelist(){
      let id = this.$route.query.id
      let user = this.$parent.user
      if(user.musicListId == null || user.musicListId == ''){
        this.$parent.user.musicListId = String(id)
        axios({
          url:'http://localhost:3001/addmusiclist',
          method:'post',
          params:{
            name:user.name,
            musicListId:String(id)
          }
        })
        return
      }else{
        let ids = user.musicListId.split(',')
        let find
        ids.some(item=>{
          if(item == id){
            find = true
            return true
          }})
        if(find){
            this.$message('你已经收藏过了^^')
            }else{
            ids.push(String(id))
            let newid
            for(let i=0;i<ids.length;i++){
              if(newid){
                newid = newid+','+ids[i]
                }else{
                newid = ids[i]
                }
              }
            this.$parent.user.musicListId = newid
            axios({
              url:'http://localhost:3001/addmusiclist',
              method:'post',
              params:{
                name:user.name,
                musicListId:newid
              }
            })
      }
      }
    }
  },
  created(){
    this.getplaylist()
    this.getsonglist()
  },
};
</script>

<style lang="less" scoped>
.play-wrap{
  cursor: pointer;
}
/deep/ .name-wrap{
  height: 19px;
  overflow: hidden;
}
</style>
