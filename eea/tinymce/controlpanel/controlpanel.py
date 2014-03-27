from eea.app.visualization.config import EEAMessageFactory as _
from eea.tinymce.interfaces import ITinyMCEPlugin
from zope import schema
from zope.formlib.form import FormFields
from zope.interface import implements


class EEACharPlugin(object):
    """ EEACharPlugin  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeacharlimit'
    title = 'EEA CharLimit'

    def __init__(self):
        self.form_fields = FormFields(
            schema.List(
                __name__='EEA CharLimit plugin',
                title=_(u"EEA CharLimit for Portal Types"),
                description=_(u"EEA CharLimit plugin will be enabled for the\
                 following content types"),
                required=False,
                value_type=schema.Choice(
                    vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes")
                )
            )


class EEAToggleFullscreen(object):
    """ EEA Toggle Fullscreen  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeatogglefullscreen'
    title = 'EEA Toggle Fullscreen'

    def __init__(self):
        self.form_fields = FormFields(
            schema.List(
                __name__='EEA Toggle Fullscreen',
                title=_(u"Fullscreen for Portal Types"),
                description=_(u"TinyMCE will go fullscreen when clicking on\
                 the body of the text fields of the following content-types"),
                required=False,
                default=[u"Document"],
                value_type=schema.Choice(
                    vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes")
                )
            )
