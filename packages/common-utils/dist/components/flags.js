"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFlagSet = void 0;
exports.isFlagSet = function (value, flag) {
    if (value & flag) {
        return true;
    }
    return false;
};
exports.default = exports.isFlagSet;
