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
/** 兜底机制信息 */
import Polyfill from './utils/polyfill.js';
/** flv.js 的特性信息 */
import Features from './core/features.js';
/** ioLoader方法 基础加载、加载状态、加载错误 */
import {BaseLoader, LoaderStatus, LoaderErrors} from './io/loader.js';
/** flv播放器实例 */
import FlvPlayer from './player/flv-player.js';
/** 本地播放器实例 */
import NativePlayer from './player/native-player.js';
/** 播放器事件 */
import PlayerEvents from './player/player-events.js';
/** 播放器错误类型 和 错误详情 */
import {ErrorTypes, ErrorDetails} from './player/player-errors.js';
/** 日志控制方法 */
import LoggingControl from './utils/logging-control.js';
/** 日志错误信息 */
import {InvalidArgumentException} from './utils/exception.js';


// install polyfills
// 转义es6方法 使用兜底到es5
Polyfill.install();


// 播放器构建方法 需要传入meiaDataSource配置信息 和 其他配置信息
function createPlayer(mediaDataSource, optionalConfig) {
    let mds = mediaDataSource;
    // 检测播放器配置信息是否存在
    if (mds == null || typeof mds !== 'object') {
        throw new InvalidArgumentException('MediaDataSource must be an javascript object!');
    }
    // 检测播放器配置信息是否存在"type"类型字段
    if (!mds.hasOwnProperty('type')) {
        throw new InvalidArgumentException('MediaDataSource must has type field to indicate video file type!');
    }
    // 检测媒体播放类型
    switch (mds.type) {
        case 'flv':
            // 如果类型为flv方法则初始化flv方法
            return new FlvPlayer(mds, optionalConfig);
        default:
            // 如果类型不是flv方法则初始化本地播放方法
            return new NativePlayer(mds, optionalConfig);
    }
}


// 判断浏览器是否支持flv
function isSupported() {
    return Features.supportMSEH264Playback();
}

// 获取核心特性信息
function getFeatureList() {
    return Features.getFeatureList();
}


// 初始化flvjs对象信息
let flvjs = {};

// 创建播放器方法
flvjs.createPlayer = createPlayer;
// 判断浏览器是否支持flv播放
flvjs.isSupported = isSupported;
// 查询flvjs的核心特性
flvjs.getFeatureList = getFeatureList;
// flvjs的基础加载方法
flvjs.BaseLoader = BaseLoader;
flvjs.LoaderStatus = LoaderStatus;
flvjs.LoaderErrors = LoaderErrors;

flvjs.Events = PlayerEvents;
flvjs.ErrorTypes = ErrorTypes;
flvjs.ErrorDetails = ErrorDetails;

flvjs.FlvPlayer = FlvPlayer;
flvjs.NativePlayer = NativePlayer;
flvjs.LoggingControl = LoggingControl;

// flv对象上添加版本信息属性
Object.defineProperty(flvjs, 'version', {
    enumerable: true,
    get: function () {return __VERSION__;}
});

export default flvjs;