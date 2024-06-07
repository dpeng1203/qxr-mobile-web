const onShareAppMessage = ()=> {
  // const promise = new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve({
  //       title: '自定义转发标题'
  //     })
  //   }, 2000)
  // })
  return {
    title: '云趣信联',
    path: 'pages/login/index',
  }
}
const onShareTimeline = ()=>{
  return {
      title: '云趣信联',
      path: 'pages/login/index',
    }
}

module.exports = {
  onShareAppMessage,
  onShareTimeline
}