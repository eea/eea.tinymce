// jslint:disable
/*global jQuery, tinymce, eeatinymceplugins, portal_url */


(function () {
    tinymce.create("tinymce.plugins.EEATemplateInitPlugin", {
        init: function (ed) {
            ed.onLoadContent.add(this.loadContent, this);
        },

        getInfo: function () {
            return {
                longname: "EEA Template Init",
                author: "David Ichim",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/template",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        },

        loadContent: function (ed) {
            var tinyMCETemplateList = [
                {title: "Figure", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/figure", decription:"Figure title and image"}
            ];
            ed.settings.template_templates = window.globalTinyMCETemplateList || tinyMCETemplateList;
        }
    });
    tinymce.PluginManager.add("eeatemplateinit", tinymce.plugins.EEATemplateInitPlugin);

}());
