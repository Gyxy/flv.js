let palyVideo = '';
let mediaSource = '';
let mediaSourceUrl = '';
var lwSourceBuffer = null
let lwSourceBufferObj = {
  audio:'',
  video:''
}
let allStashBufferArr = [];
let firstAppend = true

let videoType = '';
let audioType = '';
let hadPending = false;

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
    mediaSource.addEventListener('sourceopen', sourceOpen); 
    return mediaSource
}

// 创建播放器方法
let initPlayer = function(segment){
  if(initVideoTag()){
    return createMediaSource(segment);
  }
}

function sourceOpen(e) {
  lwSourceBufferObj['video'] = mediaSource.addSourceBuffer(videoType); 
  lwSourceBufferObj['audio'] = mediaSource.addSourceBuffer(audioType); 
  lwSourceBufferObj['video'].addEventListener('updateend', function() {
    console.log('New media data has been successfully added.');
    toLoadPlay();
  });
  lwSourceBufferObj['audio'].addEventListener('updateend', function() {
    console.log('New media data has been successfully added.');
    toLoadPlay();
  });
  toLoadPlay();
}



// 添加最新的buffer数据
function toAppendAllBuffer(segment){
  allStashBufferArr.push(segment);
  if(segment.segment.type=='video'&&segment.segment.codec&&segment.segment.container){
    videoType = `${segment.segment.container};codecs=${segment.segment.codec}`
  }
  if(segment.segment.type=='audio'&&segment.segment.codec&&segment.segment.container){
    audioType = `${segment.segment.container};codecs=${segment.segment.codec}`
  }

  if(videoType&&audioType){
    if(firstAppend){
      hadPending = true;
      firstAppend = false;
      initPlayer();
    }else if(!hadPending){
      toLoadPlay();
    }
  }
}

function toLoadPlay(){
  let segment = allStashBufferArr.shift();
  if(segment){
    if(segment&&segment.segment&&segment.segment.type=='video'){
      lwSourceBufferObj['video'].appendBuffer(segment.buffer)
    }
    if(segment&&segment.segment&&segment.segment.type=='audio'){
      lwSourceBufferObj['audio'].appendBuffer(segment.buffer)
    }
  }else{
    hadPending = false;
  }
  
  // lwSourceBufferObj[segment.segment.type].appendBuffer(segment.buffer)
  // lwSourceBuffer.appendBuffer(buffer)
}

// let lwInit = function(){
//   return {
//     initPlayer:initPlayer,
//     toAppendAllBuffer:toAppendAllBuffer,
//     toLoadPlay:toLoadPlay,
//   }
// }

