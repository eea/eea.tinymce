if(window.eeatinymceplugins === undefined){
  var eeatinymceplugins = {
    "name": "EEA TinyMCE Plugins",
    "settings": {}
  };
}

jQuery.getJSON("/www/tinymceplugins.json", function( data ) {
    eeatinymceplugins.settings = data;
});
