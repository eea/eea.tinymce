/* global tinyMCE */

var editor = tinyMCE.activeEditor;
var text = editor.getContent();
var editor_params = editor.windowManager.params;
var textStatistics = editor_params.textstatistics;
var char_count_num = editor_params.charCount;
var $ = document.getElementById.bind(document);
window.textstatistics = textStatistics;
var flesch_reading_ease = $("flesch_kincaid_reading_ease");
var syllable_count = $("syllable_count");
var char_count = $("character_count");
var word_count = $("word_count");
var sentence_count = $("sentence_count");
var words_per_sentance = $("words_per_sentence");
var syllable_per_word = $("syllables_per_word");
var letters_per_word = $("letters_per_word");

var set_stats = function($text) {
    if (!$text) {
        return;
    }
    var text_count_obj = window.textstatistics($text);
    flesch_reading_ease.innerHTML = text_count_obj.fleschKincaidReadingEase();
    syllable_count.innerHTML = text_count_obj.syllableCount(text_count_obj.text);
    char_count.innerHTML = "(" + char_count_num +")";
    word_count.innerHTML = text_count_obj.wordCount();
    sentence_count.innerHTML = text_count_obj.sentenceCount();
    words_per_sentance.innerHTML = text_count_obj.averageWordsPerSentence().toFixed(1);
    syllable_per_word.innerHTML = text_count_obj.averageSyllablesPerWord(text_count_obj.text).toFixed(1);
    letters_per_word.innerHTML = text_count_obj.averageCharactersPerWord(text_count_obj.text).toFixed(1);
};
set_stats(text);
