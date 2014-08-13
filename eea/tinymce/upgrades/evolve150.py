""" EEA.Tinymce 150 upgrade steps
"""
from Products.CMFCore.utils import getToolByName


def add_styles(setuptool):
    """ Adds new style definitions
    """
    tinymce = getToolByName(setuptool, 'portal_tinymce')
    styles = u'\nWrap selection with\nNo page break|div|noPageBreak'
    tinymce.styles += styles


def add_plugins(setuptool):
    """ Adds new  plugins
    """
    tinymce = getToolByName(setuptool, 'portal_tinymce')
    plugins = u'\neeatemplateinit|portal_skins/eea_tinymce_plugins/' + \
              u'eeatemplateinit/editor_plugin.js\n' + \
              u'template|portal_skins/tinymce/plugins/' + \
              u'template/editor_plugin.js\n'

    tinymce.customplugins += plugins
    buttons = u"template"
    tinymce.customtoolbarbuttons = buttons
