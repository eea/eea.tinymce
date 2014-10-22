""" EEA.Tinymce 180 upgrade steps
"""
from Products.TinyMCE.interfaces.utility import ITinyMCE
import json
from zope.component import queryUtility


def evolve_settings(setuptool):
    """ Change the tinymceplugin.json output
    """
    utility = queryUtility(ITinyMCE)
    plugin_settings = getattr(utility, 'eea_plugin_settings', {})
    charlimit_settings = plugin_settings.get('eeacharlimit')
    if not charlimit_settings:
        return
    char_settings = charlimit_settings.get('eea_char_limit')
    if not char_settings:
        return
    json_settings = json.loads(char_settings)
    for item in json_settings:
        new_list = []
        value_list = item['settings']
        for value in value_list:
            if not value.get('fieldname'):
                continue
            fieldname = value.pop('fieldname')
            new_list.append({fieldname: value})
        item['settings'] = new_list
    charlimit_settings['eea_char_limit'] = json.dumps(json_settings)
    return True




