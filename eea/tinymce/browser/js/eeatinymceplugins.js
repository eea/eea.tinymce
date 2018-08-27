if(window.eeatinymceplugins === undefined){
  var eeatinymceplugins = {
    "name": "EEA TinyMCE Plugins",
    "settings": {}
  };
}

var base_url = (jQuery('body').data('base-url') || jQuery('base').attr('href') || window.location.href || "").split("portal_factory")[0];
var tinymceplugins_json = base_url.endsWith('/') ? base_url + "tinymceplugins.json": base_url + "/tinymceplugins.json";

jQuery.getJSON(tinymceplugins_json, function( data ) {
    eeatinymceplugins.settings = data;
});
