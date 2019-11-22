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
                {title: "Figure", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/figure", decription:"Figure title and image"},
                {title: "One tile", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-1-item", decription:"Fullwidth section with one tile content"},
                {title: "Two tiles", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-2-items", decription:"Fullwidth section with two tiles content"},
                {title: "Three tiles", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-3-items", decription:"Fullwidth section with three tiles content"},
                {title: "Four tiles", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-4-items", decription:"Fullwidth section with four tiles content"},
                {title: "Fullwidth grey section", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/fullwidth-grey-section", decription:"Fullwidth grey background section"},
                {title: "Pullquote full grey", src: "/www/SITE/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/pullquote-full-grey", decription:"Inline quote with author on grey background"}
            ];
            ed.settings.template_templates = window.globalTinyMCETemplateList || tinyMCETemplateList;
        }
    });
    tinymce.PluginManager.add("eeatemplateinit", tinymce.plugins.EEATemplateInitPlugin);

}());
