"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatByType = function (type, value) {
    switch (type) {
        case "uppercase":
            return value.toUpperCase();
        case "currency":
            return formatCurrency.format(value);
        default:
            return value;
    }
};
var formatCurrency = new Intl.NumberFormat("en-AU", {
    style: "decimal",
    currency: "AUD",
    minimumFractionDigits: 2
});
exports.default = formatByType;
