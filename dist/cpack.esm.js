/*!
* @autopack/cpack with v1.0.3
* Author: yanpanmichael
* Built on 2023-07-27, 23:58:47
* Released under the MIT License Copyright (c) 2023
*/
import { __decorate } from 'tslib';
import _ from 'lodash';

function B() {
    var name = _.assign({}, { name: 'test' });
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
    ], Man.prototype, "init", null);
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
var index = B();

export { c, index as default, tony };
//# sourceMappingURL=cpack.esm.map
