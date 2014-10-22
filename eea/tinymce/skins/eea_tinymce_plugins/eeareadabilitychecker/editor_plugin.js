// jslint:disable
/*global $, tinymce, portal_url, window, EEATinyMCEUtils, eeatinymceplugins */

(function () {
    tinymce.create("tinymce.plugins.EEAReadabilityChecker", {
        init: function (ed) {
            var css_url = portal_url + '/eeareadabilitychecker.css';
            ed.onInit.add(function() {
                if (!EEATinyMCEUtils.hasEEATinyMCESettings()) {
                    return;
                }
                var eeacharlimit_options = eeatinymceplugins.settings.eea_char_limit;
                var body_class = jQuery('body').attr('class');
                var field_id = ed.editorId;
                var shouldEnable = false;
                if (eeacharlimit_options) {
                    eeacharlimit_options = jQuery.parseJSON(eeacharlimit_options);
                    jQuery.each(eeacharlimit_options, function( index, value ) {
                        var marker = 'portaltype-' + value.ctype.toLowerCase();
                        var field_active = false;
                        var field_settings;
                        if (body_class.indexOf(marker) < 0) {
                            return;
                        }
                        jQuery.each(value.settings, function(key, val) {
                            var value = val[field_id];
                            if (value && value['readability_checker']) {
                                field_active = true;
                                field_settings = value;
                                return false;
                            }
                        });
                        //Check if we should activate for this CT and field
                        if (field_active === true ) {
                            shouldEnable = true;
                        }
                    });
                    if (!shouldEnable) {
                        return;
                    }
                }

                tinymce.DOM.loadCSS(css_url);
                var $container = $(ed.getContainer());
                var $char_limit_row = $container.find('.charlimit-row');
                var $char_limit = $char_limit_row.children();
                if ($char_limit_row.length < 1) {
                    $char_limit_row = jQuery('<tr />', {
                        'class': 'charlimit-row',
                        'id': 'charlimit-row-' + field_id
                    });
                    EEATinyMCEUtils.add_tinymce_table_row(ed.editorContainer, $char_limit_row);
                    $char_limit_row.addClass('fullwidth');
                }

                if ($char_limit.is(':empty')) {
                    $char_limit.remove();
                    $char_limit_row.addClass('fullwidth');
                }

                var $el = $("<div class='readabilityChecker charlimit-info'><span class='eea-icon eea-icon-question-circle eea-icon-lg'></span>Readability score <span class='readabilityValue'></span> <span class='readabilityLevel'></span></div>") ;
                $el.appendTo($char_limit_row);
                if ($char_limit.hasClass("charlimit-exceeded")) {
                    $el.addClass("charlimit-expanded");
                }
                $el.click(function() {
                    ed.focus();
                    var char_info = $char_limit_row.find('.charlimit-info').eq(0);
                    var eea_char_count = parseInt(char_info.text().match("[0-9]+")[0], 10);
                    ed.windowManager.open({
                            file: portal_url + "/portal_skins/eeareadabilitychecker/eeareadabilitychecker",
                            width: 560,
                            height: 650,
                            inline: 1
                        },
                        {
                            textstatistics: window.textstatistics,
                            charCount: eea_char_count
                        });
                });
                var $readability_value = $el.find($(".readabilityValue"));
                var $readability_level = $el.find($(".readabilityLevel"));

                var setReadabilityValue = function() {
                    var text = ed.getContent();
                    if (!text) {
                        $readability_value.html(0);
                        $readability_level.text("");
                        $el.addClass('charlimit-info');
                        return;
                    }
                    var text_count_obj = window.textstatistics(text);
                    var grade = text_count_obj.fleschKincaidReadingEase();
                    $readability_value.html(grade);
                    if (grade < 30) {
                        $el.attr('class', 'readabilityChecker charlimit-info charlimit-exceeded');
                        $readability_level.text("(low)");
                    } else if (grade < 70) {
                        $el.attr('class', 'readabilityChecker charlimit-info charlimit-warn');
                        $readability_level.text("(average)");
                    } else {
                        $el.attr('class', 'readabilityChecker charlimit-info');
                        $readability_level.text("(high)");
                    }
                    if ($char_limit.hasClass("charlimit-exceeded")) {
                        $el.addClass("charlimit-expanded");
                    }
                };

                setReadabilityValue();
                // recalculate score value on keyUp every 1.2sec
                ed.onKeyUp.add(EEATinyMCEUtils.debounce.call(this, function() {
                    return setReadabilityValue();
                }, 1200, false));
                // recalculate score value when content is set
                // such as the moment when you paste markup within
                // the html plugin
                ed.onSetContent.add(EEATinyMCEUtils.debounce.call(this, function() {
                    return setReadabilityValue();
                }, 500, false));
            });
        },

        getInfo: function () {
            return {
                longname: "EEA Readability Checker",
                author: "David Ichim",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/template",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }

    });
    tinymce.PluginManager.add("eeareadabilitychecker", tinymce.plugins.EEAReadabilityChecker);

}());
