//配置全局过滤器
exports.time = (item)=>{
  //处理时长显示
    //假设 1000000ms
    //秒 1000000/1000 1000秒
    //分 1000/60
    //秒 1000%60
    let min = parseInt(item/1000/60)
    if(min<10){
      min = '0'+min
    }
    let sec = parseInt(item/1000%60)
    if(sec<10){
      sec = '0'+sec
    }
    return `${min}:${sec}`
}


