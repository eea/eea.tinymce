// jslint:disable
/*global jQuery, tinymce, eeatinymceplugins, portal_url */

(function () {

    tinymce.create("tinymce.plugins.EEASaveReminderPlugin", {
        init: function (ed) {
            ed.onLoadContent.add(this.loadContent, this);
        },

        getInfo: function () {
            return {
                longname: "EEA Save Reminder",
                author: "David Ichim",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        },

        loadContent: function (ed) {
            var save_reminder_options = eeatinymceplugins.settings['eea_save_reminder'];
            var timer = save_reminder_options  * 60000; /* 1min has this many miliseconds */
            var message = eeatinymceplugins.settings['eea_save_reminder_message'];
            var warning_message = function() {
                window.alert(message);
            };
            var startInterval = function() {
                return window.setInterval(warning_message, timer);
            };
            var interval = startInterval();
            ed.onExecCommand.add(function(ed, cmd, ui, val) {
                if (cmd === "mceSave") {
                    window.clearInterval(interval);
                    interval = startInterval();
                }
            });
        }
    });
    tinymce.PluginManager.add("eeasavereminder", tinymce.plugins.EEASaveReminderPlugin);
})();
