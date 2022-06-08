import Vue from 'vue'
import App from './App.vue'

// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)

// 导入全局初始化样式
import './assets/index.css'

// 路由整合
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//导入路由配置文件
import routers from '@/router/routerconfig'
const router = new VueRouter({
  routes:routers
})

//配置vue-aplayer
import APlayer from '@moefe/vue-aplayer'
Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: true,
});

//配置全局过滤器
import filters from '@/filters'
Object.keys(filters).forEach(k => { 
  Vue.filter(k,filters[k])
})

//配置moment
import moment from 'moment'
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router
}).$mount('#app')
