let palyVideo = '';
let mediaSource = '';
let mediaSourceUrl = '';
let allStashBufferArr = [];
const mineCodes = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
// 初始化Video标签
let initVideoTag = function(){
  let video = document.querySelector('#lwVideo');
  if(video){
    palyVideo = video
    return true;
  }else{
    return false;
  }
}

// 检测当前浏览器是否支持MediaSource
let checkSupport = function(){
  if (window.MediaSource && MediaSource.isTypeSupported(mineCodes)) { 
    return true;
  } else {
    console.log("The Media Source Extensions API is not supported.")
    return false;
  }
}

// 初始化mediaSource
let createMediaSource = function(){
    /** 生成一个MediaSource */
    mediaSource = new window.MediaSource();
    /** 生成一个VideoUrl */
    mediaSourceUrl = window.URL.createObjectURL(mediaSource);
    /** video播放标签赋值播放地址 */
    palyVideo.src = mediaSourceUrl;
    /** 添加源数据监听方法 */
    // mediaSource.addEventListener('sourceopen', sourceOpen); 
    // let sourceBuffer = mediaSource.addSourceBuffer(mineCodes);
    return mediaSource
}

// 创建播放器方法
let lwFlv = function(){
  if(initVideoTag()&&checkSupport()){
    return createMediaSource();
  }
}
// lwFlv();




function sourceOpen(e) {
  console.log("12312312313123123")
  console.log(e)
  // URL.revokeObjectURL 主动释放引用
  URL.revokeObjectURL(video.src);
  // addSourceBuffer根据传入的mineCodes，创建一个新的 SourceBuffer 并添加到 MediaSource 的 SourceBuffers 列表
  
  sourceBuffer.appendBuffer(arrayBuffer); 
  // var videoUrl = 'video.mp4';
  // fetch(videoUrl)
  //   .then(function(response) {
  //     return response.arrayBuffer();
  //   })
  //   .then(function(arrayBuffer) {
  //     sourceBuffer.addEventListener('updateend', function(e) {
  //       if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
  //         // 数据添加完毕后，调用endOfStream结束当前流
  //         mediaSource.endOfStream(); 
  //       }
  //     });
  //     // 将媒体数据添加到sourceBuffer中
  //     sourceBuffer.appendBuffer(arrayBuffer); 
  //   });
}
