""" EEA.Tinymce 150 upgrade steps
"""

from Products.CMFCore.utils import getToolByName


def add_styles(setuptool):
    """ Adds new style definitions
    """
    tinymce = getToolByName(setuptool, 'portal_tinymce')
    tinymce.styles.append(u'Wrap selection with')
    tinymce.styles.append(u'No page break|div|noPageBreak')
