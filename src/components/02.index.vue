<template>
  <div class="index-container">
    <!-- 左侧导航 -->
    <div class="nav" @click="close();closeSearch()" style="overflow:auto">
      <ul>
        <li @click="allblack">
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li @click="allblack">
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li @click="allblack">
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li @click="allblack">
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
        <hr style="height:5px;border:none;border-top:5px ridge ;" v-if="login"/>
        <li v-if="login" style="margin:5px 0" @click="allblack">
          <router-link to="/lovemusic">
            <span class="iconfont icon-music-list"></span>
            我喜欢的音乐
          </router-link>
        </li>
        <hr style="height:5px;border:none;border-top:5px ridge ;" v-if="login"/>
        <p v-if="login" style="margin-top:10px">收藏的歌单</p>
        <li  v-for="(item,index) in leftmusiclist" :key="index">
        <div style="color: black;padding-left: 30px;font-size: 18px;line-height: 60px;width: 100%;height: 100%;" @click="tothismusiclist(item.data.playlist.id,index,$event)" ref="lovemusiclist">
            {{item.data.playlist.name.length>6?item.data.playlist.name.substring(0,6)+'..':item.data.playlist.name}}
        </div>
        <i class="el-icon-error" style="color:rgba(0,0,0,0.5)" @click="showdeletemusiclist(item.data.playlist.id)"></i>      
        </li>
      </ul>
    </div>
    <!-- 右侧主体 -->
    <div class="main" @click="close();closeSearch()" >
      <router-view :key="$route.name + ($route.params.id || '')"></router-view>
      <!-- 删除歌曲列表 -->
    </div>
    <div class="deletdiv" v-if="delet">
    <div class="deletmsg">
      <div class="msg">确定全部删除？</div>
      <div class="choosebtn">
      <button class="truebtn" @click="removeall">确定</button>
      <button class="closebtn" @click="closethis">取消</button>        
      </div>
    </div>
    </div>
    <!-- 删除喜欢的歌曲 -->
    <div class="deletdiv" v-if="deletelove">
    <div class="deletmsg">
      <div class="msg">确定删除该喜欢的音乐？</div>
      <div class="choosebtn">
      <button class="truebtn" @click="removelove">确定</button>
      <button class="closebtn" @click="closelove">取消</button>        
      </div>
    </div>
    </div>
  <!-- 删除喜欢的歌曲 -->
    <div class="deletdiv" v-if="deletelovemusiclist">
    <div class="deletmsg">
      <div class="msg">确定删除该喜欢的歌单？</div>
      <div class="choosebtn">
      <button class="truebtn" @click="deletethismusiclist">确定</button>
      <button class="closebtn" @click="closelovelist">取消</button>        
      </div>
    </div>
    </div>
    <!-- 播放插件 -->
    <div class="player" @click="closeSearch()">
      <aplayer 
      :audio="audio" 
      :lrcType="3" 
      ref="player" 
      :fixed="true"
      @listSwitch="handleEvent"
      v-if="audio"/>
      <p class="showmusic"> <（￣︶￣）/点击左侧打开播放栏
      <p style="position: fixed;left: 60.6%;bottom: 3.5%;" v-if="deletebtn">
      ------点这里删除歌曲->
      </p>
      </p>
      <span class="el-icon-takeaway-box" style="position:fixed;right:27.5%;bottom:3.75%;z-index:99;" @click="deleteone" v-if="deletebtn"></span>
      <span class="el-icon-delete-solid" style="position:fixed;right:25.5%;bottom:3.85%;z-index:99;" @click="showdelet" v-if="deletebtn"></span>
      <span :class="lovebtn" style="position:fixed;right:8%;bottom:3.85%;z-index:99;" @click="lovemusic" v-if="lovemusicbtn" ref="star"></span>      
      <p style="position:fixed;right:20.5%;bottom:3.7%;" v-if="deletebtn">
      <--remake
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Bus from '@/router/eventBus.js'
export default {
  name: 'index',
  data() {
    return {
      audio:[],
      delet:false,
      deletebtn:true,
      login:false,
      user:{},
      lovemusicbtn:false,
      //控制收藏背景色
      color:false,
      //控制显示喜欢音乐删除盒子
      deletelove:false,
      //控制喜欢的音乐类名
      lovebtn:'el-icon-star-off',
      //导航栏歌单列表
      leftmusiclist:[],
      //显示删除歌单
      deletelovemusiclist:false,
      //保存要删除的歌单
      thisdeletemusiclist:''
    };
  },
  methods:{
    //最新音乐向列表添加歌曲
    upadtelist(song){
      let newlist = {}
      let num = 0
      if(this.audio.some((item,index)=>{
        if(item.id == song.id){
          num = index
          return true
          }
        })){
          this.$refs.player.switch(num)
          this.$refs.player.play()
          return
      }else{
        let id =JSON.parse(localStorage.getItem('id'))
        newlist = song
        if(id==null){
          let newid = newlist.id
          this.audio.push(newlist)
          localStorage.setItem('id',JSON.stringify(newid))
          this.$refs.player.switch(this.audio.length+1)
          this.$refs.player.play()
          this.deletebtn = true
          let testuser = JSON.stringify(this.user)
          if( testuser != '{}'){
            let item1 = JSON.parse(localStorage.getItem('aplayer-setting'))
            let id1 = item1[0].music.id
            let lovemusicid = this.user.loveMusic.split(',')
            lovemusicid.some(item=>{
              if(item == id1){
               this.color = true
               //console.log('true')
               return true
             }else{
               this.color = false
               //console.log('false')
             }
           })
          this.lovemusicbtn = true
        }
        }else{
          let newid = id+','+newlist.id
          this.audio.push(newlist)
          localStorage.setItem('id',JSON.stringify(newid))
          this.$refs.player.switch(this.audio.length+1)
          this.$refs.player.play()
          this.deletebtn = true
          let testuser = JSON.stringify(this.user)
          if( testuser != '{}'){
            let item2 = JSON.parse(localStorage.getItem('aplayer-setting'))
            let id2 = item2[0].music.id
            let lovemusicid1 = this.user.loveMusic.split(',')
            lovemusicid1.some(item=>{
              if(item == id2){
               this.color = true
               //console.log('true')
               return true
             }else{
               this.color = false
               //console.log('false')
             }
           })
            this.lovemusicbtn = true
          }
        }      
      }
    },
    //全部音乐播放按钮
    playmusicall(newsonglist){
      localStorage.removeItem('id')
      this.audio=[]
      this.audio = newsonglist
      this.$refs.player.switch(0)
      this.$refs.player.play()
      let id = ''
      for(let i=0;i<newsonglist.length;i++){
        if(id == ''){
          id = newsonglist[i].id
        }else{
          id = id+','+newsonglist[i].id
        }
      }
      localStorage.setItem('id',JSON.stringify(id))
      this.deletebtn = true
      let testuser = JSON.stringify(this.user)
      if( testuser != '{}'){
        let item2 = JSON.parse(localStorage.getItem('aplayer-setting'))
        let id2 = item2[0].music.id
        let lovemusicid1 = this.user.loveMusic.split(',')
        lovemusicid1.some(item=>{
          if(item == id2){
            this.color = true
            //console.log('true')
            return true
          }else{
            this.color = false
            //console.log('false')
          }
        })
        this.lovemusicbtn = true
      }
      },
    //根据本地存储加载歌单列表
    getMusicList(){
      let id = JSON.parse(localStorage.getItem('id'))
     axios({
        url:'http://localhost:3000/song/url',
        method:'get',
        params:{
          id
        }
      }).then(res=>{
        let firstres =res.data.data
        if(id){
        let ids =id.split(',')
        let newsonglist = []
        let newsongList = []
        let allArtist = []
        let allsong = {}
        let songlist = []
         axios({
        url:'http://localhost:3000/song/detail',
        method:'get',
        params:{
          ids:id
        }
        }).then(res=>{
          songlist = res.data.songs
           if(res.data.msg !='参数错误'){
        for(let q=0;q<firstres.length;q++){
          firstres.some(item=>{
            if(item.id == ids[q]){
              newsonglist.push(item)
              return true
            }
          })
        }
        for(let i=0;i<firstres.length;i++){
          allsong = {}
          allArtist = []
          allsong.name = songlist[i].name
          allsong.url = newsonglist[i].url
          allsong.cover = songlist[i].al.picUrl
          allsong.md5 = newsonglist[i].md5
          for(let j=0;j<songlist[i].ar.length;j++){
            allArtist.push(songlist[i].ar[j].name)
            allsong.artist = allArtist
          }
          allsong.id = newsonglist[i].id
          newsongList.push(allsong)
        }
        this.audio = newsongList
        this.deletebtn = true
        let testuser = JSON.stringify(this.user)
        if( testuser != '{}'){
            this.lovemusicbtn = true
            let musicid = this.user.loveMusic.split(',')
            let thisplayer = JSON.parse(localStorage.getItem('aplayer-setting'))
            if(thisplayer[0].music.id){
              musicid.some(item=>{
                if(item == thisplayer[0].music.id){
                  this.color = true
                }
              })
            }
        }
        }
        })
        }
      })
    },
    //关闭播放列表
    close(){
      this.$refs.player.hideList()
    },
    test(){
      let aplayer = this.$refs.player
      Bus.$emit('close',aplayer)
    },
    //关闭搜索
    closeSearch(){
      this.$emit('closeSearch')
    },
    //显示删除和收藏键
    showdelet(){
      this.delet = true
    },
    //隐藏删除键和收藏键
    closethis(){
      this.delet = false
    },
    //删除全部
    removeall(){
      this.audio = []
      localStorage.removeItem('id')
      localStorage.removeItem('aplayer-setting')
      let defult = [{currentTime: 0,
duration: null,
list: true,
loop: "all",
lrc: false,
mini: true,
music: {id: null, name: "未加载音频", artist: "(ಗ ‸ ಗ )", url: ""},
order: "list",
paused: true,
volume: 0.3}]
      this.delet = false
      localStorage.setItem('aplayer-setting',JSON.stringify(defult))
      location.reload()
    },
    //单独删除
    deleteone(){
      let item = JSON.parse(localStorage.getItem('aplayer-setting'))
      let ids = JSON.parse(localStorage.getItem('id')).split(',')
      let id = item[0].music.id
      this.audio.some((item,index)=>{
        if(item.id == id){
          this.audio.splice(index,1)
          ids.splice(index,1)
          if(this.audio.length != []){
          let newid = ''
          for(let i=0;i<ids.length;i++){
            if(newid == ''){
              newid = ids[i]
            }else{
              newid = newid+','+ids[i]
            }
          }
          localStorage.setItem('id',JSON.stringify(newid))
          }else{
           localStorage.removeItem('id')
           localStorage.removeItem('aplayer-setting')
           let defult = [{currentTime: 0,duration: null,list: true,loop: "all",lrc: false,mini: true,music: {id: null, name: "未加载音频", artist: "(ಗ ‸ ಗ )", url: ""},order: "list",paused: true,volume: 0.3}]
           localStorage.setItem('aplayer-setting',JSON.stringify(defult))
           location.reload()  
          }
          return true
        }
      })
    },
    //更新登录信息
    updatalogin(){
      let login = localStorage.getItem('login')
      let userlist = JSON.parse(localStorage.getItem('user'))
      if(login){
      axios({
        url:'http://localhost:3001/updatalogin',
        method:'post',
        params:{
          name:userlist.name
        }
      }).then(res=>{
        if(res.data.login){
            this.login = true
            let user = {}
            user.name = res.data.user.name
            user.id = res.data.user._id
            user.pic = res.data.user.pic
            user.bid = res.data.user.bid
            user.loveMusic = res.data.user.loveMusic
            user.musicListId = res.data.user.musicListId
            localStorage.setItem('login','true')
            localStorage.setItem('user',JSON.stringify(user))
            this.user = user
        }else{
            localStorage.removeItem('login')
            localStorage.removeItem('user')
        }
      })        
      }
    },
    //添加到喜欢的音乐或显示确认删除喜欢的音乐框
    lovemusic(){
      let item = JSON.parse(localStorage.getItem('aplayer-setting'))
      let id = item[0].music.id
      let user = this.user
      let ids
      let newid
      //用户有喜欢的音乐时将音乐字符串拆分
      if(user.loveMusic){
      //console.log('拆分了')
      ids = user.loveMusic.split(',')
      //console.log(ids)
      }
      //当有喜欢和没喜欢时
      console.log(ids)
      if(ids.length>0){
        ids.some((item,index)=>{
          if(item == String(id)){
            this.deletelove = true
            return true
          }else{
            //console.log('进入else')
            for(let i=0;i<ids.length+1;i++){
              if(newid){
                newid = newid+','+ids[i-1]
              }else{
                newid = String(id)
              }
            }
            this.user.loveMusic = newid
            axios({
              url:'http://localhost:3001/updatalove',
              method:'get',
              params:{
                musicid:newid,
                name:this.user.name
              }
            })
            this.color = true
            return true
          }
        })
      }else{
        newid = String(id)
        this.user.loveMusic = newid
        axios({
          url:'http://localhost:3001/updatalove',
          method:'get',
          params:{
          musicid:newid,
          name:this.user.name
          }
        })
        this.color = true
      }
      //console.log(user)
      //console.log(id)
      //console.log(this.user)
    },
    closelove(){
      this.deletelove = false
    },
    //删除喜欢
    removelove(){
      let item = JSON.parse(localStorage.getItem('aplayer-setting'))
      let id = item[0].music.id
      console.log(id)
      let ids = this.user.loveMusic.split(',')
      console.log(ids)
      ids.some((item,index)=>{
        if(item == id){
          ids.splice(index,1)
          console.log(ids)
          console.log(index)  
          let newid
          //判断是否还有喜欢的音乐
          if(ids.length>0){
            for(let i=0;i<ids.length;i++){
              if(newid){
                newid = newid +','+ ids[i]
              }else{
                newid = ids[i]
              }
            }
            console.log(newid)
            this.user.loveMusic = newid
            axios({
              url:'http://localhost:3001/updatalove',
              method:'post',
              params:{
                musicid:newid,
                name:this.user.name
              }
            })
            this.color = false
            this.deletelove = false
            return true
          }else{
            newid = null
            this.user.loveMusic = newid
            axios({
              url:'http://localhost:3001/updatalove',
              method:'post',
              params:{
                musicid:newid,
                name:this.user.name
              }
            })
            this.color = false
            this.deletelove = false
            return true
          }
        }
      })
    },
    //切换歌曲时判断用户是否有收藏
    handleEvent(){
      let item = JSON.parse(localStorage.getItem('aplayer-setting'))
      let id = item[0].music.id
      let lovemusicid = this.user.loveMusic.split(',')
      lovemusicid.some(item=>{
        if(item == id){
          this.color = true
          //console.log('true')
          return true
        }else{
          this.color = false
          //console.log('false')
        }
      })
    },
    //点击去往对应歌单
    tothismusiclist(id,index){
      for(let i=0;i<this.$refs.lovemusiclist.length;i++){
        this.$refs.lovemusiclist[i].style.color = 'black'
      }
      this.$refs.lovemusiclist[index].style.color = '#dd6d60'
      this.$router.push('/playlist?id='+id)
      location.reload()
    },
    allblack(){
       for(let i=0;i<this.$refs.lovemusiclist.length;i++){
        this.$refs.lovemusiclist[i].style.color = 'black'
      }
    },
    showdeletemusiclist(id){
      this.deletelovemusiclist = true
      this.thisdeletemusiclist = id
    },
    closelovelist(){
      this.deletelovemusiclist = false
      this.thisdeletemusiclist = ''
    },
    deletethismusiclist(){
      this.leftmusiclist.some((item,index)=>{
        if(item.data.playlist.id == this.thisdeletemusiclist){
          this.leftmusiclist.splice(index,1)
          this.deletelovemusiclist = false
          this.thisdeletemusiclist = ''
          //console.log(index)
          return true
        }
      })
      let newid
      for(let i=0;i<this.leftmusiclist.length;i++){
        if(newid){
          newid = newid +','+this.leftmusiclist[i].data.playlist.id
        }else{
          newid = this.leftmusiclist[i].data.playlist.id
        }
      }
      axios({
        url:'http://localhost:3001/addmusiclist',
        method:'post',
        params:{
          name:this.user.name,
          musicListId:newid
        }
      })
    }
  },
  created(){
    this.updatalogin()
    this.getMusicList()
    let id = JSON.parse(localStorage.getItem('id'))
    if(id){      
    }else{
     let defult = [{currentTime: 0,duration: null,list: true,loop: "all",lrc: false,mini: true,music: {id: null, name: "未加载音频", artist: "(ಗ ‸ ಗ )", url: ""},order: "list",paused: true,volume: 0.3}]
    localStorage.setItem('aplayer-setting',JSON.stringify(defult))
    }
  },
  mounted(){
    this.$refs.player.hideLrc();
    this.test()
    if(this.audio.length == 0){
      this.deletebtn = false
      this.lovemusicbtn = false
    }
  },
  watch:{
    color(newVal,OldVal){
      if(newVal){
        this.$nextTick(()=>{
        this.lovebtn = 'el-icon-star-on'
        this.$refs.star.style.color = 'D9D919'
        })
      }else{
        this.lovebtn = 'el-icon-star-off'
        this.$refs.star.style.color = ''
      }
    },
    'user.musicListId'(newVal,oldVal){
      let newmusiclist = []
      if(this.user.musicListId != null && this.user.musicListId != ''){
        let ids = this.user.musicListId.split(',')
        for(let i=0;i<ids.length;i++){
        axios({
          url:'http://localhost:3000/playlist/detail',
          method:'get',
          params:{
            id:ids[i]
          }
        }).then(res=>{
          newmusiclist.push(res)
        })
        }
        this.leftmusiclist = newmusiclist
        //console.log(this.leftmusiclist.length)
        //console.log(this.leftmusiclist)
      }
    },
    leftmusiclist(){
      let ids = this.user.musicListId.split(',')
      for(let d=0;d<this.leftmusiclist.length;d++){
          this.leftmusiclist.some((item,index)=>{
            if(item.data.playlist.id == ids[d]){
              this.leftmusiclist[d] = item
              return true
            }
          })
        }
    }
  }
}
</script>

<style lang="less" scoped>

.aplayer{
  margin: 0;
}
/deep/ .aplayer.aplayer-fixed .aplayer-body {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    z-index: 99;
    background: #fff;
    padding-right: 18px;
    -webkit-transition: width .3s ease;
    transition: width .3s ease;
    max-width:100%;
    width: calc(100% - 18px);
}
/deep/ .aplayer.aplayer-fixed .aplayer-icon-back {
    right: 780px;
}
/deep/ .aplayer.aplayer-fixed .aplayer-icon-play {
    right: 730px;
}
/deep/ .aplayer.aplayer-fixed .aplayer-icon-forward {
    right: 680px;
}
/deep/ .aplayer.aplayer-fixed .aplayer-lrc {
  bottom:55px
}
/deep/ .aplayer .aplayer-lrc .aplayer-lrc-contents {
    width: 100%;
    position: fixed;
}
/deep/ .aplayer .aplayer-lrc p.aplayer-lrc-current {
  width:180px;
  position: fixed;
  left: 45.5%;
  background-color: rgba(0,0,0,.3);
}
.showmusic {
    position: fixed;
    left: 45%;
    bottom: 3.5%;
}
.el-icon-takeaway-box:hover{
  color: #00a1d6;
  cursor: pointer;
}
.el-icon-delete-solid:hover{
  color: #d60000;
  cursor: pointer;
}
.deletdiv{
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.3);
}
.deletmsg{
  position: absolute;
    top: 35%;
    left: 43%;
    background-color: #e7e7e7;
    height: 15%;
    width: 15%;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,0.8);
}
.msg{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
}
.choosebtn{
  height:50%
}
.truebtn{
  float: left;
    height: 70%;
    width: 30%;
    margin-left: 20px;
}
.truebtn:hover{
  color:#00a1d6
}
.closebtn{
  float: right;
    height: 70%;
    width: 30%;
    margin-right: 18px;
}
.closebtn:hover{
  color:#00a1d6
}
.el-icon-star-off{
  cursor: pointer;
  font-size: 25px;
}
.el-icon-star-on{
  cursor: pointer;
  font-size: 25px;
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
  background: #ef5da3;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
</style>
