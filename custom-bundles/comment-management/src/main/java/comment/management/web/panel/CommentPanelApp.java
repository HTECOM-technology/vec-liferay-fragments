package comment.management.web.panel;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelApp;
import com.liferay.portal.kernel.model.Portlet;

import comment.management.constants.CommentManagementPortletKeys;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
    property = {
        "panel.app.order:Integer=1000",
        "panel.category.key=site_administration.content"
    },
    service = PanelApp.class
)
public class CommentPanelApp extends BasePanelApp {

    @Override
    public Portlet getPortlet() {
        return _portlet;
    }

    @Override
    public String getPortletId() {
        return CommentManagementPortletKeys.COMMENTMANAGEMENT;
    }

    @Reference(
        target = "(javax.portlet.name=" + CommentManagementPortletKeys.COMMENTMANAGEMENT + ")",
        unbind = "-"
    )
    private Portlet _portlet;

}
