""" Readability logic
"""
from Products.Five import BrowserView
from zope.annotations import IAnnotation

class EEAReadabilityPlugin(BrowserView):
    """ EEAReadabilityPlugin
    """

    def __init__(self, context, request):
        """ init """
        self.anno = IAnnotation(context)
        self.context = context
        self.request = request

    def __call__(self):
        """ call """
        form_values = self.request.form
        scores = self.anno['readability_scores'] = {}
        for value in form_values:
            scores[value] = form_values[value]