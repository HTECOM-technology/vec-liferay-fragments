package vn.vec.custom.admin.ui;

import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.servlet.taglib.DynamicInclude;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;

@Component(service = DynamicInclude.class)
public class TopHeadDynamicInclude implements DynamicInclude {

  @Override
  public void include(
    HttpServletRequest request, HttpServletResponse response, String key)
    throws IOException {

    PrintWriter writer = response.getWriter();

    if (key.contains("top_head")) {
      String requestURI = request.getRequestURI();
      if (requestURI != null && requestURI.startsWith("/o/vec-custom-admin-ui/")) {
        return;
      }

      writer.println("<link rel=\"stylesheet\" href=\"/o/vec-custom-admin-ui/custom_admin.css\">");
      writer.println("<script src=\"/o/vec-custom-admin-ui/custom_admin.js\" defer></script>");

      String currentURL = (String) request.getAttribute(WebKeys.CURRENT_URL);
      if (currentURL != null && currentURL.contains("UsersAdminPortlet")) {
        writer.println("<script src=\"https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js\"></script>");
        writer.println("<script src=\"/o/vec-custom-admin-ui/user_admin.js\" defer></script>");
      }

      if (currentURL != null && currentURL.contains("JournalPortlet_isCreateHotNew=1")) {
        writer.println("<link rel=\"stylesheet\" href=\"/o/vec-custom-admin-ui/create-hot-new/index.css\">");
        writer.println("<script src=\"/o/vec-custom-admin-ui/create-hot-new/index.js\" defer></script>");
      }

      // if (currentURL != null && currentURL.contains("com_liferay_journal_web_portlet_JournalPortlet")) {
      //   writer.println("<script src=\"/o/vec-custom-admin-ui/fix-create-new-webcontent.js\" defer></script>");
      // }

      ThemeDisplay themeDisplay = (ThemeDisplay)request.getAttribute(
        WebKeys.THEME_DISPLAY);
      User user = themeDisplay == null ? null : themeDisplay.getUser();
      if ((user != null) && "admin".equals(user.getScreenName())) {
        writer.println("<script src=\"/o/vec-custom-admin-ui/backup_admin.js\" defer></script>");
      }
      
      if (currentURL != null && currentURL.contains("com_liferay_journal_web_portlet_JournalPortlet")) {
        writer.println("<script src=\"/o/vec-custom-admin-ui/workflow-fix.js\" defer></script>");
      }
    }
  }

  @Override
  public void register(DynamicInclude.DynamicIncludeRegistry dynamicIncludeRegistry) {
    dynamicIncludeRegistry.register("/html/common/themes/top_head.jsp#pre");
  }
}
