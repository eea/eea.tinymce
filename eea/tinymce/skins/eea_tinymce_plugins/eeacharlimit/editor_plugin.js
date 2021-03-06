/*This plugin is based on Adam Scheller's tinymce count characters plugin:
http://adamscheller.com/tinymce-count-characters-plugin/

This plugin is counting the characters entered in a fiche's RichWidget fields.
In order for the plugin to be active, a javascript object configuration object
needs to be present and the content type, richwidget fields and threshold limits
need to be defined.
 */
/*global jQuery, tinymce, eeatinymceplugins, EEATinyMCEUtils, portal_url */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         'use strict';
         var i, j;
         for (i = (start || 0), j = this.length; i < j; i += 1) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    };
}

(function() {
    'use strict';
    tinymce.create('tinymce.plugins.EEACharLimitPlugin', {
        init : function(ed) {
            var self = this;
            var css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeacharlimit/css/eeacharlimit.css';
            tinymce.DOM.loadCSS(css_url);

            //Update the status_box with the required info
            function status_update(status_box, low_threshold, high_threshold) {
                if (!low_threshold && !high_threshold) {
                    return;
                }
                var message;
                var char_num = self.getCountCharacters();
                var default_text = 'Tot ' + '<span class="charlimit-count">' + char_num + '</span>' + ' characters.';

                if (char_num <= low_threshold) {
                    var under_threshold = low_threshold - char_num;
                    message = ' (' + under_threshold + ' left)';

                    if (status_box.hasClass('charlimit-warn')) {
                        status_box.removeClass('charlimit-warn');
                    }
                    if (status_box.hasClass('charlimit-exceeded')) {
                        status_box.removeClass('charlimit-exceeded');
                    }
                } else if (char_num > low_threshold && char_num <= high_threshold) {
                    message = ' (warning, we aim for ' + low_threshold + ' characters)';

                    if (status_box.hasClass('charlimit-exceeded')) {
                        status_box.removeClass('charlimit-exceeded');
                    }
                    if (!status_box.hasClass('charlimit-warn')) {
                        status_box.addClass('charlimit-warn');
                    }
                } else {
                    var over_threshold = char_num - high_threshold;
                    message = ' (too much text, please remove at least ' +
                                    over_threshold + ' characters)';

                    if (status_box.hasClass('charlimit-warn')) {
                        status_box.removeClass('charlimit-warn');
                    }
                    if (!status_box.hasClass('charlimit-exceeded')) {
                        status_box.addClass('charlimit-exceeded');
                    }
                }

                status_box.html(default_text + message);
            }


            ed.onInit.add(function() {
                if (!EEATinyMCEUtils.hasEEATinyMCESettings()) {
                    return;
                }
                var eeacharlimit_options = eeatinymceplugins.settings.eea_char_limit;
                if (eeacharlimit_options) {
                    eeacharlimit_options = jQuery.parseJSON(eeacharlimit_options);
                    jQuery.each(eeacharlimit_options, function( index, value ) {
                        var body_class = jQuery('body').attr('class');
                        var marker = 'portaltype-' + value.ctype.toLowerCase();
                        var field_id = ed.editorId;
                        var row_id = 'charlimit-row-' + field_id;
                        var field_active = false;
                        var field_settings;

                        //If we're in fullscreen mode, check which field we're editing
                        if (ed.getParam('fullscreen_is_enabled')) {
                            field_id = ed.getParam('fullscreen_editor_id');
                            row_id = 'charlimit-row-' + field_id;
                        }
                        jQuery.each(value.settings, function(key, val) {
                            var value = val[field_id];
                            if (value) {
                                field_active = true;
                                field_settings = value;
                                return false;
                            }
                        });

                        //Check if we should activate for this CT and field
                        if (body_class.indexOf(marker) >= 0 && field_active === true ) {
                            var high_threshold = field_settings.high_threshold;
                            var low_threshold = field_settings.low_threshold;
                            if (!high_threshold || !low_threshold) {
                                return;
                            }
                            var tinymce_row = jQuery('#' + row_id);
                            var status_box = jQuery('#info-' + field_id);

                            // Check if we have our custom row
                            if (tinymce_row.length === 0) {
                                tinymce_row = jQuery('<tr />', {
                                    'class': 'charlimit-row',
                                    'id': 'charlimit-row-' + field_id
                                });
                            }

                            // Check if we have our status_box
                            if (status_box.length === 0) {
                                status_box = jQuery('<div />', {
                                    'class': 'charlimit-info',
                                    'id': 'info-' + field_id
                                });
                                tinymce_row.append(status_box);
                            }

                            EEATinyMCEUtils.add_tinymce_table_row(ed.editorContainer, tinymce_row);
                            // Update the character count after creation
                            status_update(status_box, low_threshold, high_threshold);

                            ed.onKeyUp.add(function() {
                                status_update(status_box, low_threshold, high_threshold);
                            });

                            // Redraw our custom tinymce table row when exiting fullscreen
                            ed.onBeforeExecCommand.add(function(ed, cmd) {
                                if (cmd === 'mceFullScreen') {
                                    if (ed.getParam('fullscreen_is_enabled')) {
                                        var orig_field = ed.getParam('fullscreen_editor_id');
                                        var container = tinymce.getInstanceById(orig_field).editorContainer;
                                        EEATinyMCEUtils.add_tinymce_table_row(container, tinymce_row);
                                    }
                                }
                            });
                        }
                    });
                }
            });

            //Count the characters entered by the user, strip out the html and convert
            //chars like &nbsp to a single character
            self.getCountCharacters = function() {
                var raw_content = ed.getContent({format: 'raw'});

                // remove html comments
                var strip = raw_content.replace(/<!--[\s\S]*?-->/g, '');

                // strip html
                strip = strip.replace(/<.[^<>]*?>/g, '').replace(/&[^;]+;/g, '?');

                return strip.length;
                };
            },
        getInfo : function() {
            return {
                longname : 'TinyMCE Character limit',
                author : 'Olimpiu Rob',
                authorurl : '',
                infourl : '',
                version : tinymce.majorVersion + '.' + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('eeacharlimit', tinymce.plugins.EEACharLimitPlugin);
}());
