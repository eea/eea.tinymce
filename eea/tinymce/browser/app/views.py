""" Plugins Settings
"""
from Products.Five import BrowserView
from Products.TinyMCE.interfaces.utility import ITinyMCE
from eea.tinymce.interfaces import ITinyMCEPlugin
from zope.component import getUtility
from zope.component import getUtilitiesFor
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
