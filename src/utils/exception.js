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
// 构造异常消息处理类
export class RuntimeException {

    constructor(message) {
        this._message = message;
    }

    get name() {
        return 'RuntimeException';
    }

    get message() {
        return this._message;
    }

    toString() {
        return this.name + ': ' + this.message;
    }

}

/** 非法数据异常信息抛出 */
export class IllegalStateException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'IllegalStateException';
    }

}
/** 参数错误异常信息抛出 */
export class InvalidArgumentException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'InvalidArgumentException';
    }

}
/** 具体方法为实现异常信息抛出 */
export class NotImplementedException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'NotImplementedException';
    }

}
