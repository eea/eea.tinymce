""" EEA.Tinymce 150 upgrade steps
"""

from Products.CMFCore.utils import getToolByName


def add_styles(setuptool):
    """ Adds new style definitions
    """
    tinymce = getToolByName(setuptool, 'portal_tinymce')
    styles = u'\nWrap selection with\nNo page break|div|noPageBreak'
    tinymce.styles += styles
