package comment.management.portlet;

import com.liferay.message.boards.exception.NoSuchMessageException;
import com.liferay.message.boards.model.MBMessage;
import com.liferay.message.boards.service.MBMessageLocalServiceUtil;
import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextFactory;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.PortletRequest;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Component;

@Component(
    immediate = true,
    property = {
        "com.liferay.portlet.display-category=category.sample",
        "javax.portlet.display-name=Comment Management",
        "javax.portlet.init-param.template-path=/",
        "javax.portlet.init-param.view-template=/view.jsp",
        "javax.portlet.name=comment_management_CommentManagementPortlet"
    },
    service = Portlet.class
)
public class CommentManagementPortlet extends MVCPortlet {

    private static final int PAGE_SIZE = 20;

    // Comment của một JournalArticle là MBMessage nằm ở độ sâu 3 trong treePath.
    // Dùng chung cho cả query đếm và query lấy danh sách để hai query không lệch nhau.
    //
    // ctCollectionId = 0 = dữ liệu production. Nếu bật Publications, mỗi bản ghi
    // còn có thêm bản sao trong từng change collection -> không lọc sẽ ra trùng.
    private static final String FROM_CLAUSE =
        "FROM MBDiscussion d " +
        "INNER JOIN MBThread t ON t.threadId = d.threadId " +
        "    AND t.ctCollectionId = 0 " +
        "INNER JOIN MBMessage msg ON msg.threadId = t.threadId " +
        "    AND msg.ctCollectionId = 0 " +
        "    AND (LENGTH(msg.treePath) - LENGTH(REPLACE(msg.treePath, '/', ''))) = 3 " +
        "INNER JOIN User_ u ON u.userId = msg.userId " +
        "    AND u.ctCollectionId = 0 " +
        "INNER JOIN JournalArticle ja ON ja.resourcePrimKey = d.classPK " +
        "    AND ja.ctCollectionId = 0 " +
        "    AND ja.id_ = (SELECT MAX(ja2.id_) FROM JournalArticle ja2 " +
        "                  WHERE ja2.resourcePrimKey = d.classPK AND ja2.ctCollectionId = 0) " +
        "INNER JOIN Group_ g ON g.groupId = ja.groupId " +
        "    AND g.ctCollectionId = 0 " +
        "INNER JOIN ClassName_ cn ON cn.classNameId = d.classNameId " +
        "    AND cn.value = 'com.liferay.journal.model.JournalArticle' ";

    // Không join cứng JournalArticleLocalization theo 'vi_VN' nữa: bài viết chỉ có
    // locale khác sẽ bị loại khỏi danh sách. Lấy tiêu đề theo thứ tự ưu tiên
    // locale hiện tại -> ngôn ngữ mặc định của bài -> locale bất kỳ -> articleId.
    // Dùng subquery thay vì join để một bài nhiều locale không nhân bản dòng.
    private static final String TITLE_EXPRESSION =
        "COALESCE(" +
        "    (SELECT jal.title FROM JournalArticleLocalization jal " +
        "     WHERE jal.articlePK = ja.id_ AND jal.ctCollectionId = 0 " +
        "       AND jal.languageId = ?), " +
        "    (SELECT jal.title FROM JournalArticleLocalization jal " +
        "     WHERE jal.articlePK = ja.id_ AND jal.ctCollectionId = 0 " +
        "       AND jal.languageId = ja.defaultLanguageId), " +
        "    (SELECT MIN(jal.title) FROM JournalArticleLocalization jal " +
        "     WHERE jal.articlePK = ja.id_ AND jal.ctCollectionId = 0), " +
        "    ja.articleId" +
        ") AS ten_bai_viet ";

    @Override
    public void render(RenderRequest renderRequest, RenderResponse renderResponse)
        throws IOException, PortletException {

        CommentFilter filter = buildFilter(renderRequest);

        long totalCount = countComments(filter);

        int totalPages = (int) Math.ceil((double) totalCount / PAGE_SIZE);
        if (totalPages < 1) {
            totalPages = 1;
        }

        int page = getPage(renderRequest);
        if (page > totalPages) {
            page = totalPages;
        }

        renderRequest.setAttribute("comments", getComments(page, filter));
        renderRequest.setAttribute("users", getUsers(filter.companyId));
        renderRequest.setAttribute("currentPage", page);
        renderRequest.setAttribute("totalPages", totalPages);
        renderRequest.setAttribute("totalCount", totalCount);
        renderRequest.setAttribute("keyword", filter.keyword);
        renderRequest.setAttribute("dateFrom", filter.dateFrom);
        renderRequest.setAttribute("dateTo", filter.dateTo);
        renderRequest.setAttribute("category", filter.category);
        renderRequest.setAttribute("selectedUsers", filter.selectedUsersParam);

        super.render(renderRequest, renderResponse);
    }

    @Override
    public void processAction(ActionRequest actionRequest, ActionResponse actionResponse)
        throws IOException, PortletException {

        String actionName = actionRequest.getParameter("javax.portlet.action");

        System.out.println("[CommentMgmt] processAction called, action=" + actionName);

        try {
            if ("deleteComment".equals(actionName)) {
                deleteComment(actionRequest, actionResponse);
            }
            else if ("replyComment".equals(actionName)) {
                replyComment(actionRequest, actionResponse);
            }
            else {
                super.processAction(actionRequest, actionResponse);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Lấy phạm vi từ ThemeDisplay. Nếu không có ThemeDisplay thì trả về scope
     * rỗng (groupId = 0) để query không ra dòng nào, thay vì lộ dữ liệu toàn bộ.
     */
    private CommentFilter buildFilter(PortletRequest request) {
        ThemeDisplay themeDisplay = (ThemeDisplay) request.getAttribute(WebKeys.THEME_DISPLAY);

        long companyId;
        long groupId;
        String languageId;

        if (themeDisplay != null) {
            companyId = themeDisplay.getCompanyId();
            groupId = themeDisplay.getScopeGroupId();
            languageId = themeDisplay.getLanguageId();
        }
        else {
            companyId = PortalUtil.getCompanyId(request);
            groupId = 0;
            languageId = "";

            System.out.println("[CommentMgmt] thiếu ThemeDisplay - trả về danh sách rỗng");
        }

        return new CommentFilter(
            companyId, groupId, languageId,
            nullToEmpty(request.getParameter("keyword")),
            nullToEmpty(request.getParameter("dateFrom")),
            nullToEmpty(request.getParameter("dateTo")),
            nullToEmpty(request.getParameter("category")),
            nullToEmpty(request.getParameter("selectedUsers")));
    }

    private int getPage(RenderRequest renderRequest) {
        int page = 1;

        String pageParam = renderRequest.getParameter("page");

        if ((pageParam != null) && !pageParam.isEmpty()) {
            try {
                page = Integer.parseInt(pageParam);
            }
            catch (NumberFormatException nfe) {
            }
        }

        if (page < 1) {
            page = 1;
        }

        return page;
    }

    private void deleteComment(ActionRequest actionRequest, ActionResponse actionResponse)
        throws Exception {

        long messageId = getActionLong(actionRequest, "messageId");
        CommentFilter scope = buildFilter(actionRequest);

        System.out.println("[CommentMgmt] deleteComment messageId=" + messageId);

        if (messageId > 0) {
            if (isMessageInScope(messageId, scope.companyId, scope.groupId)) {
                deleteMessageCascade(messageId);
            }
            else {
                System.out.println(
                    "[CommentMgmt] refused deleteComment messageId=" + messageId +
                        " - ngoài phạm vi companyId=" + scope.companyId +
                        ", groupId=" + scope.groupId);
            }
        }

        forwardRenderParams(actionRequest, actionResponse);
    }

    private void replyComment(ActionRequest actionRequest, ActionResponse actionResponse)
        throws Exception {

        long parentMessageId = getActionLong(actionRequest, "parentMessageId");
        String replyContent = getActionString(actionRequest, "replyContent");
        CommentFilter scope = buildFilter(actionRequest);

        System.out.println(
            "[CommentMgmt] replyComment parentMessageId=" + parentMessageId +
                " content=" + replyContent);

        if ((parentMessageId > 0) && !replyContent.isEmpty()) {
            if (!isMessageInScope(parentMessageId, scope.companyId, scope.groupId)) {
                System.out.println(
                    "[CommentMgmt] refused replyComment parentMessageId=" + parentMessageId +
                        " - ngoài phạm vi companyId=" + scope.companyId +
                        ", groupId=" + scope.groupId);

                forwardRenderParams(actionRequest, actionResponse);

                return;
            }

            try {
                MBMessage parent = MBMessageLocalServiceUtil.getMessage(parentMessageId);

                long userId = PortalUtil.getUserId(actionRequest);

                ServiceContext serviceContext = ServiceContextFactory.getInstance(
                    MBMessage.class.getName(), actionRequest);

                serviceContext.setScopeGroupId(parent.getGroupId());

                MBMessageLocalServiceUtil.addMessage(
                    userId, null, parent.getGroupId(), parent.getCategoryId(),
                    parent.getThreadId(), parentMessageId, "Re: " + parent.getSubject(),
                    replyContent, "html", Collections.emptyList(), false, 0.0, false,
                    serviceContext);

                System.out.println("[CommentMgmt] reply created successfully");
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        forwardRenderParams(actionRequest, actionResponse);
    }

    /**
     * Chặn thao tác lên message của company/site khác khi messageId bị sửa từ phía client.
     */
    private boolean isMessageInScope(long messageId, long companyId, long groupId) {
        String sql =
            "SELECT COUNT(*) FROM MBMessage " +
            "WHERE messageId = ? AND companyId = ? AND groupId = ? AND ctCollectionId = 0";

        try (Connection con = DataAccess.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setLong(1, messageId);
            ps.setLong(2, companyId);
            ps.setLong(3, groupId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1) > 0;
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    /**
     * Xoá comment và toàn bộ comment con qua service layer của Liferay, để
     * MBThread.messageCount, AssetEntry, subscription và search index được cập
     * nhật đúng. Bản cũ dùng "DELETE FROM MBMessage" trực tiếp nên bỏ qua hết
     * các bước đó, và chỉ xoá con trực tiếp -> comment lồng từ 3 cấp thành orphan.
     *
     * Duyệt post-order (lá trước, gốc sau) nên khi xoá một message thì các con
     * của nó đã bị xoá xong; thứ tự này an toàn kể cả khi
     * deleteDiscussionMessage() tự cascade.
     */
    private void deleteMessageCascade(long messageId) {
        List<Long> messageIds = new ArrayList<Long>();

        collectDepthFirst(messageId, messageIds, new HashSet<Long>());

        int deleted = 0;

        for (Long id : messageIds) {
            try {
                MBMessageLocalServiceUtil.deleteDiscussionMessage(id.longValue());

                deleted++;
            }
            catch (NoSuchMessageException nsme) {

                // Đã bị xoá cùng message cha, bỏ qua.

            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        System.out.println(
            "[CommentMgmt] deleted messageId=" + messageId + " (kể cả comment con), " +
                "tổng số message đã xoá=" + deleted + "/" + messageIds.size());
    }

    private void collectDepthFirst(long messageId, List<Long> out, Set<Long> visited) {
        if (!visited.add(Long.valueOf(messageId))) {
            return;
        }

        try {
            List<MBMessage> children = MBMessageLocalServiceUtil.getChildMessages(
                messageId, WorkflowConstants.STATUS_ANY);

            for (MBMessage child : children) {
                collectDepthFirst(child.getMessageId(), out, visited);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        out.add(Long.valueOf(messageId));
    }

    private void forwardRenderParams(ActionRequest req, ActionResponse resp) {
        String[] params = {"page", "keyword", "dateFrom", "dateTo", "category", "selectedUsers"};

        for (String p : params) {
            String val = getActionString(req, p);

            if (!val.isEmpty()) {
                resp.setRenderParameter(p, val);
            }
        }
    }

    private String getActionString(ActionRequest req, String name) {
        String val = req.getParameter(name);

        return (val != null) ? val.trim() : "";
    }

    private long getActionLong(ActionRequest req, String name) {
        String val = getActionString(req, name);

        if (val.isEmpty()) {
            return 0;
        }

        try {
            return Long.parseLong(val);
        }
        catch (NumberFormatException e) {
            return 0;
        }
    }

    private String nullToEmpty(String s) {
        return (s != null) ? s.trim() : "";
    }

    private String buildWhereClause(CommentFilter filter) {
        // companyId + groupId luôn được áp dụng: chỉ lấy comment của portal instance
        // hiện tại và của site đang mở portlet.
        StringBuilder sb = new StringBuilder(
            " WHERE msg.companyId = ? AND msg.groupId = ? AND d.ctCollectionId = 0 ");

        if (!filter.keyword.isEmpty()) {
            sb.append("AND msg.body LIKE ? ");
        }

        if (!filter.category.isEmpty()) {
            sb.append("AND EXISTS (")
              .append("  SELECT 1 FROM AssetEntryAssetCategoryRel r ")
              .append("  JOIN AssetCategory c ON r.assetCategoryId = c.categoryId ")
              .append("    AND c.ctCollectionId = 0 ")
              .append("  JOIN AssetEntry ae ON r.assetEntryId = ae.entryId ")
              .append("    AND ae.ctCollectionId = 0 ")
              .append("  WHERE ae.classPK = ja.resourcePrimKey AND c.name = ? ")
              .append("    AND r.ctCollectionId = 0 ")
              .append(") ");
        }

        if (filter.selectedUsers.length > 0) {
            sb.append("AND u.screenName IN (");

            for (int i = 0; i < filter.selectedUsers.length; i++) {
                if (i > 0) {
                    sb.append(", ");
                }

                sb.append("?");
            }

            sb.append(") ");
        }

        if (!filter.dateFrom.isEmpty()) {
            sb.append("AND DATE(msg.createDate) >= ? ");
        }

        if (!filter.dateTo.isEmpty()) {
            sb.append("AND DATE(msg.createDate) <= ? ");
        }

        return sb.toString();
    }

    private int setWhereParams(PreparedStatement ps, int idx, CommentFilter filter)
        throws Exception {

        ps.setLong(idx++, filter.companyId);
        ps.setLong(idx++, filter.groupId);

        if (!filter.keyword.isEmpty()) {
            ps.setString(idx++, "%" + filter.keyword + "%");
        }

        if (!filter.category.isEmpty()) {
            ps.setString(idx++, filter.category);
        }

        for (String user : filter.selectedUsers) {
            ps.setString(idx++, user.trim());
        }

        if (!filter.dateFrom.isEmpty()) {
            ps.setString(idx++, filter.dateFrom);
        }

        if (!filter.dateTo.isEmpty()) {
            ps.setString(idx++, filter.dateTo);
        }

        return idx;
    }

    private long countComments(CommentFilter filter) {
        String sql = "SELECT COUNT(*) " + FROM_CLAUSE + buildWhereClause(filter);

        try (Connection con = DataAccess.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            setWhereParams(ps, 1, filter);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }

    private List<Object[]> getComments(int page, CommentFilter filter) {
        List<Object[]> result = new ArrayList<Object[]>();

        String sql =
            "SELECT " +
            "    msg.body               AS noi_dung_comment, " +
            TITLE_EXPRESSION + ", " +
            "    ja.articleId           AS article_id, " +
            "    ja.urlTitle            AS url_title, " +
            "    g.friendlyURL          AS site_url, " +
            "    CONCAT(u.firstName, ' ', u.lastName) AS ho_ten, " +
            "    u.screenName           AS account, " +
            "    msg.createDate         AS ngay_comment, " +
            "    msg.threadId           AS thread_id, " +
            "    msg.messageId          AS message_id, " +
            "    (SELECT GROUP_CONCAT(ac.name SEPARATOR ', ') " +
            "     FROM AssetCategory ac " +
            "     JOIN AssetEntryAssetCategoryRel acr ON acr.assetCategoryId = ac.categoryId " +
            "       AND acr.ctCollectionId = 0 " +
            "     JOIN AssetEntry ae ON ae.entryId = acr.assetEntryId " +
            "       AND ae.ctCollectionId = 0 " +
            "     WHERE ae.classPK = ja.resourcePrimKey " +
            "       AND ac.ctCollectionId = 0) AS categories " +
            FROM_CLAUSE +
            buildWhereClause(filter) +
            "ORDER BY msg.createDate DESC LIMIT " + PAGE_SIZE + " OFFSET ?";

        try (Connection con = DataAccess.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            // TITLE_EXPRESSION nằm trong SELECT nên placeholder locale đứng TRƯỚC
            // toàn bộ placeholder của WHERE.
            ps.setString(1, filter.languageId);

            int idx = setWhereParams(ps, 2, filter);

            ps.setInt(idx, (page - 1) * PAGE_SIZE);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Object[] row = {
                        rs.getString("noi_dung_comment"),
                        rs.getString("ten_bai_viet"),
                        rs.getString("article_id"),
                        rs.getString("url_title"),
                        rs.getString("site_url"),
                        rs.getString("ho_ten"),
                        rs.getString("account"),
                        rs.getTimestamp("ngay_comment"),
                        rs.getLong("thread_id"),
                        rs.getLong("message_id"),
                        rs.getString("categories")
                    };

                    result.add(row);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    private List<String> getUsers(long companyId) {
        List<String> users = new ArrayList<String>();

        String sql =
            "SELECT screenName FROM User_ " +
            "WHERE companyId = ? AND ctCollectionId = 0 ORDER BY screenName";

        try (Connection con = DataAccess.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setLong(1, companyId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    users.add(rs.getString("screenName"));
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return users;
    }

    private static final class CommentFilter {

        private final long companyId;
        private final long groupId;
        private final String languageId;
        private final String keyword;
        private final String dateFrom;
        private final String dateTo;
        private final String category;
        private final String selectedUsersParam;
        private final String[] selectedUsers;

        private CommentFilter(
            long companyId, long groupId, String languageId, String keyword, String dateFrom,
            String dateTo, String category, String selectedUsersParam) {

            this.companyId = companyId;
            this.groupId = groupId;
            this.languageId = languageId;
            this.keyword = keyword;
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
            this.category = category;
            this.selectedUsersParam = selectedUsersParam;
            this.selectedUsers =
                selectedUsersParam.isEmpty() ? new String[0] : selectedUsersParam.split(",");
        }
    }
}
