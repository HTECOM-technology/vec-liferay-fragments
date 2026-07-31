package comment.management.portlet;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;

@Component(
    property = {
        "javax.portlet.name=comment_management_CommentManagementPortlet",
        "mvc.command.name=/getThreadComments"
    },
    service = MVCResourceCommand.class
)
public class GetThreadCommentsResource implements MVCResourceCommand {

    @Override
    public boolean serveResource(
        ResourceRequest resourceRequest, ResourceResponse resourceResponse) {

        long threadId = ParamUtil.getLong(resourceRequest, "threadId");

        // threadId đến từ client nên phải giới hạn theo company/site đang mở portlet,
        // tránh đọc được comment của portal instance hoặc site khác. Dùng ThemeDisplay
        // thay vì PortalUtil.getScopeGroupId() vì hàm đó khai báo throws
        // PortalException mà serveResource() không propagate được.
        ThemeDisplay themeDisplay = (ThemeDisplay) resourceRequest.getAttribute(
            WebKeys.THEME_DISPLAY);

        JSONArray arr = JSONFactoryUtil.createJSONArray();

        if (themeDisplay == null) {
            System.out.println("[CommentMgmt] thiếu ThemeDisplay - trả về mảng rỗng");

            writeJSON(resourceResponse, arr);

            return false;
        }

        long companyId = themeDisplay.getCompanyId();
        long groupId = themeDisplay.getScopeGroupId();

        // ctCollectionId = 0 = dữ liệu production; không lọc thì bản sao trong các
        // change collection của Publications sẽ làm comment bị lặp.
        String sql =
            "SELECT m.messageId, m.parentMessageId, m.body, m.createDate, " +
            "       CONCAT(u.firstName, ' ', u.lastName) as fullName " +
            "FROM MBMessage m " +
            "INNER JOIN User_ u ON m.userId = u.userId " +
            "    AND u.ctCollectionId = 0 " +
            "WHERE m.threadId = ? AND m.companyId = ? AND m.groupId = ? " +
            "  AND m.ctCollectionId = 0 " +
            "ORDER BY m.createDate ASC";

        try (Connection con = DataAccess.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setLong(1, threadId);
            ps.setLong(2, companyId);
            ps.setLong(3, groupId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    JSONObject obj = JSONFactoryUtil.createJSONObject();

                    obj.put("id", rs.getLong("messageId"));
                    obj.put("parentId", rs.getLong("parentMessageId"));
                    obj.put("content", rs.getString("body"));
                    obj.put("author", rs.getString("fullName"));

                    Timestamp createDate = rs.getTimestamp("createDate");

                    obj.put("date", (createDate != null) ? createDate.getTime() : 0);

                    arr.put(obj);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        writeJSON(resourceResponse, arr);

        return false;
    }

    private void writeJSON(ResourceResponse resourceResponse, JSONArray arr) {
        try {
            resourceResponse.getWriter().write(arr.toString());
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
