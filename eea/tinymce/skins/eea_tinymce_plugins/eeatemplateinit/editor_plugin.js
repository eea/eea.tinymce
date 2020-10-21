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
      };
    },

    loadContent: function (ed) {
      var tinyMCETemplateList = [
        {
          title: "Figure",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/figure",
          description: "Figure title and image"
        },
        {
          title: "One tile",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-1-item",
          description: "Fullwidth section with one tile content",
        },
        {
          title: "Two tiles",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-2-items",
          description: "Fullwidth section with two tiles content"
        },
        {
          title: "Three tiles",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-3-items",
          description: "Fullwidth section with three tiles content"
        },
        {
          title: "Four tiles",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/tiles-4-items",
          description: "Fullwidth section with four tiles content"
        },
        {
          title: "Fullwidth grey section",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/fullwidth-grey-section",
          description: "Fullwidth grey background section"
        },
        {
          title: "Fullwidth image section",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/fullwidth-image-container",
          description: "Fullwidth image center section"
        },
        {
          title: "Fullwidth image",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/fullwidth-image",
          description: "Image spans entire browser width"
        },
        {
          title: "Max column image",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/max-container-image",
          description: "Content is placed outside of content area, image is 100% width with max 1400px"
        },
        {
          title: "Pullquote full",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/pullquote-full",
          description: "Inline quote with author tag"
        },
        {
          title: "Pullquote left",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/pullquote-left",
          description: "Left pullquote with author tag"
        },
        {
          title: "Pullquote Right",
          src:
            "/portal_skins/eea_tinymce_plugins/eeatemplateinit/templates/pullquote-right",
          description: "Right pullquote with author tag"
        }
      ];
      ed.settings.template_templates =
        window.globalTinyMCETemplateList || tinyMCETemplateList;
      // ed.settings.template_replace_values = {
      //   "bg-color": function (el) {
      //     el.classList.add(window.prompt("class name"));
      //   }
      // };
    }
  });
  tinymce.PluginManager.add(
    "eeatemplateinit",
    tinymce.plugins.EEATemplateInitPlugin
  );
})();
