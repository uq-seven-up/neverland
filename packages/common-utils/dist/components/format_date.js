"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = function (value) {
    if (typeof value.getMonth === "function") {
        return (value.getDate() + "/" + (value.getMonth() + 1) + "/" + value.getFullYear());
    }
    else {
        var newDate = new Date();
        return (newDate.getDate() +
            "/" +
            (newDate.getMonth() + 1) +
            "/" +
            newDate.getFullYear());
    }
};
exports.default = exports.formatDate;
