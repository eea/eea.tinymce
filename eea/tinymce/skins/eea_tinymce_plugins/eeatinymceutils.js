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
    var missing_settings_message;
    var msg;
    if (!window.eeatinymceplugins) {
        (function(){
            missing_settings_message = "Couldn't load tinymceplugins.json";
            msg = window.console ? window.console.log(missing_settings_message) :
                             window.alert(missing_settings_message);
            return false;
        }());
    }
    return true;
};

function add_tinymce_table_row(parent_id, elem) {
    var parent = jQuery('#' + parent_id);
    var tiny_table = parent.find(jQuery('.mceLayout'));

    tiny_table.find('tr[class="mceFirst"]').after(elem);
}

window.EEATinyMCEUtils = {
    "version": 1.0,
    'debounce': debounce,
    'hasEEATinyMCESettings': hasEEATinyMCESettings,
    'add_tinymce_table_row': add_tinymce_table_row
};
