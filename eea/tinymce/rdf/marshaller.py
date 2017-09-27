""" eea.rdfmarshaller customizations for eea.tinymce
"""
import surf
from eea.rdfmarshaller.interfaces import ISurfResourceModifier
from eea.relations.content.interfaces import IBaseObject
from zope.annotation import IAnnotations
from zope.component import adapts
from zope.interface import implements


class Readability2SurfModifier(object):
    """ Readability scores surf rdf export
    """

    implements(ISurfResourceModifier)
    adapts(IBaseObject)

    def __init__(self, context):
        self.context = context

    def run(self, resource, *args, **kwargs):
        """ output
            <eea:fleschReadingEaseScore>57.0</eea:fleschReadingEaseScore>
            <eea:wordCount>446</eea:wordCount>
            <eea:sentenceCount>63</eea:sentenceCount>
            <eea:readingTime>9</eea:readingTime>
        """
        anno = IAnnotations(self.context)
        scores = anno.get('readability_scores')
        output = []
        if not scores:
            return output

        session = resource.session
        try:
            store = session.default_store
        except AttributeError:
            store = session.get_default_store()

        eea_surf = surf.ns.EEA
        store.reader.graph.bind('eea', eea_surf, override=True)
        scores = scores.items()
        scores_len = len(scores)
        score = {'word_count': 0, 'readability_value': 0.0, 'sentence_count': 0}
        for _key, val in scores:
            if not val.get('readability_value'):
                continue
            score['word_count'] += val.get('word_count') or 0
            score['sentence_count'] += val.get('sentence_count') or 0
            score['readability_value'] += float(val.get('readability_value')
                                                or 0)
        word_count = score.get('word_count')
        resource[surf.ns.EEA['fleschReadingEaseScore']] = int(round(score.get(
            'readability_value', scores_len) / scores_len))
        resource[surf.ns.EEA['wordCount']] = word_count
        resource[surf.ns.EEA['sentenceCount']] = score.get('sentence_count')
        resource[surf.ns.EEA['readingTime']] = int(round(word_count / 228.0))

        resource.save()
        return resource
