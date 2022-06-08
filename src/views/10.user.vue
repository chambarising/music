<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="user.pic" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title" style="font-size: 25px;font-weight: 700;">{{user.name}}</p>
        <i class="el-icon-edit" @click="tomodfy"><span class="editmsg">修改信息</span></i>
        <div class="desc-wrap" style="margin-top: 50px;">
          <span class="title" >个人简介:</span>
          <span class="desc">
            {{user.bid?user.bid:'暂无简介'}}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'playlist',
  data() {
    return {
      activeIndex: '1',
      // 总条数
      total: 0,
      // 页码
      page: 1,
      user:{}
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getuser(){
      let userlist = JSON.parse(localStorage.getItem('user'))
      this.user = userlist
    },
    tomodfy(){
      this.$router.push('/modfy')
    }
  },
  created(){
    this.getuser()
  }
};
</script>

<style scoped>
.tab-content{
  margin-top: 20px;
}
.items{
  display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.item{
      width: 200px;
    margin: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}
.img-wrap{
  position: relative;
}
.num-wrap{
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
.img-wrap:hover .num-wrap{
  transform: translateY(0)
}
.musiclistimg{
  width: 200px;
    height: 200px;
    border-radius: 5px;
}
span.iconfont{
  position: absolute;
    right: 10px;
    bottom: 13px;
    width: 40px;
    height: 40px;
    color: #dd6d60;
    font-size: 20px;
    border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    opacity: 0;
}
.img-wrap:hover .iconfont {
  opacity: 1;
}
.name{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 14px;
}
.el-icon-edit{
  position: absolute;
    top: 115px;
    right: 150px;
    border: 1px solid rgba(0,0,0,0.3);
    border-radius: 50px;
    padding: 5px;
    cursor: pointer;
}
.el-icon-edit:hover{
  background-color:#f0ecec
}
.editmsg{
  margin-left: 10px;
}
</style>


