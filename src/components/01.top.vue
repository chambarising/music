<template>
  <div class="top-container" @click="close()">
    <div class="left-box" @click="none">
      <div class="icon-wrapper">
        <h3 class="name">music</h3>
      </div>
      <!-- 按钮 -->
      <div class="history-wrapper btns">
        <span class="iconfont icon-arrow-lift" @click="back()"></span>
        <span class="iconfont icon-arrow-right" @click="go()"></span>
        <span class="iconfont el-icon-s-home" @click="home()"></span>
      </div>
    </div>
    <!-- 搜索 -->
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input
          type="text"
          autocomplete="off"
          placeholder="搜索"
          v-model="query"
          class="el-input__inner"
         @keyup.enter ="find()"
         @focus="blue()"
         ref="findinput"
        />
        <span class="el-input__prefix">
          <i 
          class="el-input__icon el-icon-search" 
          @click="find()"
          ></i>
        </span>
      </div>
    <div class="showsearch" v-if="showSearch">
      <div class="searchmain" style="overflow:auto;">
        <div class="searchhistory" v-if="showhistory">
          <span style="margin:15px 0 0 10px;font-weight: 700;">搜索历史</span>
          <ul class="historyul">
            <li 
            class="historyname" 
            @click="historyFind($event)" 
            v-for="(item,index) in history" 
            :key="index">
              {{item}}
              <span class="el-icon-close" @click.stop="deleteHistory($event)" style="line-height: 20px;"></span>
              </li>
          </ul>
        </div>
        <div class="searchhotdiv">
        <div class="searchhot" ref="hot" v-if="showSearchHot">
          <span style="margin:5px 0 10px 10px;font-weight: 700;">热门搜索</span>
        </div>
          <ul v-if="showSearchHot">
            <li class="hot-item" v-for="(item,index) in searchHot" :key="index" @click="find(item.searchWord)">
              <div class="hot-index">{{index+1}}</div>
              <div class="hot-info">
                <div class="hot-right">
                  <div class="hot-name">{{item.searchWord}}</div>
                  <div class="hot-score">{{item.score}}</div>
                </div>
              </div>
              </li>
          </ul>
        </div>
        <div class="searchMusic" style="margin:5px 5px 10px 5px" v-if="showmusic">
          <span class="el-icon-headset"></span>
          <span style="margin:5px 0 10px 10px;font-weight: 700;font-size: 20px;">歌曲</span>
        </div>
        <ul v-if="showmusic">
          <li class="hot-item" style="cursor:pointer;font-size:15px" v-for="(item,index) in searchMuisc" :key="index" id="searchmusicli" @click="playmusic(item)">
            <span class="iconfont icon-play playcount"></span>
            <div class="item-name" style="display: flex;margin-right: auto;margin-left:10px;width:80%">{{item.al.name}}</div>
            <div class="item-art" style="display: flex;margin-left: auto;flex:1">{{item.ar.length>2?(item.ar[0].name+'/'+item.ar[1].name+'..'):(item.ar.length>1?(item.ar[0].name+'/'+item.ar[1].name):(item.ar.length>0?item.ar[0].name:''))}}</div>
          </li>
        </ul>
        <div class="searchMusicList" style="margin:15px 5px 10px 5px" v-if="showmusiclist">
        <span class="el-icon-tickets"></span>
          <span style="margin:5px 0 10px 10px;font-weight: 700;font-size: 20px;">歌单</span>
        </div>
        <ul v-if="showmusiclist">
          <li class="hot-item" style="cursor:pointer;font-size:15px" v-for="(item,index) in searchMuiscList" :key="index" @click="tomusiclist(item)">
            <div class="item-name" style="display: flex;margin-right: auto;margin-left:10px">{{item.name}}</div>
          </li>
        </ul>        
        <div class="searchMV" style="margin:15px 5px 10px 5px" v-if="showmv">
        <span class="el-icon-video-play"></span>
          <span style="margin:5px 0 10px 10px;font-weight: 700;font-size: 20px;color;">MV</span>
        </div>
        <ul v-if="showmv">
          <li class="hot-item" style="cursor:pointer;font-size:15px" v-for="(item,index) in searchMV" :key="index" @click="tomv(item)">
            <div class="item-name" style="display: flex;margin-right: auto;margin-left:10px;width:80%">{{item.name}}</div>
            <div class="item-art" style="display: flex;margin-left: auto;flex:1">{{item.artistName}}</div>
          </li>
        </ul>
      </div>
    </div>
    </div>
    <!-- 登录 -->
    <div class="logindiv" @click="none" v-if="login != true">      
      <span href="/login" class="login" @click="showlogin">登录</span>
    </div>
    <div class="logindiv" v-if="login" @click="none">
      <span style="position: fixed;right: 100px;text-align: center;line-height: 300%;font-size: 15px;font-weight: 500;">{{user.name}}</span>
      <i class="el-icon-setting settingi" @click="showsetting =! showsetting"></i>
      <transition name="el-zoom-in-top">
      <div v-show="showsetting" class="settingdiv transition-box">
        <div class="settinguldiv">
        <ul class="settingul">
          <li class="settingli" @click="loginout">退出</li>
        </ul>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Bus from '@/router/eventBus.js'
import axios from 'axios'
  export default {
    name: 'top',
data() {
      return {
        //请求内容
        query: '',
        //存储播放器
        player:{},
        //历史记录
        history:[],
        //判断历史记录显示
        showhistory:true,
        //热门搜索
        searchHot:[],
        //判断热门搜索是否显示
        showSearchHot:true,
        //实时搜索歌曲
        searchMuisc:[],
        //实时搜索歌单
        searchMuiscList:[],
        //实时搜索MV
        searchMV:[],
        //实时搜索歌曲id
        id:'',
        //实时搜索歌曲作者
        searchMuiscAr:'',
        //显示与隐藏实时搜索
        showSearch:false,
        //实现显示搜索歌曲
        showmusic:false,
        //实时显示搜索歌单
        showmusiclist:false,
        //实时显示搜索mv
        showmv:false,
        //判断是否显示登录
        login:false,
        user:{},
        showsetting:false
      }
    },
methods:{
      find(query){
        this.showSearch = false
        if(query){
          this.query = query
        }
        if(this.query.trim() == ''){
        this.$message({
        message:'请输入内容',
        center:true,
        duration:1000
        })
        this.$refs.findinput.style.borderColor= 'red'
        }else{
          this.$router.push('/result?result='+this.query.trim())
          //当有历史记录时
          if(this.history.length>=1){
            //判断这次搜索是否在之前记录中出现过,有就删除之前记录，将这次记录放到首位
            if(this.history.some((item,index)=>{
              if(item == this.query.trim()){
                this.history.splice(index,1)
                this.history.unshift(this.query.trim())
                return true
              }
            })){
                let history = ''
                for(let i=0;i<this.history.length;i++){
                  if(history == ''){
                    history = this.history[i]
                  }else{
                    history = history+','+this.history[i]
                  }
                }
                localStorage.setItem('history',JSON.stringify(history))
            }else{//当没有重复的时候
            //判断记录是否超过10个
            if(this.history.length>=10){
              this.history.pop()
              this.history.unshift(this.query.trim())
              let history = ''
              for(let i=0;i<this.history.length;i++){
                if(history == ''){
                  history = this.history[i]
                }else{
                  history = history+','+this.history[i]
                }
              }
              localStorage.setItem('history',JSON.stringify(history))
            }else{//当没有超过10个
            this.history.unshift(this.query.trim())
            let history = JSON.parse(localStorage.getItem('history'))
            history = this.history[0]+','+history
            localStorage.setItem('history',JSON.stringify(history))
            }
            }
          }else{
          //没有历史记录时
          this.history.push(this.query.trim())
          this.showhistory = true
          let history = this.query.trim()
          localStorage.setItem('history',JSON.stringify(history))
          }
          this.$refs.findinput.style.borderColor = '#DCDFE6'
        }
      },
      blue(){
        this.showSearch = true
        this.$refs.findinput.style.borderColor = '#4D7CFE'
      },
      none(){
        this.$refs.findinput.style.borderColor = '#DCDFE6'
        this.showSearch = false
      },
      home(){
        this.$router.push('/discovery')
      },
      go(){
        this.$router.go(1)
      },
      back(){
        this.$router.go(-1)
      },
      close(){
        this.player.hideList()
      },
      historyFind(e){
        this.$router.push('/result?result='+e.path[0].innerText.trim())
        this.showSearch = false
      },
      deleteHistory(e){
        this.history.some((item,index)=>{
          if(item == e.path[1].innerText.trim()){
            this.history.splice(this.history.indexOf(index),1)
            //删除后判断是否还存在历史记录
            if(this.history.length>0){
              let history = ''
              for(let i=0;i<this.history.length;i++){
                if(history == ''){
                  history = this.history[i]
                }else{
                  history = history+','+this.history[i]
                }
              }
              localStorage.setItem('history',JSON.stringify(history))
            }else{
              localStorage.removeItem('history')
              this.showhistory = false
            }
          }
        })
      },
      playmusic(item){
        axios({
          url:'http://localhost:3000/song/url',
          method:'get',
          params:{
            id:item.id
          }
        }).then(res=>{
          let song = {}
          song.name = item.al.name
          song.url = res.data.data[0].url
          song.cover = item.al.picUrl
          song.md5 = res.data.data[0].md5
          song.id = item.id
          if(item.ar.length>1){
            for(let j=0;j<item.ar.length;j++){
              if(song.artist){
                song.artist = song.artist +','+ item.ar[j].name
              }else{
                song.artist = item.ar[j].name
              }
            }
          }else{
            song.artist = item.ar[0].name
          }
          this.$emit('updata',song)
          this.showSearch = false
        })
      },
      tomusiclist(item){
        this.$router.push('/playlist?id='+item.id)
        this.showSearch = false
      },
      tomv(item){
        this.$router.push('/mv?id='+item.id)
        this.showSearch = false
        this.player.pause()
      },
      showlogin(){
        let a = true
        this.$emit('showlogin',a)
      },
      updatalogin(){
      let login = localStorage.getItem('login')
      let userlist = JSON.parse(localStorage.getItem('user'))
      if(login){
        this.login = true
        this.user = userlist
      }
    },
    loginout(){
      this.login =false
      this.user = {}
      this.$emit('loginout')
      localStorage.removeItem('login')
      localStorage.removeItem('user')
      this.$router.push('/discovery')
      location.reload()
    },
    touser(){
      this.showsetting = false
      this.$router.push('/user')
    }
    },
created(){
      Bus.$on('close',val=>{
        this.player = val
      })
      axios({
        url:'http://localhost:3000/search/hot/detail',
        method:'get',
      }).then(res=>{
        this.searchHot = res.data.data
      })
      this.updatalogin()
    },
mounted(){
      let history = JSON.parse(localStorage.getItem('history'))
      if(history){
        this.history = history.split(',')
      }else{
        this.showhistory = false
      }
      if(JSON.stringify(this.user)!={}){
        this.$refs.userpic.style.background = "url('"+this.user.pic+"') no-repeat"
      }else{
        console.log('none')
      }
    },
watch:{
      query(){
        if(this.query.trim() == ''){
          if(this.history.length>0){
          this.showhistory = true
          }
          this.showSearchHot = true
          this.showmusic = false
          this.showmusiclist = false
          this.showmv = false
        }else{
        clearTimeout(quick)
        let quick = setTimeout(() => {
          this.showSearchHot = false
          this.showhistory = false
          //歌曲
          axios({
            url:'http://localhost:3000/cloudsearch',
            method:'get',
            params:{
              keywords:this.query,
              limit:5
            }
          }).then(res=>{
            this.searchMuisc = res.data.result.songs
            if(this.searchMuisc){
              this.showmusic = true
            }
          })
          //歌单
          axios({
            url:'http://localhost:3000/cloudsearch',
            method:'get',
            params:{
              keywords:this.query,
              limit:5,
              type:1000
            }
          }).then(res=>{
            this.searchMuiscList = res.data.result.playlists
            if(this.searchMuiscList){
              this.showmusiclist = true
            }            
          })
          //mv
          axios({
            url:'http://localhost:3000/cloudsearch',
            method:'get',
            params:{
              keywords:this.query,
              limit:5,
              type:1004
            }
          }).then(res=>{
            this.searchMV = res.data.result.mvs
            if(this.searchMV){
              this.showmv = true
            }              
          })
        }, 0);
        }
     }
    },
  }
</script>

<style lang="less" scoped>
.name{
  font-size: 25px;
  margin-top:15px;
  margin-right: 20px;
  margin-left: 20px;
}
.btns {
  width:200px;
  margin:auto 120px auto 100px
}
.btns button{
  margin:13px 10px 8px 10px;
}
.demo-input-suffix{
  position: relative;
  left: 100px;
  width:400px
}
input.el-input__inner{
  border-radius: 50px;
  width:100%
}
.right-box{
  width:28%
}
.logindiv{
  display: flex;
margin-left:auto;
margin-top:5px;
    box-sizing: content-box;
    padding-right: 10px;
    width: 50px;
    height: 50px;
    flex:1
}
.login{
  display: flex;
  height:50px;
  width:50px;
  padding: 10px;
 background-color: rgb(255, 255, 255);
 border: 1px solid #DCDFE6;
 border-radius: 50%;
text-align: center;
line-height: 30px;
text-decoration: none;
font-size: 14px;
margin-left: auto;
color:#00A1D6;
cursor: pointer;
}
.icon-arrow-right{
  margin-right: 10px;
}
.el-input__prefix{
  cursor: pointer;
}
.top-container{
z-index:3
}
.showsearch{
    background-color: #f9f9f9;
    width: 27.5%;
    height: 300px;
    position: absolute;
    top: 10px;
    border-radius: 5px;
    z-index: -1;
    overflow: hidden;
}

.searchmain{
  background-color:#F9F9F9;
  position: relative;
  height: 85%;
  top: 15%;
  box-shadow: 0 0 5px 2px rgb(0 0 0 / 30%);
}
.searchhistory{
  background-color:#F9F9F9;
  height: 35%;
  overflow: hidden;
}
.searchhistory:hover{
  overflow-y:auto ;
}
.searchhot{
  background-color:#f9f9f9;
  display: flex;
  flex-grow: 1;
}
/deep/ .historyname{
display: inline;
list-style-type: none;
background-color: white;
height: 20px;
float: left;
margin-left: 20px;
border-radius: 10px;
line-height: 20px;
text-align: center;
padding:0 0 21px 15px;
margin-top:6px;
border:1px solid #ddd
}
.el-icon-close{
  visibility:hidden;
  padding-right:0
}
.historyname:hover{
  cursor:pointer;
  background-color:rgba(255,255,255);
  color:#00A1D6
}
.historyname:hover .el-icon-close{
  visibility:visible;
  cursor:pointer;
  color:#000000
}
.historyul{
  margin-top:3px
}
.historyname:first-child{
  margin-left: 7px;
}
li{
  list-style-type: none;
}
.hot-item{
    display: flex;
    align-items: center;
    padding: 5px;
}
.hot-item:hover{
  background-color:rgba(240, 191, 76, 0.4)
}
#searchmusicli:hover .playcount{
  display: inline;
}
.hot-index{
    font-size: 20px;
    color: #ec4141;
    margin-right: 15px;
}
.hot-info{
  flex: 1;
  font-size: 12px;
  color: #708090;
}
.hot-right{
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor:pointer
}
.hot-name{
  font-size: 16px;
  margin-right: 15px;
  color: #000;
  text-align: center;
  line-height: 100%;
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
  background: #3d07b9;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(255, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
.playcount{
  display: none;
  color: rgba(0,0,0,0.5);
}
.searchhistory::-webkit-scrollbar{
  width:6px;
  height: 6px;
}
.searchhistory::-webkit-scrollbar-thumb{
  box-shadow: inset 0 0 5px rgb(255, 238, 0);
}
.settingi{
    position: absolute;
    right: 20px;
    font-size: 30px;
    text-align: center;
    line-height: 85%;
    margin: 15px 15px 15px 15px;
}
.settingdiv{
    width: 60px;
    height: 75px;
    background-color: rgb(255,255,255,0);
    position: absolute;
    top: 60px;
    right: 20px;
    overflow:visible;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.settingul{
  background-color:white ;
}

.settingli{
    font-size: 15px;
    height: 50%;
    text-align: center;
    line-height: 200%;
}
.settingli:hover{
  background-color:rgba(168, 160, 160, 0.3) ;
  cursor:pointer
}
</style>
