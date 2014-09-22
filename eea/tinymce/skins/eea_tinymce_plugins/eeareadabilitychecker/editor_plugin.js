// jslint:disable
/*global jQuery, tinymce, eeatinymceplugins, portal_url */

(function () {
    tinymce.create("tinymce.plugins.EEAReadabilityChecker", {
        init: function (ed, url) {

            var css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeareadabilitychecker/eeareadabilitychecker.css';
            var charlimit_css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeacharlimit/css/eeacharlimit.css';
            tinymce.DOM.loadCSS(css_url);
            tinymce.DOM.loadCSS(charlimit_css_url);

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

            ed.onInit.add(function() {
                var $container = $(ed.getContainer());
                var $character_limit_row = $container.find('.charlimit-row');
                if ($character_limit_row.length < 1) {
                    return;
                }
                var $el =$("<div id='readabilityChecker'><span class='eea-icon eea-icon-question-circle eea-icon-lg'></span>Text readability score <span id='readabilityValue'></span></div>") ;
                $el.appendTo($character_limit_row);
                $el.click(function(ev) {
                    ed.windowManager.open({
                        file: url + "/eeareadabilitychecker",
                        width: 400 ,
                        height: 500,
                        inline: 1
                    },
                    {
                        textstatistics: window.textstatistics
                    });
                });
                var $readability_value = $("#readabilityValue");

                var setReadabilityValue = function() {
                    var text = ed.getContent();
                    var text_count_obj = window.textstatistics(text);
                    var grade = Math.round(text_count_obj.fleschKincaidGradeLevel());
                    $readability_value.html(grade);
                    if (grade > 14) {
                        $el.attr('class', 'charlimit-warn');
                    } else if (grade > 16) {
                        $el.attr('class', 'charlimit-exceeded');
                    } else {
                        $el.attr('class', '');
                    }
                };

                setReadabilityValue();
                // recalculate score value on keyUp every 1.2sec
                ed.onKeyUp.add(debounce(function() {
                    return setReadabilityValue();
                }, 1200, false));
            });
        },

        getInfo: function () {
            return {
                longname: "EEA Readability Checker",
                author: "David Ichim",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/template",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        },

    });
    tinymce.PluginManager.add("eeareadabilitychecker", tinymce.plugins.EEAReadabilityChecker);

}());
