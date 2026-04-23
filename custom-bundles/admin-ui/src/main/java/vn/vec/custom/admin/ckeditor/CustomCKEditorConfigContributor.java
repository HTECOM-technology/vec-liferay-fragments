package vn.vec.custom.admin.ckeditor;

import com.liferay.portal.kernel.editor.configuration.BaseEditorConfigContributor;
import com.liferay.portal.kernel.editor.configuration.EditorConfigContributor;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.portlet.RequestBackedPortletURLFactory;
import com.liferay.portal.kernel.theme.ThemeDisplay;

import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
    property = {
        "editor.name=ckeditor",
        "editor.name=ckeditor_classic",
        "service.ranking:Integer=200"
    },
    service = EditorConfigContributor.class
)
public class CustomCKEditorConfigContributor
    extends BaseEditorConfigContributor {

    @Override
    public void populateConfigJSONObject(
        JSONObject jsonObject,
        Map<String, Object> inputEditorTaglibAttributes,
        ThemeDisplay themeDisplay,
        RequestBackedPortletURLFactory requestBackedPortletURLFactory) {

        // 1. Extra plugins
        String existingPlugins = jsonObject.getString("extraPlugins");
        if (existingPlugins != null && !existingPlugins.isEmpty()) {
            jsonObject.put("extraPlugins", existingPlugins + ",autogrow,multiimage");
        } else {
            jsonObject.put("extraPlugins", "autogrow,multiimage");
        }

        // 2. Register external multiimage plugin
        JSONObject pluginsJSON = jsonObject.getJSONObject("externalPlugins");
        if (pluginsJSON == null) {
            pluginsJSON = _jsonFactory.createJSONObject();
        }
        JSONObject multiimagePlugin = _jsonFactory.createJSONObject();
        multiimagePlugin.put("path", "/o/vec-custom-admin-ui/ckeditor/plugins/multiimage/");
        multiimagePlugin.put("fileName", "plugin.js");
        pluginsJSON.put("multiimage", multiimagePlugin);
        jsonObject.put("externalPlugins", pluginsJSON);

        // 3. AutoGrow settings
        jsonObject.put("autoGrow_minHeight", 200);
        jsonObject.put("autoGrow_maxHeight", 0);
        jsonObject.put("autoGrow_onStartup", true);
        jsonObject.put("autoGrow_bottomSpace", 10);

        // 4. Custom CSS
        JSONArray contentsCss = _jsonFactory.createJSONArray();
        contentsCss.put("/o/frontend-editor-ckeditor-web/ckeditor/contents.css");
        contentsCss.put("/o/vec-custom-admin-ui/css/ckeditor-custom.css");
        jsonObject.put("contentsCss", contentsCss);

        // 5. Allowed content
        jsonObject.put(
            "extraAllowedContent",
            "div(ck-image-grid,ck-image-grid-2,ck-image-grid-3)[style];" +
            "figure[style];img[src,alt,style,width,height]"
        );

        // 6. Toolbar
        JSONArray toolbar = _jsonFactory.createJSONArray();

        toolbar.put(createGroup("Undo", "Redo"));
        toolbar.put(createGroup("Bold", "Italic", "Underline", "Strike"));
        toolbar.put(createGroup("NumberedList", "BulletedList"));
        toolbar.put(createGroup("Link", "Unlink"));
        toolbar.put(createGroup("Image", "Insert2Images", "Insert3Images"));
        toolbar.put(createGroup("Table"));
        toolbar.put(createGroup("Source"));

        jsonObject.put("toolbar", toolbar);
        jsonObject.put("toolbar_editInPlace", toolbar);
        jsonObject.put("toolbar_simple", toolbar);
        jsonObject.put("toolbar_email", toolbar);
        jsonObject.put("toolbar_liferay", toolbar);
        jsonObject.put("toolbar_liferayArticle", toolbar);
    }

    private JSONArray createGroup(String... buttons) {
        JSONArray group = _jsonFactory.createJSONArray();
        for (String button : buttons) {
            group.put(button);
        }
        return group;
    }

    @Reference
    private JSONFactory _jsonFactory;

}
