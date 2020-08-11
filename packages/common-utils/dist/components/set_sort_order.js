"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSortOrder = function (field, value, fieldList) {
    console.log("fieldlist:", fieldList);
    var objIndex = fieldList.fieldList.findIndex(function (obj) { return obj.name === field; });
    fieldList.fieldList[objIndex].sort.selected = value;
    return (fieldList);
};
exports.default = exports.setSortOrder;
