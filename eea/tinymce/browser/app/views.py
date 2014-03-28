""" Plugins Settings
"""
from Products.Five import BrowserView
from Products.TinyMCE.interfaces.utility import ITinyMCE
from eea.tinymce.interfaces import ITinyMCEPlugin
from zope.component import getUtility
from zope.component import getUtilitiesFor
from Products.CMFCore.utils import getToolByName
import json


def jsonify(obj, response=None, status=None):
    """ Convert obj to JSON
    """
    if response:
        response.setHeader("Content-type", "application/json")
        if status:
            response.setStatus(status)
    return json.dumps(obj)


class TinyMCEPluginsSettings(BrowserView):
    """ TinyMCEPluginsSettings Browserview
    """

    def __call__(self, **kwargs):
        utility = getUtility(ITinyMCE)
        plugin_settings = getattr(utility, 'eea_plugin_settings', {})

        settingsdict = {}

        for x in getUtilitiesFor(ITinyMCEPlugin):
            settingsdict.update(plugin_settings.get(x[1].prefix, {}))

        return jsonify({
            "name": "EEA TinyMCE Plugins",
            "settings": settingsdict
            }, self.request.response)


class AvailableCTypes(BrowserView):
    """ AvailableCTypes BrowserView
    """

    def __call__(self):
        portal_properties = getToolByName(self.context, "portal_properties")
        site_properties = portal_properties.site_properties
        not_searched = site_properties.getProperty('types_not_searched', [])

        portal_types = getToolByName(self.context, "portal_types")
        types = portal_types.listContentTypes()

        # Get list of content type ids which are not filtered out
        prepared_types = [t for t in types if t not in not_searched]

        return jsonify(prepared_types, self.request.response)


class CTRichFields(BrowserView):
    """ CTRichFiels BrowserView
    """

    def __call__(self):
        ctype_name = self.request.form.get('ctype')
        if ctype_name:
            catalog = getToolByName(self, 'portal_catalog')
            brains = catalog({'portal_type': ctype_name})
            result = []
            if brains:
                obj = brains[0].getObject()
                schema = obj.schema
                for field in schema.fields():
                    if 'RichWidget' in field.widget.getType():
                        result.append(field.getName())
                return jsonify(result, self.request.response)
