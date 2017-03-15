""" Readability logic
"""
from Products.Five import BrowserView
from zope.annotation import IAnnotations
import json


class EEAReadabilityPlugin(BrowserView):
    """ EEAReadabilityPlugin
    """

    def __init__(self, context, request):
        """ init """
        self.anno = IAnnotations(context)
        self.context = context
        self.request = request

    def __call__(self):
        """ call """
        form_values = json.loads(self.request.form.keys()[0])
        key = 'readability_scores'
        scores = self.anno.setdefault(key, {})
        for value in form_values:
            scores[value] = form_values[value]
        return ""
