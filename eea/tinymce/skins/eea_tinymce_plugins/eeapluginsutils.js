//http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
var debounce = function (func, threshold, execAsap) {
    var timeout;

    var obj = this;
    return function debounced () {

        function delayed () {
            if (!execAsap) {
                func.apply(obj, arguments);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        else if (execAsap) {
            func.apply(obj, arguments);
        }
        timeout = setTimeout(delayed, threshold || 100);
    };

};

var hasEEATinyMCESettings = function() {
    var eeatinymceplugins = window.eeatinymceplugins || "";
    var missing_settings_message;
    var msg;
    if (!eeatinymceplugins) {
        (function(){
            missing_settings_message = "Couldn't load tinymceplugins.json";
            msg = window.console ? window.console.log(missing_settings_message) :
                             window.alert(missing_settings_message);
            return false;
        }());
    }
    return true;
};

window.EEAPluginsUtils = {
    "version": 1.0,
    'debounce': debounce,
    'hasEEATinyMCESettings': hasEEATinyMCESettings
};
