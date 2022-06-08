// 导入对应的路由
import discovery from '@/views/01.discovery.vue'
import playlists from '@/views/02.playlists.vue'
import songs from '@/views/03.songs.vue'
import mvs from '@/views/04.mvs.vue'
import result from '@/views/05.result.vue'
import list from '@/views/06.playlist.vue'  
import mv from '@/views/07.mv.vue'
import user from '@/views/10.user.vue'
import lovemusic from '@/views/11.lovemusic.vue'

export default [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    // 发现音乐
    path: '/discovery',
    component: discovery
  },
  {
    // 推荐歌单
    path: '/playlists',
    component: playlists
  },
  {
    // 歌单详情
    path: '/playlist',
    component: list
  },
  {
    // 最新音乐
    path: '/songs',
    component: songs
  },
  {
    // 最新音乐
    path: '/mvs',
    component: mvs
  },
  // mv详情
  {
    path: '/mv',
    component: mv
  },
  // 搜索结果页
  {
    path: '/result',
    component: result
  },
  //用户页面
  {
    path: '/user',
    component:user
  },
  //喜欢的音乐
  {
    path: '/lovemusic',
    component:lovemusic
  },
]
