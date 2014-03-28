function buildForm(settings, parent) {

    var avail_ct_url = portal_url + '/available_ctypes.json'

    jQuery.getJSON( avail_ct_url, function( data ) {
        var items = [];
        jQuery.each( data, function( key, val ) {
            items.push( "<option value='" + val + "'>" + val + "</option>" );
        });
        var select = jQuery( "<select/>", {
            "class": "ctypes",
            html: items.join( "" )
        });
        select.appendTo(parent);
    });

    var ctypes_enabled = jQuery('<select/>', {
        'id': 'charlimit_ctypes_enabled',
        'class': 'ctypes'
        });
    for(var i = 0; i < settings.length; i++) {
        var obj = settings[i];
        console.log(obj.ctype);
        var e_options = jQuery('<option>', {
            'value': obj.ctype,
            'text': obj.ctype
        });
        e_options.appendTo(ctypes_enabled);
    }
    ctypes_enabled.appendTo(parent);

    var ct_fields = jQuery('<select/>', {
        'class': 'ct_fields',
        'id': 'ct_fields'
    });
    ct_fields.appendTo(parent);

    var low_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'low_threshold',
        'id': 'low_threshold'
    });
    var high_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'high_threshold',
        'id': 'high_threshold'
    });
    
    low_threshold.appendTo(parent);
    high_threshold.appendTo(parent);

    jQuery('body').on('change', '.ctypes', function() {
        var selected = jQuery(this).val();
        var ct_richfields_url = portal_url + '/ct_richfields.json';
        jQuery.ajax({
            type: "POST",
                url: ct_richfields_url,
                data: { ctype:  selected }
            })
            .done(function(data) {
                var fields = jQuery.parseJSON(data);
                var items = [];
                jQuery.each( data, function( key, val ) {
                    items.push( "<option value='" + val + "'>" + val + "</option>" );
                });
                ct_fields.html(items.join( "" ));
          });
    });


}


jQuery(document).ready(function() {
    var textarea = jQuery('textarea[name="tinymcepluginssettings.eea_char_limit"');
    textarea.hide();
    var charlimit_settings = jQuery.parseJSON(textarea.text());
    buildForm(charlimit_settings, textarea.parent());
});
