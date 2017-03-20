""" Readability logic
"""
from Products.Five import BrowserView
from zope.annotation import IAnnotations
import json
import math


class EEAReadabilityPlugin(BrowserView):
    """ EEAReadabilityPlugin
    """

    def __init__(self, context, request):
        """ init """
        self.anno = IAnnotations(context)
        self.context = context
        self.request = request
        self.key = 'readability_scores'

    def __call__(self):
        """ call """
        form_values = json.loads(self.request.form.keys()[0])
        scores = self.anno.setdefault(self.key, {})
        for value in form_values:
            scores[value] = form_values[value]
        return ""

    def get_scores(self):
        """ get_scores """
        scores = self.anno.get(self.key, {})
        key_metrics = {'word_count': 0, 'sentence_count': 0,
                       'readability_value': 0}
        enabled_for = 0
        for value in scores.values():
            if not value.get('readability_value'):
                continue
            enabled_for += 1
            key_metrics['word_count'] += int(value.get('word_count', 0))
            key_metrics['sentence_count'] += value.get('sentence_count', 0)
            key_metrics['readability_value'] += float(value.get(
                'readability_value', 0))
        # make an average score when we have more than 1 text field for
        # which readability is enabled
        if enabled_for > 1:
            key_metrics['readability_value'] = "{0:.2f}".format(
                            key_metrics['readability_value'] / enabled_for)
        return key_metrics


