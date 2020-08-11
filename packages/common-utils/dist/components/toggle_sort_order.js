"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSortOrder = function (field, fieldList) {
    var objIndex = fieldList.fieldList.findIndex(function (obj) { return obj.name === field; });
    if (fieldList.fieldList[objIndex].sort.order === "asc") {
        fieldList.fieldList[objIndex].sort.order = "desc";
    }
    else {
        fieldList.fieldList[objIndex].sort.order = "asc";
    }
    return fieldList.fieldList[objIndex].sort.order;
};
exports.default = exports.toggleSortOrder;
