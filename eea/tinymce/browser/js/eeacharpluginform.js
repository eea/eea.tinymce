/* global portal_url, document */

function populateThresholds(settings, ct, field) {
    jQuery.each(settings, function(idx, option) {

        if (option.ctype === ct) {
            jQuery.each(option.settings, function(key, val) {
                
                if (val.fieldname === field) {
                    jQuery('#low_threshold').val(val.low_threshold);
                    jQuery('#high_threshold').val(val.high_threshold);
                    return false;
                } else {
                    jQuery('#low_threshold').val('');
                    jQuery('#high_threshold').val('');
                }
            });
            return false;
        } else {
             jQuery('#low_threshold').val('');
             jQuery('#high_threshold').val('');
        }
    });
}

function populateCtypesEnabled(settings, ctypes_enabled_select) {
    ctypes_enabled_select.html('');

    for(var i = 0; i < settings.length; i++) {
        var obj = settings[i];
        var e_options = jQuery('<option>', {
            'value': obj.ctype,
            'text': obj.ctype
        });
        e_options.appendTo(ctypes_enabled_select);
    }
}

function validate_thresholds(low_threshold, high_threshold) {
    var low_error = jQuery('#low_threshold_error');
    var high_error = jQuery('#high_threshold_error');
    if (!low_threshold || !high_threshold) {
        return null;
    }
    if (isNaN(parseInt(low_threshold, 10))) {
        low_error.text('Invalid low threshold value')
                 .show();
        return false;
    }
    low_error.hide();
    if (isNaN(parseInt(high_threshold, 10))) {
        high_error.text('Invalid high threshold value')
                  .show();
        return false;
    }
    high_error.hide();
    return true;
}

function deleteSetting(settings, ctype, field) {
    var low_threshold = jQuery('#low_threshold');
    var high_threshold = jQuery('#high_threshold');
    var low_threshold_val = low_threshold.val();
    var high_threshold_val = high_threshold.val();
    var status_text = jQuery('#status_text');
    if (low_threshold_val !== '' && high_threshold_val !== '') {
        jQuery.each(settings, function(idx, option) {
            if (option.ctype === ctype) {
                jQuery.each(option.settings, function(key, val) {
                        if (val.fieldname === field) {
                            option.settings.splice(key, 1);
                        }
                });
            }
            if (option.settings.length <= 0) {
                settings.splice(idx, 1);
            }
        });
        jQuery("[id='tinymcepluginssettings.eea_char_limit']").text(JSON.stringify(settings));
        low_threshold.val('');
        high_threshold.val('');
        status_text.text('Value removed')
                   .show();
        
        var ctypes_enabled = jQuery('#charlimit_ctypes_enabled');
        populateCtypesEnabled(settings, ctypes_enabled);
    }
}

function updateSettings(settings) {
    var low_threshold = jQuery('#low_threshold').val();
    var high_threshold = jQuery('#high_threshold').val();
    var status_text = jQuery('#status_text');
    var ct_fields = jQuery('#ct_fields');
    if (validate_thresholds(low_threshold, high_threshold) !== false) {
        var ctype = ct_fields.attr('data-ct');
        var field = ct_fields.val();
        var field_setting = false;
        var ctype_setting = false;
        var ct_setting = {ctype: ctype, settings: [
                    {fieldname: field,
                     low_threshold: low_threshold,
                     high_threshold: high_threshold }
                     ]};

        jQuery.each(settings, function(idx, option) {
            if (option.ctype === ctype) {
                jQuery.each(option.settings, function(key, val) {
                    if (val.fieldname === field) {
                        val.low_threshold = low_threshold;
                        val.high_threshold = high_threshold;
                        field_setting = false;
                        return field_setting;
                    } else {
                        field_setting = {
                            fieldname: field,
                            low_threshold: low_threshold,
                            high_threshold: high_threshold
                        };
                    }
                });
                if (field_setting !== false) {
                    option.settings.push(field_setting);
                }
                ctype_setting = false;
                return ctype_setting;
            } else {
                ctype_setting = ct_setting;
            }
        });

        if (settings.length <= 0) {
            ctype_setting = ct_setting;
        }

        if ((ctype_setting !== false)) {
            settings.push(ctype_setting);
        }

        jQuery("[id='tinymcepluginssettings.eea_char_limit']").text(JSON.stringify(settings));
        status_text.text('Settings updated')
                   .show();

        var ctypes_enabled = jQuery('#charlimit_ctypes_enabled');
        populateCtypesEnabled(settings, ctypes_enabled);
    }
}

function populateCtypesAvailable(avail_ct_select) {
    var avail_ct_url = portal_url + '/available_ctypes.json';

    jQuery.getJSON( avail_ct_url, function(data) {
        var items = [];
        jQuery.each( data, function(key, val) {
            items.push( "<option value='" + val + "'>" + val + "</option>" );
        });
        avail_ct_select.html(items.join(''));
    });

}

function buildForm(settings, parent) {
    var self = this;
    var body = $('body');
    self.settings = settings;

    var label_avail_ct = jQuery('<label/>', {
        'for': 'avail_ct_select',
        'text': 'Available Content Types:'
    });
    label_avail_ct.appendTo(parent);

    var avail_ct_select = jQuery('<select/>', {
        'class': 'ctypes',
        'id': 'avail_ct_select',
        html: ''
    });
    avail_ct_select.appendTo(parent);
    parent.append('<br />');

    populateCtypesAvailable(avail_ct_select);

    var label_enabled_ct = jQuery('<label/>', {
        'for': 'charlimit_ctypes_enabled',
        'text': 'Charlimit enabled for:'
    });
    label_enabled_ct.appendTo(parent);

    var ctypes_enabled = jQuery('<select/>', {
        'id': 'charlimit_ctypes_enabled',
        'class': 'ctypes'
        });

    populateCtypesEnabled(settings, ctypes_enabled);
    ctypes_enabled.appendTo(parent);
    parent.append('<br />');

    var label_rich_fields = jQuery('<label/>', {
        'for': 'ct_fields',
        'text': 'Available rich fields:'
    });
    label_rich_fields.appendTo(parent);

    var ct_fields = jQuery('<select/>', {
        'class': 'ct_fields',
        'id': 'ct_fields'
    });
    ct_fields.appendTo(parent);
    parent.append('<br />');

    var label_low_threshold = jQuery('<label/>', {
        'for': 'low_threshold',
        'text': 'Low threshold:'
    });
    
    var low_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'low_threshold',
        'id': 'low_threshold'
    });
    var low_threshold_error = jQuery('<span/>', {
        'class': 'eea-icon error',
        'id': 'low_threshold_error'
    });
    var label_high_threshold = jQuery('<label/>', {
        'for': 'high_threshold',
        'text': 'High threshold:'
    });

    var high_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'high_threshold',
        'id': 'high_threshold'
    });
    var high_threshold_error = jQuery('<span/>', {
        'class': 'eea-icon error',
        'id': 'high_threshold_error'
    });

    label_low_threshold.appendTo(parent);
    low_threshold.appendTo(parent);
    low_threshold_error.appendTo(parent);
    low_threshold_error.hide();
    parent.append('<br />');
    
    label_high_threshold.appendTo(parent);
    high_threshold.appendTo(parent);
    high_threshold_error.appendTo(parent);
    high_threshold_error.hide();

    var label_readability = jQuery('<label/>', {
        'for': 'readability_checker',
        'text': 'Enable readability statistics?'
    });
    var readability_checker = jQuery('<input/>', {
        'type': 'checkbox',
        'name': 'readability_checker',
        'id': 'readability_checker'
    });
    parent.append('<br />');

    label_readability.appendTo(parent);
    readability_checker.appendTo(parent);

    body.on('focus change', '.ctypes', function() {
        var selected = jQuery(this).val();
        var ct_richfields_url = portal_url + '/ct_richfields.json';
        jQuery.ajax({
            type: 'POST',
                url: ct_richfields_url,
                data: { ctype:  selected }
            })
            .done(function(data) {
                var items = [];

                jQuery.each( data, function( key, val ) {
                    items.push( "<option value='" + val + "'>" + val + "</option>" );
                });

                ct_fields.html(items.join( "" ));
                ct_fields.attr('data-ct', selected);
                var field = ct_fields.val();

                label_rich_fields.text('Available rich fields for ' + selected + ':');
                populateThresholds(self.settings, selected, field);
                status_text.hide();
          });
    });

    body.on('focus change', '#ct_fields', function() {
        var ct = ct_fields.attr('data-ct');
        var field = ct_fields.val();
        populateThresholds(self.settings, ct, field);
        status_text.hide();
    });

    var update_settings = jQuery('<a />', {
        'href': '#'
    });
    var refresh_icon = jQuery('<span />', {
        'class': 'eea-icon eea-icon-refresh',
        'text': 'Update'
    });
    parent.append('<br />');
    refresh_icon.appendTo(update_settings);
    update_settings.appendTo(parent);

    var remove_settings = jQuery('<a />', {
        'href': '#'
    });
    var remove_icon = jQuery('<span />', {
        'class': 'eea-icon eea-icon-trash-o',
        'text': 'Remove'
    });
    remove_icon.appendTo(remove_settings);
    remove_settings.appendTo(parent);

    update_settings.on('click', function(evt) {
        evt.preventDefault();
        updateSettings(settings);
    });

    remove_settings.on('click', function(evt) {
        var ct_fields = jQuery('#ct_fields');
        evt.preventDefault();
        var ctype = ct_fields.attr('data-ct');
        var field = ct_fields.val();
        deleteSetting(settings, ctype, field);
    });

    parent.append('<br />');
    var status_text = jQuery('<span />', {
        'class': 'eea-icon eea-icon-info-circle',
        'id': 'status_text',
        'text': ''
    });
    status_text.appendTo(parent);
    status_text.hide();
}

jQuery(document).ready(function() {
    var textarea = jQuery("[id='tinymcepluginssettings.eea_char_limit']");
    textarea.hide();
    var charlimit_settings = textarea.text() || '[]';
    charlimit_settings = jQuery.parseJSON(charlimit_settings);
    buildForm(charlimit_settings, textarea.parent());
});
