// jslint:disable
/*global $, tinymce, portal_url, window */

(function () {
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

    tinymce.create("tinymce.plugins.EEAReadabilityChecker", {
        init: function (ed, url) {

            var css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeareadabilitychecker/eeareadabilitychecker.css';
            var charlimit_css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeacharlimit/css/eeacharlimit.css';
            tinymce.DOM.loadCSS(css_url);
            tinymce.DOM.loadCSS(charlimit_css_url);

            ed.onInit.add(function() {

                var $container = $(ed.getContainer());
                var $character_limit_row = $container.find('.charlimit-row');
                if ($character_limit_row.length < 1) {
                    return;
                }
                var $el =$("<div class='readabilityChecker charlimit-info'><span class='eea-icon eea-icon-question-circle eea-icon-lg'></span>Readability score <span class='readabilityValue'></span> <span class='readabilityLevel'></span></div>") ;
                $el.appendTo($character_limit_row);
                var $char_limit = $el.prev();
                if ($char_limit.hasClass("charlimit-exceeded")) {
                    $el.addClass("charlimit-expanded");
                }
                $el.click(function() {
                    ed.focus();
                    var char_info = $character_limit_row.find('.charlimit-info').eq(0);
                    var eea_char_count = parseInt(char_info.text().match("[0-9]+")[0], 10);
                    ed.windowManager.open({
                        file: url + "/eeareadabilitychecker",
                        width: 530,
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
                    if ($char_limit.hasClass("charlimit-exceeded") || $char_limit.hasClass("charlimit-warn")) {
                        $el.addClass("charlimit-expanded");
                    }
                };

                setReadabilityValue();
                // recalculate score value on keyUp every 1.2sec
                ed.onKeyUp.add(debounce(function() {
                    return setReadabilityValue();
                }, 1200, false));
                // recalculate score value when content is set
                // such as the moment when you paste markup within
                // the html plugin
                ed.onSetContent.add(debounce(function() {
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
