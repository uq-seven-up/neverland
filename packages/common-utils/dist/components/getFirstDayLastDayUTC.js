"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstDayLastDayUTC = void 0;
exports.getFirstDayLastDayUTC = function (value) {
    var fDay = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
    var month = fDay.getUTCMonth();
    month = month + 1;
    var lDay = new Date(fDay.getUTCFullYear(), month, 1);
    return { firstDay: fDay, lastDay: lDay };
};
exports.default = exports.getFirstDayLastDayUTC;
