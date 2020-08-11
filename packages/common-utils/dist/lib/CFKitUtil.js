var CFKitUtil = (function () {
    function CFKitUtil() {
    }
    CFKitUtil.calculateNett = function (gross, percent) {
        var _tax = (1 + (percent * 0.01));
        return CFKitUtil.roundDecimal(gross / _tax);
    };
    CFKitUtil.calculateGross = function (nett, percent) {
        var _tax = (1 + (percent * 0.01));
        return CFKitUtil.roundDecimal(nett * _tax);
    };
    CFKitUtil.roundDecimal = function (value, precision) {
        var x;
        precision = (typeof precision == 'undefined') ? 2 : precision;
        if (value === 0) {
            return 0;
        }
        x = Math.pow(10, precision);
        return Math.round(x * value) / x;
    };
    CFKitUtil.createGUID = function () {
        var guid = (function () {
            var i, c = "89ab", u = [];
            for (i = 0; i < 36; i += 1) {
                u[i] = (Math.random() * 16 | 0).toString(16);
            }
            u[8] = u[13] = u[18] = u[23] = "-";
            u[14] = "4";
            u[19] = c.charAt(Math.random() * 4 | 0);
            return u.join("");
        })();
        return guid;
    };
    CFKitUtil.ODBCDateTimeFormat = function (value) {
        if (!CFKitUtil.isDate(value)) {
            value = CFKitUtil.UNDEFINED_DATE;
        }
        var year = '' + value.getFullYear();
        var month = ("0" + (value.getMonth() + 1)).slice(-2);
        var day = ("0" + value.getDate()).slice(-2);
        var hour = ("0" + value.getHours()).slice(-2);
        var minute = ("0" + value.getMinutes()).slice(-2);
        var second = ("0" + value.getSeconds()).slice(-2);
        var odbcDateTime = "{ts '" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "'}";
        return odbcDateTime;
    };
    CFKitUtil.parseODBCdateTime = function (value) {
        var YMD_DELIMITER = '-';
        var pattern;
        var parts;
        if (value.length == 26) {
            pattern = new RegExp("(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})");
            parts = value.match(pattern);
            return new Date(parseInt(parts[1]), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10), parseInt(parts[4], 10), parseInt(parts[5], 10), parseInt(parts[6], 10));
        }
        pattern = new RegExp("(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{1,2})");
        parts = value.match(pattern);
        return new Date(parseInt(parts[1]), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10), 0, 0, 0);
    };
    CFKitUtil.isDate = function (value) {
        if (Object.prototype.toString.call(value) === '[object Date]') {
            return true;
        }
        return false;
    };
    CFKitUtil.isODBCDateTime = function (value) {
        var YMD_DELIMITER = '-';
        var pattern = new RegExp("(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})");
        var parts = value.match(pattern);
        return parts !== null;
    };
    CFKitUtil.isAPIDateTime = function (value) {
        var parts = value.split("T");
        if (parts.length === 0 || parts.length > 2)
            return false;
        if (parts.length === 2) {
            var time_pattern = new RegExp("\\d{2}:\\d{2}:\\d{2}z{0,1}$");
            if (parts[1].match(time_pattern) === null)
                return false;
        }
        var date_pattern = new RegExp("\\d{4}-\\d{2}-\\d{2}");
        return parts[0].match(date_pattern) !== null;
    };
    CFKitUtil.parseAPIDateTime = function (value) {
        var parts = value.replace('z', '').split("T");
        var _date = parts[0].split('-');
        var dateTime = new Date();
        dateTime.setUTCFullYear(Number(_date[0]));
        dateTime.setUTCMonth(Number(_date[1]) - 1);
        dateTime.setUTCDate(Number(_date[2]));
        if (parts.length === 2) {
            var _time = parts[1].split(':');
            dateTime.setUTCHours(Number(_time[0]));
            dateTime.setUTCMinutes(Number(_time[1]));
            dateTime.setUTCSeconds(Number(_time[2]));
        }
        else {
            dateTime.setUTCHours(0);
            dateTime.setUTCMinutes(0);
            dateTime.setUTCSeconds(0);
        }
        dateTime.setUTCMilliseconds(0);
        return dateTime;
    };
    CFKitUtil.parseApiDatesInObject = function (src) {
        if (src === null)
            return src;
        if (typeof src === 'string') {
            if (CFKitUtil.isAPIDateTime(src)) {
                return CFKitUtil.parseAPIDateTime(src);
            }
            return src;
        }
        if (typeof src !== 'object' || src === null)
            return src;
        if ((src instanceof Object)) {
            for (var _i = 0, _a = Object.entries(src); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                src[key] = CFKitUtil.parseApiDatesInObject(value);
            }
        }
        if ((src instanceof Array)) {
            for (var i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.parseApiDatesInObject(src[i]);
            }
        }
        return src;
    };
    CFKitUtil.createApiDatesInObject = function (src) {
        if (typeof src !== 'object' || src === null)
            return src;
        if (CFKitUtil.isDate(src)) {
            return src.toISOString();
        }
        if ((src instanceof Object)) {
            for (var _i = 0, _a = Object.entries(src); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                src[key] = CFKitUtil.createApiDatesInObject(value);
            }
        }
        if ((src instanceof Array)) {
            for (var i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.createApiDatesInObject(src[i]);
            }
        }
        return src;
    };
    CFKitUtil.parseDatesInObject = function (src) {
        if (src === null)
            return src;
        if (typeof src === 'string') {
            if (CFKitUtil.isODBCDateTime(src)) {
                return CFKitUtil.parseODBCdateTime(src);
            }
            return src;
        }
        if (typeof src !== 'object' || src === null)
            return src;
        if ((src instanceof Object)) {
            for (var _i = 0, _a = Object.entries(src); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                src[key] = CFKitUtil.parseDatesInObject(value);
            }
        }
        if ((src instanceof Array)) {
            for (var i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.parseDatesInObject(src[i]);
            }
        }
        return src;
    };
    CFKitUtil.createODBCDatesInObject = function (src) {
        if (typeof src !== 'object' || src === null)
            return src;
        if (CFKitUtil.isDate(src)) {
            return CFKitUtil.ODBCDateTimeFormat(src);
        }
        if ((src instanceof Object)) {
            for (var _i = 0, _a = Object.entries(src); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                src[key] = CFKitUtil.createODBCDatesInObject(value);
            }
        }
        if ((src instanceof Array)) {
            for (var i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.createODBCDatesInObject(src[i]);
            }
        }
        return src;
    };
    CFKitUtil.UNDEFINED_DATE = new Date(1900, 0, 1, 0, 0, 0, 0);
    return CFKitUtil;
}());
export { CFKitUtil };