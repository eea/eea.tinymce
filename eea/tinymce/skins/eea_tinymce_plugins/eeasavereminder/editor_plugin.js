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
            var body = ed.getBody();

            var save_reminder_options = eeatinymceplugins.settings['eea_save_reminder'];
            if (save_reminder_options !== undefined) {
                jQuery.each(save_reminder_options, function( index, value ) {

                });
            }
        }
    });
    tinymce.PluginManager.add("eeasavereminder", tinymce.plugins.EEASaveReminderPlugin);
})();
