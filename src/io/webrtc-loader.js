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

import Log from '../utils/logger';
import {BaseLoader, LoaderStatus, LoaderErrors} from './loader';
import {RuntimeException} from '../utils/exception';

// For FLV over WebSocket live stream
class webRtcLoader extends BaseLoader {

    static isSupported() {
        try {
            return (typeof Peer !== 'undefined');
        } catch (e) {
            return false;
        }
    }

    constructor() {
        super('webrtc-loader');
        this.TAG = 'webRtcLoader';
        this.dataSource = {};
        this._needStash = true;
        this._conn = null;
        this._wrtc = null;
        this._requestAbort = false;
        this._receivedLength = 0;
    }

    destroy() {
        if (this._wrtc) {
            this.abort();
        }
        super.destroy();
    }

    open(dataSource) {
        try {
            this.dataSource = dataSource;
            let _wrtc = this._wrtc = new Peer();
            _wrtc.binaryType = 'arraybuffer';

            // _wrtc.on('open', function(id) {
            //   console.log('My peer ID is: ' + id);
            //   console.log(dataSource.url)
            //   let conn =  _wrtc.connect(dataSource.url);
            //   conn.on('open', function() {
            //     conn.on('data', function(data) {
            //       console.log('Received', data);

            //       this._dispatchArrayBuffer(data.chunk);

            //     });
            //   });
            // });

            _wrtc.on('open',this._onWebRtcOpen.bind(this))
            // _wrtc.onopen = this._onWebRtcOpen.bind(this);
            // _wrtc.onclose = this._onWebSocketClose.bind(this);
            // _wrtc.onmessage = this._onWebSocketMessage.bind(this);
            // _wrtc.onerror = this._onWebSocketError.bind(this);

            

            this._status = LoaderStatus.kConnecting;
        } catch (e) {
            this._status = LoaderStatus.kError;

            let info = {code: e.code, msg: e.message};

            if (this._onError) {
                this._onError(LoaderErrors.EXCEPTION, info);
            } else {
                throw new RuntimeException(info.msg);
            }
        }
    }

    abort() {
        let _wrtc = this._wrtc;
        if (_wrtc && (_wrtc.readyState === 0 || _wrtc.readyState === 1)) {  // CONNECTING || OPEN
            this._requestAbort = true;
            _wrtc.close();
        }

        this._wrtc = null;
        this._status = LoaderStatus.kComplete;
    }

    _onWebRtcOpen(e) {
        console.log("监听链接创建成功")
        this._conn = this._wrtc.connect(this.dataSource.url);
        this._conn.on("open",this._onWebRtcConOpen.bind(this))
        this._conn.on("data",this._onWebRtcConData.bind(this))

    }

    _onWebRtcConOpen(e) {
        this._status = LoaderStatus.kBuffering;
    }
    _onWebRtcConData(e){
        if (e.chunk instanceof ArrayBuffer) {
            if(this._receivedLength==0){
                console.log("加载到的数据",e.chunk)
                const originalArray = new Uint8Array(e.chunk);
                originalArray.set([70, 76, 86, 1],0);
                this._dispatchArrayBuffer(originalArray);
                console.log("加载到的数据",originalArray)
            }else{
                console.log("加载到的数据",e.chunk)
                this._dispatchArrayBuffer(e.chunk);
                console.log("加载到的数据",e.chunk)
            }
           
        }
    }

    _onWebSocketClose(e) {
        if (this._requestAbort === true) {
            this._requestAbort = false;
            return;
        }

        this._status = LoaderStatus.kComplete;

        if (this._onComplete) {
            this._onComplete(0, this._receivedLength - 1);
        }
    }

    _onWebSocketMessage(e) {
        if (e.data instanceof ArrayBuffer) {
            this._dispatchArrayBuffer(e.data);
        } else if (e.data instanceof Blob) {
            let reader = new FileReader();
            reader.onload = () => {
                this._dispatchArrayBuffer(reader.result);
            };
            reader.readAsArrayBuffer(e.data);
        } else {
            this._status = LoaderStatus.kError;
            let info = {code: -1, msg: 'Unsupported WebSocket message type: ' + e.data.constructor.name};

            if (this._onError) {
                this._onError(LoaderErrors.EXCEPTION, info);
            } else {
                throw new RuntimeException(info.msg);
            }
        }
    }

    _dispatchArrayBuffer(arraybuffer) {
        let chunk = arraybuffer;
        let byteStart = this._receivedLength;
        this._receivedLength += chunk.byteLength;

        if (this._onDataArrival) {
            this._onDataArrival(chunk, byteStart, this._receivedLength);
        }
    }

    _onWebSocketError(e) {
        this._status = LoaderStatus.kError;

        let info = {
            code: e.code,
            msg: e.message
        };

        if (this._onError) {
            this._onError(LoaderErrors.EXCEPTION, info);
        } else {
            throw new RuntimeException(info.msg);
        }
    }

}

export default webRtcLoader;