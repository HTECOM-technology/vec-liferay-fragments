package vn.vec.custom.admin.ui;

import com.liferay.portal.kernel.servlet.taglib.DynamicInclude;
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

    // String currentURL = (String) request.getAttribute(WebKeys.CURRENT_URL);
    // if (currentURL == null || !currentURL.contains("/control_panel/")) return;

    PrintWriter writer = response.getWriter();

    if (key.contains("top_head")) {
      writer.println("<link rel=\"stylesheet\" href=\"/o/vec-custom-admin-ui/custom_admin.css\">");
      writer.println("<script src=\"/o/vec-custom-admin-ui/custom_admin.js\" defer></script>");
    }
  }

  @Override
  public void register(DynamicInclude.DynamicIncludeRegistry dynamicIncludeRegistry) {
    dynamicIncludeRegistry.register("/html/common/themes/top_head.jsp#pre");
  }
}
