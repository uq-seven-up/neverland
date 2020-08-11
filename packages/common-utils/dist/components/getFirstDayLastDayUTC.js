export var getFirstDayLastDayUTC = function (value) {
    var fDay = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
    var month = fDay.getUTCMonth();
    month = month + 1;
    var lDay = new Date(fDay.getUTCFullYear(), month, 1);
    return { firstDay: fDay, lastDay: lDay };
};
export default getFirstDayLastDayUTC;