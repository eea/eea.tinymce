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
        key_metrics = {'word_count': 0, 'sentences_count': 0, 'read_count': 0}
        for value in scores.values():
            if not value['value']:
                continue
            key_metrics['word_count'] += int(value['count'])
            # key_metrics['sentences_count'] += value['sentences_count']
            key_metrics['read_count'] += float(value['value'])
        return key_metrics

