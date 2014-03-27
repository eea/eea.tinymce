from eea.app.visualization.config import EEAMessageFactory as _
from eea.tinymce.interfaces import ITinyMCEPlugin
from persistent.dict import PersistentDict
from zope import schema
from zope.formlib.form import FormFields
from zope.interface import implements


class EEACharPlugin(object):
    """ EEACharPlugin  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeacharplugin'
    title = 'EEACharPlugin settings'

    def __init__(self):
        self.form_fields = FormFields(
            schema.List(
                __name__='EEA Char plugin',
                title=_(u"EEA Char plugin for Portal Types"),
                description=_(u"EEA Char plugin will be enabled for the\
                 following content types"),
                required=False,
                value_type=schema.Choice(
                    vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes")
                )
            )
