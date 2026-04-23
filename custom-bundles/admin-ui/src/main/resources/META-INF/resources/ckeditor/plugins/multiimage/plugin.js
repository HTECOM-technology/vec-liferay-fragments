/* global CKEDITOR */
CKEDITOR.plugins.add('multiimage', {
    init: function (editor) {

        editor.addCommand('insert2Images', new CKEDITOR.dialogCommand('multiimage2Dialog'));
        editor.addCommand('insert3Images', new CKEDITOR.dialogCommand('multiimage3Dialog'));

        editor.ui.addButton('Insert2Images', {
            label: 'Chèn 2 ảnh',
            command: 'insert2Images',
            toolbar: 'insert,50',
            className: 'cke_button_image'
        });

        editor.ui.addButton('Insert3Images', {
            label: 'Chèn 3 ảnh',
            command: 'insert3Images',
            toolbar: 'insert,60',
            className: 'cke_button_image'
        });

        CKEDITOR.dialog.add('multiimage2Dialog', function (editor) {
            return buildDialog(editor, 2);
        });

        CKEDITOR.dialog.add('multiimage3Dialog', function (editor) {
            return buildDialog(editor, 3);
        });

        function openLiferayImagePicker(callback) {
            var uploadBrowseUrl = editor.config.filebrowserImageBrowseLinkUrl
                || editor.config.filebrowserImageBrowseUrl
                || editor.config.filebrowserBrowseUrl;

            if (uploadBrowseUrl) {
                var funcNum = editor._.filebrowserFn;
                var url = uploadBrowseUrl
                    + (uploadBrowseUrl.indexOf('?') === -1 ? '?' : '&')
                    + 'CKEditor=' + encodeURIComponent(editor.name)
                    + '&CKEditorFuncNum=' + encodeURIComponent(funcNum)
                    + '&langCode=' + encodeURIComponent(editor.langCode || 'vi');

                window.open(url, 'CKBrowse', 'width=900,height=600,resizable=yes');

                var origFunc = CKEDITOR.tools.callbacks[funcNum];
                CKEDITOR.tools.callbacks[funcNum] = function (fileUrl) {
                    callback(fileUrl);
                    CKEDITOR.tools.callbacks[funcNum] = origFunc;
                };
            } else {
                var fallbackUrl = window.prompt('Nhập URL hình ảnh:');
                if (fallbackUrl) callback(fallbackUrl);
            }
        }

        function buildDialog(editor, count) {
            var elements = [];

            for (var i = 0; i < count; i++) {
                (function (idx) {
                    elements.push(
                        {
                            type: 'html',
                            html: '<p style="font-weight:bold;margin:12px 0 4px 0;' +
                                'border-bottom:1px solid #eee;padding-bottom:4px">' +
                                'Ảnh ' + (idx + 1) + '</p>'
                        },
                        {
                            type: 'html',
                            html: '<div id="ck_mi_preview_' + idx + '" ' +
                                'style="width:100%;height:80px;background:#f5f5f5;' +
                                'border:1px dashed #ccc;display:flex;align-items:center;' +
                                'justify-content:center;margin-bottom:6px;overflow:hidden;">' +
                                '<span style="color:#999;font-size:12px">Chưa chọn ảnh</span>' +
                                '</div>'
                        },
                        {
                            type: 'hbox',
                            widths: ['75%', '25%'],
                            children: [
                                {
                                    type: 'text',
                                    id: 'url' + idx,
                                    label: 'URL ảnh ' + (idx + 1),
                                    style: 'width:100%',
                                    onChange: function () {
                                        var val = this.getValue();
                                        var previewEl = document.getElementById('ck_mi_preview_' + idx);
                                        if (previewEl && val) {
                                            previewEl.innerHTML = '<img src="' + val + '" ' +
                                                'style="max-height:80px;max-width:100%;object-fit:contain;" ' +
                                                'onerror="this.parentNode.innerHTML=\'<span style=color:#f00;font-size:11px>URL không hợp lệ</span>\'" />';
                                        }
                                    }
                                },
                                {
                                    type: 'button',
                                    id: 'browse' + idx,
                                    label: 'Chọn từ Media',
                                    style: 'margin-top:14px;',
                                    onClick: function () {
                                        var currentIdx = idx;
                                        var dialog = this.getDialog();
                                        openLiferayImagePicker(function (url) {
                                            dialog.getContentElement('images', 'url' + currentIdx).setValue(url);
                                            var previewEl = document.getElementById('ck_mi_preview_' + currentIdx);
                                            if (previewEl) {
                                                previewEl.innerHTML = '<img src="' + url + '" ' +
                                                    'style="max-height:80px;max-width:100%;object-fit:contain;" />';
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            type: 'text',
                            id: 'alt' + idx,
                            label: 'Mô tả (alt)',
                            style: 'width:100%'
                        }
                    );
                })(i);
            }

            return {
                title: 'Chèn ' + count + ' ảnh trên 1 hàng',
                minWidth: 520,
                minHeight: 150,
                contents: [{
                    id: 'images',
                    label: 'Ảnh',
                    elements: elements
                }],
                onOk: function () {
                    try {
                        var dialog = this;
                        var gap = count === 2 ? '4%' : '3%';
                        var html = '<div class="ck-image-grid ck-image-grid-' + count + '" ' +
                            'style="display:flex;gap:' + gap + ';margin:1em 0;width:100%;">';

                        for (var i = 0; i < count; i++) {
                            var url = dialog.getValueOf('images', 'url' + i);
                            var alt = dialog.getValueOf('images', 'alt' + i) || '';
                            if (!url) continue;
                            html += '<figure style="margin:0;flex:1;min-width:0;">' +
                                '<img src="' + url + '" alt="' + alt + '" ' +
                                'style="width:100%;height:200px;object-fit:cover;' +
                                'display:block;border-radius:4px;max-width:100%;" />' +
                                '</figure>';
                        }
                        html += '</div><p>&nbsp;</p>';
                        editor.insertHtml(html);
                    } catch (e) {
                        console.error('[MultiImage Plugin] Error:', e);
                    }
                }
            };
        }
    }
});
