""" Control Panel
"""
from eea.tinymce.interfaces import ITinyMCEPlugin
from persistent.dict import PersistentDict
from zope.component import getUtility
from Products.TinyMCE.interfaces.utility import ITinyMCE
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from Products.statusmessages.interfaces import IStatusMessage
from zope.component import getUtilitiesFor
from zope.formlib.form import EditForm, FormFields, setUpWidgets, action


class TinyMCEPluginsEditForm(EditForm):
    """
    TinyMCE Plugins Control Panel
    """
    label = "TinyMCE Plugins Settings"
    prefix = "tinymcepluginssettings"
    template = ViewPageTemplateFile("controlpanel.pt")

    @property
    def sections(self):
        """ Sections
        """
        if self._sections is not None:
            return self._sections

        self._sections = []
        extensions = [ex for _name, ex in getUtilitiesFor(ITinyMCEPlugin)]
        for extension in extensions:
            if not hasattr(extension, "form_fields"):
                continue

            self._sections.append({
                'name': extension.prefix,
                'title': extension.title,
                'widgets': [(self.prefix + '.' + field.__name__)
                            for field in extension.form_fields]
            })
        return self._sections

    @property
    def form_fields(self):
        """ Form fields
        """
        if self._form_fields is not None:
            return self._form_fields

        self._form_fields = FormFields()
        extensions = [ex for _name, ex in getUtilitiesFor(ITinyMCEPlugin)]
        for extension in extensions:
            if not hasattr(extension, "form_fields"):
                continue
            self._form_fields += extension.form_fields
        return self._form_fields

    @property
    def _data(self):
        """ Data for edit form
        """
        settingsdict = {}
        utility = getUtility(ITinyMCE)
        plugin_settings = getattr(utility, 'eea_plugin_settings', {})

        for x in getUtilitiesFor(ITinyMCEPlugin):
            settingsdict.update(plugin_settings.get(x[1].prefix, {}))
        return settingsdict

    def setUpWidgets(self, ignore_request=False):
        """ Sets up widgets
        """
        self.adapters = {}
        self.widgets = setUpWidgets(
            self.form_fields, self.prefix, self.context, self.request,
            form=self, data=self._data, adapters=self.adapters,
            ignore_request=ignore_request)

    def __init__(self, context, request):
        super(TinyMCEPluginsEditForm, self).__init__(context, request)
        self._sections = None
        self._form_fields = None

    @action(u"Save", name=u'save')
    def handle_save_action(self, saction, data):
        """ Save action """
        utility = getUtility(ITinyMCE)

        if not hasattr(utility, 'eea_plugin_settings'):
            utility.eea_plugin_settings = PersistentDict()

        plugin_settings = getattr(utility, 'eea_plugin_settings')

        extensions = [x[1] for x in getUtilitiesFor(ITinyMCEPlugin)]

        for extension in extensions:
            fields = extension.form_fields.__FormFields_byname__.keys()

            if not plugin_settings.get(extension.prefix):
                plugin_settings[extension.prefix] = PersistentDict()

            for field in fields:
                value = data.get(field, None)
                plugin_settings[extension.prefix][field] = value

        IStatusMessage(self.request).addStatusMessage(u"Settings saved")
        self.request.response.redirect("@@tinymceplugins-settings")

    @action(u"Cancel", name=u'cancel')
    def handle_cancel_action(self, saction, data):
        """ Cancel action """
        IStatusMessage(self.request).addStatusMessage(u"Edit cancelled")
        self.request.response.redirect("@@overview-controlpanel")
