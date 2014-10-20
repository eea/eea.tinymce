/* global portal_url, document */

var EEACharPluginForm = { 'version': 1.1 };

EEACharPluginForm.populateThresholds = function(settings, ct, field) {
    var self = this;
    jQuery.each(settings, function(idx, option) {

        if (option.ctype === ct) {
            jQuery.each(option.settings, function(key, val) {
                
                if (val.fieldname === field) {
                    self.low_threshold.val(val.low_threshold);
                    self.high_threshold.val(val.high_threshold);
                    return false;
                } else {
                    self.low_threshold.val('');
                    self.high_threshold.val('');
                }
            });
            return false;
        } else {
             self.low_threshold.val('');
             self.high_threshold.val('');
        }
    });
};

EEACharPluginForm.populateCtypesEnabled = function(settings, ctypes_enabled_select) {
    ctypes_enabled_select.html('');

    for(var i = 0; i < settings.length; i++) {
        var obj = settings[i];
        var e_options = jQuery('<option>', {
            'value': obj.ctype,
            'text': obj.ctype
        });
        e_options.appendTo(ctypes_enabled_select);
    }
};

EEACharPluginForm.validate_thresholds = function(low_threshold, high_threshold) {
    if (!low_threshold || !high_threshold) {
        return null;
    }
    if (isNaN(parseInt(low_threshold, 10))) {
        this.low_threshold_error.text('Invalid low threshold value')
                 .show();
        return false;
    }
    this.low_threshold_error.hide();
    if (isNaN(parseInt(high_threshold, 10))) {
        this.high_threshold_error.text('Invalid high threshold value')
                  .show();
        return false;
    }
    this.high_threshold_error.hide();
    return true;
};

EEACharPluginForm.deleteSetting = function(settings, ctype, field) {
    var low_threshold_val = this.low_threshold.val();
    var high_threshold_val = this.high_threshold.val();
    if (low_threshold_val !== '' && high_threshold_val !== '') {
        jQuery.each(settings, function(idx, option) {
            if (option && option.ctype === ctype) {
                jQuery.each(option.settings, function(key, val) {
                        if (val.fieldname === field) {
                            option.settings.splice(key, 1);
                        }
                });
            }
            if (option && option.settings.length <= 0) {
                settings.splice(idx, 1);
            }
        });
        this.$el.text(JSON.stringify(settings));
        this.low_threshold.val('');
        this.high_threshold.val('');
        this.status_text.text('Value removed')
                   .show();
        
        this.populateCtypesEnabled(settings, this.ctypes_enabled);
    }
};

EEACharPluginForm.updateSettings = function(settings) {
    var low_threshold_val = this.low_threshold.val();
    var high_threshold_val = this.high_threshold.val();
    if (this.validate_thresholds(low_threshold_val, high_threshold_val) !== false) {
        var ctype = this.ct_fields.attr('data-ct');
        var field = this.ct_fields.val();
        var field_setting = false;
        var ctype_setting = false;
        var ct_setting = {ctype: ctype, settings: [
                    {fieldname: field,
                     low_threshold: low_threshold_val,
                     high_threshold: high_threshold_val }
                     ]};

        jQuery.each(settings, function(idx, option) {
            if (option.ctype === ctype) {
                jQuery.each(option.settings, function(key, val) {
                    if (val.fieldname === field) {
                        val.low_threshold = low_threshold_val;
                        val.high_threshold = high_threshold_val;
                        field_setting = false;
                        return field_setting;
                    } else {
                        field_setting = {
                            fieldname: field,
                            low_threshold: low_threshold_val,
                            high_threshold: high_threshold_val
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

        this.$el.text(JSON.stringify(settings));
        this.status_text.text('Settings updated')
                   .show();

        this.populateCtypesEnabled(settings, this.ctypes_enabled);
    }
};

EEACharPluginForm.populateCtypesAvailable = function(avail_ct_select) {
    var avail_ct_url = portal_url + '/available_ctypes.json';

    jQuery.getJSON( avail_ct_url, function(data) {
        var items = [];
        jQuery.each( data, function(key, val) {
            items.push( "<option value='" + val + "'>" + val + "</option>" );
        });
        avail_ct_select.html(items.join(''));
    });

};

EEACharPluginForm.buildForm = function(context, settings, parent) {
    var self = this;
    self.$el = context;
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

    self.populateCtypesAvailable(avail_ct_select);

    self.label_enabled_ct = jQuery('<label/>', {
        'for': 'charlimit_ctypes_enabled',
        'text': 'Charlimit enabled for:'
    });
    self.label_enabled_ct.appendTo(parent);

    self.ctypes_enabled = jQuery('<select/>', {
        'id': 'charlimit_ctypes_enabled',
        'class': 'ctypes'
        });

    self.populateCtypesEnabled(settings, self.ctypes_enabled);
    self.ctypes_enabled.appendTo(parent);
    parent.append('<br />');

    self.label_rich_fields = jQuery('<label/>', {
        'for': 'ct_fields',
        'text': 'Available rich fields:'
    });
    self.label_rich_fields.appendTo(parent);

    self.ct_fields = jQuery('<select/>', {
        'class': 'ct_fields',
        'id': 'ct_fields'
    });
    self.ct_fields.appendTo(parent);
    parent.append('<br />');

    self.label_low_threshold = jQuery('<label/>', {
        'for': 'low_threshold',
        'text': 'Low threshold:'
    });
    
    self.low_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'low_threshold',
        'id': 'low_threshold'
    });
    self.low_threshold_error = jQuery('<span/>', {
        'class': 'eea-icon error',
        'id': 'low_threshold_error'
    });
    self.label_high_threshold = jQuery('<label/>', {
        'for': 'high_threshold',
        'text': 'High threshold:'
    });

    self.high_threshold = jQuery('<input/>', {
        'type': 'text',
        'name': 'high_threshold',
        'id': 'high_threshold'
    });
    self.high_threshold_error = jQuery('<span/>', {
        'class': 'eea-icon error',
        'id': 'high_threshold_error'
    });

    self.label_low_threshold.appendTo(parent);
    self.low_threshold.appendTo(parent);
    self.low_threshold_error.appendTo(parent)
        .hide();
    parent.append('<br />');
    
    self.label_high_threshold.appendTo(parent);
    self.high_threshold.appendTo(parent);
    self.high_threshold_error.appendTo(parent)
                        .hide();

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

                self.ct_fields.html(items.join( "" ))
                              .attr('data-ct', selected);
                var field = self.ct_fields.val();

                self.label_rich_fields.text('Available rich fields for ' + selected + ':');
                self.populateThresholds(self.settings, selected, field);
                self.status_text.hide();
          });
    });

    body.on('focus change', '#ct_fields', function() {
        var ct = self.ct_fields.attr('data-ct');
        var field = self.ct_fields.val();
        self.populateThresholds(self.settings, ct, field);
        self.status_text.hide();
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
        self.updateSettings(settings);
    });

    remove_settings.on('click', function(evt) {
        evt.preventDefault();
        var ctype = self.ct_fields.attr('data-ct');
        var field = self.ct_fields.val();
        self.deleteSetting(settings, ctype, field);
    });

    parent.append('<br />');
    self.status_text = jQuery('<span />', {
        'class': 'eea-icon eea-icon-info-circle',
        'id': 'status_text',
        'text': ''
    });
    self.status_text.appendTo(parent);
    self.status_text.hide();
};

jQuery(document).ready(function() {
    var textarea = jQuery("[id='tinymcepluginssettings.eea_char_limit']");
    textarea.hide();
    var charlimit_settings = textarea.text() || '[]';
    charlimit_settings = jQuery.parseJSON(charlimit_settings);
    EEACharPluginForm.buildForm(textarea, charlimit_settings, textarea.parent());
});
