// jslint:disable
/*global jQuery, tinymce, eeatinymceplugins, portal_url */

(function () {
    tinymce.create("tinymce.plugins.EEAReadabilityChecker", {
        init: function (ed, url) {
            var $smog_index = $("#smog_index");
            var $flesch_reading_ease = $("#flesch_kincaid_reading_ease");
            var $kincaid_grade_level = $("#flesch_kincaid_grade_level");
            var $text_portlet_title = $("#stats-field");
            var $average_grade_level = $("#average_grade_level");
            var $gunning_score = $("#gunning_fog_score");
            var $coleman_index = $("#coleman_liau_index");
            var $automated_index = $("#automated_readability_index");
            var $syllable_count = $("#syllable_count");
            var $word_count = $("#word_count");
            var $sentence_count = $("#sentence_count");
            var $words_per_sentance = $("#words_per_sentence");
            var $syllable_per_word = $("#syllables_per_word");
            var $letters_per_word = $("#letters_per_word");

            var css_url = portal_url + '/portal_skins/eea_tinymce_plugins/eeareadabilitychecker/eeareadabilitychecker.css';
            tinymce.DOM.loadCSS(css_url);
            var set_stats = function($text, label) {
                $text_portlet_title.html(label);
                var text_count_obj = window.textstatistics($text.html());
                $smog_index.html(text_count_obj.smogIndex());
                $flesch_reading_ease.html(text_count_obj.fleschKincaidReadingEase());
                $kincaid_grade_level.html(text_count_obj.fleschKincaidGradeLevel());
                $average_grade_level.html(Math.round($kincaid_grade_level.html()));
                $gunning_score.html(text_count_obj.gunningFogScore());
                $coleman_index.html(text_count_obj.colemanLiauIndex());
                $automated_index.html(text_count_obj.automatedReadabilityIndex());
                $syllable_count.html(text_count_obj.syllableCount(text_count_obj.text));
                $word_count.html(text_count_obj.wordCount());
                $sentence_count.html(text_count_obj.sentenceCount());
                $words_per_sentance.html(text_count_obj.averageWordsPerSentence().toFixed(1));
                $syllable_per_word.html(text_count_obj.averageSyllablesPerWord(text_count_obj.text).toFixed(1));
                $letters_per_word.html(text_count_obj.averageCharactersPerWord(text_count_obj.text).toFixed(1));
            };
            ed.addCommand("mceReadabilityChecker", function() {
                var $textarea = $(ed.getElement());
                var $field_parent = $textarea.closest(".field");
                var label = $field_parent.find(".formQuestion")[0].firstChild;
                set_stats($textarea, label);
                $('html, body').animate({
                    scrollTop: $("#portal-column-two").offset().top
                }, 500);
            });

            ed.onInit.add(function() {
                var $container = $(ed.getContainer());
                var $character_limit_row = $container.find('.charlimit-row');
                if ($character_limit_row.length < 1) {
                    return;
                }
                var $el =$("<div id='readabilityChecker'><span class='eea-icon eea-icon-question-circle eea-icon-lg'></span>Text readability score <span id='readabilityValue'></span></div>") ;
                $el.appendTo($character_limit_row);
            });
            ed.addButton("eeaReadabilityChecker", {
                title: "Text Readability Check",
                icon: "mceIcon mce_iespell",
                cmd: "mceReadabilityChecker"
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
