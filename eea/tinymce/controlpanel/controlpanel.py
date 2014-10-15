""" Control Panel
"""
from eea.tinymce.config import EEAMessageFactory as _
from eea.tinymce.interfaces import ITinyMCEPlugin
from zope import schema
from zope.formlib.form import FormFields
from zope.formlib.textwidgets import TextAreaWidget
from zope.interface import implements
from zope.browserpage import ViewPageTemplateFile
from Products.Five.browser import BrowserView


class EEACharPluginView(BrowserView):
    """ EEACharPlugin View
    """

    template = ViewPageTemplateFile('eeacharplugin.pt')

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return self.template()


class EEACharPluginWidget(TextAreaWidget):
    """ EEACharPlugin Widget
    """

    def __init__(self, context, request, **kw):
        super(EEACharPluginWidget, self).__init__(context, request)

        self.portal_url = self.request['URL1']

        # define view that renders the widget
        self.index = EEACharPluginView(self, request)

    def __call__(self):
        return self.index()


class EEACharPlugin(object):
    """ EEACharPlugin  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeacharlimit'
    title = 'EEA Text Statistics'

    def __init__(self):
        self.form_fields = FormFields(
            schema.Text(
                __name__='eea_char_limit',
                title=_(u"EEA CharLimit for Portal Types"),
                description=_(u"EEA Charlimit settings"),
                required=False,
                ),
            )
        field = self.form_fields.__FormFields_byname__['eea_char_limit']
        field.custom_widget = EEACharPluginWidget


class EEAToggleFullscreen(object):
    """ EEA Toggle Fullscreen  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeatogglefullscreen'
    title = 'EEA Toggle Fullscreen'

    def __init__(self):
        self.form_fields = FormFields(
            schema.List(
                __name__='eea_toggle_fullscreen',
                title=_(u"Fullscreen for Portal Types"),
                description=_(u"TinyMCE will go fullscreen when clicking on\
                 the body of the text fields of the following content-types"),
                required=False,
                default=[u"Document"],
                value_type=schema.Choice(
                    vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes")
                )
            )


class EEASaveReminder(object):
    """ EEA Save Reminder  Settings Section
    """
    implements(ITinyMCEPlugin)
    prefix = 'eeasavereminder'
    title = 'EEA Save Reminder'

    def __init__(self):
        self.form_fields = FormFields(
            schema.Int(
                __name__=u'eea_save_reminder',
                title=_(u"EEA Save Reminder"),
                description=_(u"Show Reminder after how many minutes?"),
                default=20,
                required=False,
                ),

            schema.Text(
                __name__=u'eea_save_reminder_message',
                title=_(u"EEA Save Reminder Message"),
                description=_(u"What message the user should be alerted with"),
                default=u"You haven't saved your changes in over 20 minutes." +
                        u"\n In order to avoid losing your work we recommend" +
                        u" you save often",
                required=False,
                ),
            )

