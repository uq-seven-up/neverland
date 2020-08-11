export var isFlagSet = function (value, flag) {
    if (value & flag) {
        return true;
    }
    return false;
};
export default isFlagSet;