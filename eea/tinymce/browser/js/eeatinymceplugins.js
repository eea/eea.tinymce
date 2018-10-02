if(window.eeatinymceplugins === undefined){
  var eeatinymceplugins = {
    "name": "EEA TinyMCE Plugins",
    "settings": {}
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith#Polyfill
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}

var base_url = (jQuery('body').data('base-url') || jQuery('base').attr('href') || window.location.href || "").split("portal_factory")[0];
var tinymceplugins_json = base_url.endsWith('/') ? base_url + "tinymceplugins.json": base_url + "/tinymceplugins.json";

jQuery.getJSON(tinymceplugins_json, function( data ) {
    eeatinymceplugins.settings = data;
});
