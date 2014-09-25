var editor = tinyMCE.activeEditor;
var text = editor.getContent();
var editor_params = editor.windowManager.params;
var textStatistics = editor_params.textstatistics;
var $ = document.getElementById.bind(document);
window.textstatistics = textStatistics;
var smog_index = $("smog_index");
var flesch_reading_ease = $("flesch_kincaid_reading_ease");
var kincaid_grade_level = $("flesch_kincaid_grade_level");
var average_grade_level = $("average_grade_level");
var gunning_score = $("gunning_fog_score");
var coleman_index = $("coleman_liau_index");
var automated_index = $("automated_readability_index");
var syllable_count = $("syllable_count");
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
    smog_index.innerHTML = text_count_obj.smogIndex();
    flesch_reading_ease.innerHTML = text_count_obj.fleschKincaidReadingEase();
    kincaid_grade_level.innerHTML = text_count_obj.fleschKincaidGradeLevel();
    average_grade_level.innerHTML = Math.round(kincaid_grade_level.innerHTML);
    gunning_score.innerHTML = text_count_obj.gunningFogScore();
    coleman_index.innerHTML = text_count_obj.colemanLiauIndex();
    automated_index.innerHTML = text_count_obj.automatedReadabilityIndex();
    syllable_count.innerHTML = text_count_obj.syllableCount(text_count_obj.text);
    word_count.innerHTML = text_count_obj.wordCount();
    sentence_count.innerHTML = text_count_obj.sentenceCount();
    words_per_sentance.innerHTML = text_count_obj.averageWordsPerSentence().toFixed(1);
    syllable_per_word.innerHTML = text_count_obj.averageSyllablesPerWord(text_count_obj.text).toFixed(1);
    letters_per_word.innerHTML = text_count_obj.averageCharactersPerWord(text_count_obj.text).toFixed(1);
};
set_stats(text);
