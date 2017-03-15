/* global tinyMCE */
(function(){

    var char_count_num;
    var textStatistics;
    var editor_params;
    var editor = window.tinyMCE ? tinyMCE.activeEditor : false;
    var text = editor ? editor.getContent() : '';
    if (editor) {
        editor_params = editor.windowManager.params;
        textStatistics = editor_params.textstatistics;
        char_count_num = editor_params.charCount;
    }
    var $ = document.getElementById.bind(document);
    var q = document.querySelectorAll.bind(document);
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
        char_count.innerHTML = char_count_num;
        word_count.innerHTML = text_count_obj.wordCount();
        sentence_count.innerHTML = text_count_obj.sentenceCount();
        words_per_sentance.innerHTML = text_count_obj.averageWordsPerSentence().toFixed(1);
        syllable_per_word.innerHTML = text_count_obj.averageSyllablesPerWord(text_count_obj.text).toFixed(1);
        letters_per_word.innerHTML = text_count_obj.averageCharactersPerWord(text_count_obj.text).toFixed(1);
    };
    set_stats(text);

    var scores = q('.stats-score');

    var set_score_range = function(score) {
        if (!window.parseInt(score, 10)) {
            return;
        }
        var low, medium, high;
        low = scores[2];
        medium = scores[1];
        high = scores[0];
        if (score <= 50.0) {
            if (score < 20.0)  {
                low.className = "stats-score stats-score-active align-bottom";
            }
            else if (score > 30.0) {
                low.className = "stats-score stats-score-active align-top";
            }
            else {
                low.className = "stats-score stats-score-active";
            }
            low.innerHTML = score;
        }
        else if (score <= 80.0) {
            if (score < 60.0)  {
                medium.className = "stats-score stats-score-active align-bottom";
            }
            else if (score > 70.0) {
                medium.className = "stats-score stats-score-active align-top";
            }
            else {
                medium.className = "stats-score stats-score-active";
            }
            medium.innerHTML = score;
        }
        else {
            if (score < 90.0)  {
                high.className = "stats-score stats-score-active align-bottom";
            }
            else if (score > 100.0) {
                high.className = "stats-score stats-score-active align-top";
            }
            else {
                high.className = "stats-score stats-score-active";
            }
            high.innerHTML = score;
        }

    };

    set_score_range(flesch_reading_ease.innerHTML);

}());
