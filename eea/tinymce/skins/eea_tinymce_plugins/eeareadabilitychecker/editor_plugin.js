// jslint:disable
/*global jQuery, tinymce, eeatinymceplugins, portal_url */

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
                var $el =$("<div class='readabilityChecker charlimit-info'><span class='eea-icon eea-icon-question-circle eea-icon-lg'></span>Text readability score <span class='readabilityValue'></span></div>") ;
                $el.appendTo($character_limit_row);
                var $char_limit = $el.prev();
                if ($char_limit.hasClass("charlimit-exceeded")) {
                    $el.addClass("charlimit-expanded");
                }
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
                var $readability_value = $el.find($(".readabilityValue"));

                var setReadabilityValue = function() {
                    var text = ed.getContent();
                    if (!text) {
                        $readability_value.html(0);
                        $el.addClass('charlimit-info');
                        return;
                    }
                    var text_count_obj = window.textstatistics(text);
                    var grade = Math.round(text_count_obj.fleschKincaidGradeLevel());
                    $readability_value.html(grade);
                    if (grade > 14) {
                        $el.attr('class', 'readabilityChecker charlimit-info charlimit-warn');
                    } else if (grade > 22) {
                        $el.attr('class', 'readabilityChecker charlimit-info charlimit-exceeded');
                    } else {
                        $el.attr('class', 'readabilityChecker charlimit-info');
                    }
                    if ($char_limit.hasClass("charlimit-exceeded")) {
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
            }
        },

    });
    tinymce.PluginManager.add("eeareadabilitychecker", tinymce.plugins.EEAReadabilityChecker);

}());
