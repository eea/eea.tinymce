""" eea.rdfmarshaller customizations for eea.tinymce
"""
import surf
import rdflib
from eea.rdfmarshaller.interfaces import ISurfResourceModifier
from eea.relations.content.interfaces import IBaseObject
from zope.annotation import IAnnotations
from zope.component import adapts, getMultiAdapter
from zope.interface import Interface, implements


class Readability2SurfModifier(object):
    """ Readability surf rdf export
    """

    implements(ISurfResourceModifier)
    adapts(IBaseObject)

    def __init__(self, context):
        self.context = context

    def run(self, resource, *args, **kwargs):
        """
            <eea:readabilityScores>
              <eea:textField>
                <dcterms:title>Title of dataset</dcterms:title>
                <eea:readabilityValue>6</eea:readabilityLevel>
                <eea:wordCount>6</eea:wordCount>
                <eea:sentenceCount>6</eea:sentenceCount>
              </eea:textField>
            </eea:readabilityScores>
        """
        output = []
        session = resource.session
        store = session.get_default_store()

        DataItem = session.get_class(surf.ns.EEA.textField)

        anno = IAnnotations(self.context)
        scores = anno.get('readability_scores')
        for key, val in scores.items():
            d = DataItem(rdflib.BNode())
            d.dcterms_title = key
            d.eea_readabilityValue = val.get('readability_value', 1)
            d.eea_wordCount = val.get('wordCount', 1)
            d.eea_sentenceCount = val.get('sentenceCount', 1)
            d.update()

            output.append(d)


        # eea_surf = surf.ns.EEA
        # store.reader.graph.bind('eea', eea_surf, override=True)
        # details_progress = session.get_class(surf.ns.EEA.textField)
#
        # for key, val in scores.items():
        #     rdfp = session.get_resource(key, details_progress)
        #     rdfp[surf.ns.EEA['readabilityValue']] = val.get('readability_value', 1)
        #     rdfp[surf.ns.EEA['wordCount']] = val.get('wordCount', 1)
        #     rdfp[surf.ns.EEA['sentenceCount']] = val.get('sentenceCount', 1)
        #     rdfp.update()
        #     output.append(rdfp)
#
        resource['eea_readabilityScores'] = output
        resource.save()
        return resource