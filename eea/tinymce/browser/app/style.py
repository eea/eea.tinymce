from Products.PythonScripts.standard import url_quote
from Products.CMFCore.utils import getToolByName
from Products.Five.browser import BrowserView
from Acquisition import aq_inner


class TinyMCEStyle(BrowserView):
    """TinyMCE Style"""

    def getStyle(self):
        """Returns a stylesheet with all content styles"""

        self.request.response.setHeader('Content-Type', 'text/css')

        registry = getToolByName(aq_inner(self.context), 'portal_css')
        registry_url = registry.absolute_url()
        context = aq_inner(self.context)

        styles = registry.getEvaluatedResources(context)
        skinname = url_quote(aq_inner(self.context).getCurrentSkinName())
        result = []
        user_agent = self.request.get('HTTP_USER_AGENT', 'browser')

        for style in styles:
            if style.getMedia() not in ('print', 'projection') and \
                    style.getRel() == 'stylesheet':
                # do not load Internet Explorer conditional styles on non IE
                # browsers
                if not "Trident" in user_agent and \
                        style.getConditionalcomment():
                    continue
                if style.isExternalResource():
                    src = style.getId()
                else:
                    src = "<!-- @import url(%s/%s/%s); -->" % (
                        registry_url, skinname, style.getId())
                result.append(src)

        return "\n".join(result)
