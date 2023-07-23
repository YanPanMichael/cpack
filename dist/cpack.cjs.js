/*!
* @autopack/cpack with v0.0.1
* Author: yanpanmichael
* Built on 2023-07-23, 15:42:37
* Released under the MIT License Copyright (c) 2023
*/
'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _=require('lodash');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var ___default=/*#__PURE__*/_interopDefaultLegacy(_);/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}function B() {
    var name = ___default["default"].assign({}, { name: 'test' });
    console.log('test typescript' + name);
}
function decorateArmour(num) {
    return function (target, descriptor) {
        var method = descriptor.value;
        var moreDef = num || 100;
        var ret;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            args[0] += moreDef;
            ret = method.apply(target, args);
            return ret;
        };
        return descriptor;
    };
}
function addFunc(target) {
    target.prototype.addFunc = function () {
        return 'i am addFunc';
    };
    return target;
}
var Man = /** @class */ (function () {
    function Man(def, atk, hp) {
        if (def === void 0) { def = 2; }
        if (atk === void 0) { atk = 3; }
        if (hp === void 0) { hp = 3; }
        this.def = 0;
        this.atk = 0;
        this.hp = 0;
        this.init(def, atk, hp);
    }
    Man.prototype.init = function (def, atk, hp) {
        this.def = def; // 防御值
        this.atk = atk; // 攻击力
        this.hp = hp; // 血量
    };
    Man.prototype.toString = function () {
        return "\u9632\u5FA1\u529B:".concat(this.def, ",\u653B\u51FB\u529B:").concat(this.atk, ",\u8840\u91CF:").concat(this.hp);
    };
    __decorate([
        decorateArmour(20)
    ], Man.prototype, "init");
    Man = __decorate([
        addFunc
    ], Man);
    return Man;
}());
var C = /** @class */ (function () {
    function C() {
        this.a = 'ttt';
    }
    return C;
}());
var c = new C();
var tony = new Man();
console.log("\u5F53\u524D\u72B6\u6001 ===> ".concat(tony));
// 输出：当前状态 ===> 防御力:102,攻击力:3,血量:3
var index = B();exports.c=c;exports["default"]=index;exports.tony=tony;