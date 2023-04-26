/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// 默认配置信息
export const defaultConfig = {
    /** 是否启用分离线程进行传输 */
    enableWorker: false,
    /** 启用IO隐藏缓冲区。如果您需要实时(最小延迟)的直播流播放设置为false，但如果有网络抖动可能会停止。 */
    enableStashBuffer: true,
    /** 指示IO隐藏缓冲区的初始大小。默认值是384KB。指出合适的大小可以改善视频加载/寻道时间。 */
    stashInitialSize: undefined,
    /** 与MediaDataSource中的isLive相同，如果在MediaDataSource结构中设置，则忽略。 是否为直播流 */
    isLive: false,
    /** 如果有足够的数据用于回放，则中止http连接。 */
    lazyLoad: true,
    /** 指示要为lazyLoad保留多少秒的数据。 */
    lazyLoadMaxDuration: 3 * 60,
    /** 以秒为单位的lazyLoad恢复时间边界。 */
    lazyLoadRecoverDuration: 30,
    /** 在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的选项卡可能不会触发sourceopen事件，直到切换到该选项卡。 */
    deferLoadAfterSourceOpen: true,
    /** 为SourceBuffer做自动清理吗 */
    // autoCleanupSourceBuffer: default as false, leave unspecified
    /** 向后缓冲区持续时间超过此值(以秒为单位)时，对SourceBuffer执行自动清理 */
    autoCleanupMaxBackwardDuration: 3 * 60,
    /** 指示在执行自动清理时为向后缓冲区保留的持续时间(以秒为单位)。 */
    autoCleanupMinBackwardDuration: 2 * 60,
    /** 静态资源信息报告定时器 */
    statisticsInfoReportInterval: 600,
    /** 当检测到较大的音频时间戳间隙时，填充无声音频帧以避免a/v不同步。 */
    fixAudioTimestampGap: true,
    /** 准确的寻道到任何帧，不局限于视频IDR帧，但可能会慢一点。适用于Chrome bbbb50, FireFox和Safari。 */
    accurateSeek: false,
    /** 'range'使用范围请求来查找，或'param'在url中添加参数来指示请求范围。 */
    seekType: 'range',  // [range, param, custom]
    /** 表示为seekType = 'param'指定查找开始参数名称 */
    seekParamStart: 'bstart',
    /** 表示为seekType = 'param'指定查找结束参数名称 */
    seekParamEnd: 'bend',
    /** 发送范围:字节=0-如果使用范围查找，第一次加载 */
    rangeLoadZeroStart: false,
    /** 自定义寻求逻辑是的回调函数 */
    customSeekHandler: undefined,
    /** 重用301/302重定向url的后续请求，如寻求，重新连接等。 */
    reuseRedirectedURL: false,
    // referrerPolicy: leave as unspecified
    headers: undefined,
    customLoader: undefined
};

export function createDefaultConfig() {
    return Object.assign({}, defaultConfig);
}