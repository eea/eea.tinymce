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
                var label = $field_parent.find(".formQuestion")[0].textContent;
                set_stats($textarea, label);
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

        loadContent: function (ed) {

        }
    });
    tinymce.PluginManager.add("eeareadabilitychecker", tinymce.plugins.EEAReadabilityChecker);

}());
