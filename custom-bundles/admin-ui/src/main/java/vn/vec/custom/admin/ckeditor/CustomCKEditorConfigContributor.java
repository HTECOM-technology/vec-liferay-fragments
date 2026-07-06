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

        // 1. Basic editor behavior
        jsonObject.put("height", 420);
        jsonObject.put("resize_enabled", true);
        jsonObject.put("versionCheck", false);

        String removePlugins = jsonObject.getString("removePlugins");
        if (removePlugins != null && !removePlugins.isEmpty()) {
            if (!removePlugins.contains("elementspath")) {
                jsonObject.put("removePlugins", removePlugins + ",elementspath");
            }
        } else {
            jsonObject.put("removePlugins", "elementspath");
        }

        // 2. Extra plugins
        String existingPlugins = jsonObject.getString("extraPlugins");
        if (existingPlugins != null && !existingPlugins.isEmpty()) {
            jsonObject.put("extraPlugins", existingPlugins + ",autogrow,multiimage");
        } else {
            jsonObject.put("extraPlugins", "autogrow,multiimage");
        }

        // 3. Register external multiimage plugin
        JSONObject pluginsJSON = jsonObject.getJSONObject("externalPlugins");
        if (pluginsJSON == null) {
            pluginsJSON = _jsonFactory.createJSONObject();
        }
        JSONObject multiimagePlugin = _jsonFactory.createJSONObject();
        multiimagePlugin.put("path", "/o/vec-custom-admin-ui/ckeditor/plugins/multiimage/");
        multiimagePlugin.put("fileName", "plugin.js");
        pluginsJSON.put("multiimage", multiimagePlugin);
        jsonObject.put("externalPlugins", pluginsJSON);

        // 4. AutoGrow settings
        jsonObject.put("autoGrow_minHeight", 200);
        jsonObject.put("autoGrow_maxHeight", 0);
        jsonObject.put("autoGrow_onStartup", true);
        jsonObject.put("autoGrow_bottomSpace", 10);

        // 5. Custom CSS
        JSONArray contentsCss = _jsonFactory.createJSONArray();
        contentsCss.put("/o/frontend-editor-ckeditor-web/ckeditor/contents.css");
        contentsCss.put("/o/vec-custom-admin-ui/css/ckeditor-custom.css");
        jsonObject.put("contentsCss", contentsCss);

        // 6. Toolbar
        JSONArray toolbar = _jsonFactory.createJSONArray();

        toolbar.put(createGroup("Format", "Styles", "Font", "FontSize"));
        toolbar.put(createGroup("Bold", "Italic", "Underline", "Strike", "RemoveFormat"));
        toolbar.put(createGroup("TextColor", "BGColor"));
        toolbar.put(createGroup("NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote"));
        toolbar.put(createGroup("JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"));
        toolbar.put(createGroup("Link", "Unlink"));
        toolbar.put(createGroup("Image", "Insert2Images", "Insert3Images", "Table"));
        toolbar.put(createGroup("PasteFromWord", "Undo", "Redo"));
        toolbar.put(createGroup("Source"));

        jsonObject.put("toolbar", toolbar);
        jsonObject.put("toolbar_editInPlace", toolbar);
        jsonObject.put("toolbar_simple", toolbar);
        jsonObject.put("toolbar_email", toolbar);
        jsonObject.put("toolbar_liferay", toolbar);
        jsonObject.put("toolbar_liferayArticle", toolbar);

        jsonObject.put(
            "removeButtons",
            "Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,PasteText," +
                "Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button," +
                "ImageButton,HiddenField,Flash,Smiley,SpecialChar,PageBreak," +
                "Iframe,Language,BidiLtr,BidiRtl,About"
        );

        // 7. Content behavior
        jsonObject.put("format_tags", "p;h2;h3;h4;pre");
        jsonObject.put("pasteFromWordRemoveFontStyles", true);
        jsonObject.put("pasteFromWordRemoveStyles", false);
        jsonObject.put("forcePasteAsPlainText", false);
        jsonObject.put("entities", false);
        jsonObject.put("basicEntities", false);
        jsonObject.put("entities_latin", false);
        jsonObject.put("entities_greek", false);
        jsonObject.put("linkShowAdvancedTab", false);
        jsonObject.put("linkShowTargetTab", true);
        jsonObject.put("image_previewText", " ");
        jsonObject.put("removeDialogTabs", "image:advanced;link:advanced");
        jsonObject.put("enterMode", 1);
        jsonObject.put("shiftEnterMode", 2);

        JSONObject boldStyle = _jsonFactory.createJSONObject();
        boldStyle.put("element", "strong");
        jsonObject.put("coreStyles_bold", boldStyle);

        JSONObject italicStyle = _jsonFactory.createJSONObject();
        italicStyle.put("element", "em");
        jsonObject.put("coreStyles_italic", italicStyle);

        // 8. Allowed content
        String existingAllowedContent = jsonObject.getString("extraAllowedContent");
        String extraAllowedContent =
            "p h2 h3 h4 h5 h6 blockquote pre code strong em u s sub sup[class,id]" +
                "{text-align,margin-left,margin-right,width,height,color,background-color};" +
            "ul ol li;" +
            "table thead tbody tfoot tr th td[scope,colspan,rowspan]" +
                "{width,height,text-align};" +
            "a[!href,target,title,rel];" +
            "img[!src,alt,width,height,title]{float,margin,margin-left,margin-right,width,height};" +
            "div span[class,id,data-*]{text-align,margin-left,margin-right,width,height,color,background-color};" +
            "div(ck-image-grid,ck-image-grid-2,ck-image-grid-3)" +
                "{text-align,margin-left,margin-right,width,height};" +
            "figure figcaption[class,id]{float,text-align,margin-left,margin-right,width,height};" +
            "*[class,data-*]";

        if (existingAllowedContent != null && !existingAllowedContent.isEmpty()) {
            jsonObject.put(
                "extraAllowedContent",
                existingAllowedContent + ";" + extraAllowedContent
            );
        } else {
            jsonObject.put("extraAllowedContent", extraAllowedContent);
        }

        // 9. Keep common media classes/styles created by custom plugins and dialogs
        jsonObject.put(
            "disallowedContent",
            "script; *[on*]"
        );
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
