/* global CKEDITOR */
CKEDITOR.plugins.add('multiimage', {
    init: function (editor) {
        ensureUiStyles();

        editor.addCommand('insert2Images', new CKEDITOR.dialogCommand('multiimage2Dialog'));
        editor.addCommand('insert3Images', new CKEDITOR.dialogCommand('multiimage3Dialog'));

        editor.ui.addButton('Insert2Images', {
            label: 'Chèn 2 ảnh',
            command: 'insert2Images',
            toolbar: 'insert,50',
            className: 'cke_button_image',
            icon: '/o/vec-custom-admin-ui/ckeditor/icons/insert2images.svg'
        });

        editor.ui.addButton('Insert3Images', {
            label: 'Chèn 3 ảnh',
            command: 'insert3Images',
            toolbar: 'insert,60',
            className: 'cke_button_image',
            icon: '/o/vec-custom-admin-ui/ckeditor/icons/insert3images.svg'
        });

        CKEDITOR.dialog.add('multiimage2Dialog', function (editor) {
            return buildDialog(editor, 2);
        });

        CKEDITOR.dialog.add('multiimage3Dialog', function (editor) {
            return buildDialog(editor, 3);
        });

        editor.on('instanceReady', function () {
            disableCommand('insert2Images');
            disableCommand('insert3Images');
        });

        function ensureUiStyles() {
            if (document.getElementById('vec-ck-multiimage-ui-styles')) {
                return;
            }

            var style = document.createElement('style');
            style.id = 'vec-ck-multiimage-ui-styles';
            style.textContent =
                '.vec-ck-multiimage-title{' +
                    'font-weight:700;' +
                    'margin:16px 0 8px;' +
                    'padding-bottom:8px;' +
                    'border-bottom:1px solid #e5e7eb;' +
                    'color:#1f2937;' +
                '}' +
                '.vec-ck-multiimage-preview{' +
                    'width:100%;' +
                    'height:112px;' +
                    'padding:12px;' +
                    'border:1px dashed #cbd5e1;' +
                    'border-radius:10px;' +
                    'background:linear-gradient(180deg,#fbfdff 0%,#f8fafc 100%);' +
                    'display:flex;' +
                    'align-items:center;' +
                    'justify-content:center;' +
                    'overflow:hidden;' +
                    'box-sizing:border-box;' +
                    'margin-bottom:10px;' +
                '}' +
                '.vec-ck-multiimage-preview img{' +
                    'display:block;' +
                    'max-width:100%;' +
                    'max-height:86px;' +
                    'object-fit:contain;' +
                    'border-radius:8px;' +
                    'box-shadow:0 8px 18px rgba(15,23,42,0.08);' +
                '}' +
                '.vec-ck-multiimage-empty{' +
                    'font-size:12px;' +
                    'color:#94a3b8;' +
                    'letter-spacing:0.01em;' +
                '}' +
                '.vec-ck-multiimage-error{' +
                    'font-size:12px;' +
                    'color:#dc2626;' +
                    'font-weight:600;' +
                '}';
            document.head.appendChild(style);
        }

        function disableCommand(commandName) {
            var command = editor.getCommand(commandName);

            if (!command) {
                return;
            }

            command.setState(CKEDITOR.TRISTATE_DISABLED);
        }

        function getPreviewElement(idx) {
            return document.getElementById('ck_mi_preview_' + idx);
        }

        function renderEmptyPreview(idx) {
            var previewEl = getPreviewElement(idx);
            if (!previewEl) {
                return;
            }

            previewEl.innerHTML =
                '<span class="vec-ck-multiimage-empty">Chưa chọn ảnh</span>';
        }

        function renderErrorPreview(idx) {
            var previewEl = getPreviewElement(idx);
            if (!previewEl) {
                return;
            }

            previewEl.innerHTML =
                '<span class="vec-ck-multiimage-error">URL ảnh không hợp lệ</span>';
        }

        function renderImagePreview(idx, url) {
            var previewEl = getPreviewElement(idx);
            if (!previewEl) {
                return;
            }

            if (!url) {
                renderEmptyPreview(idx);
                return;
            }

            previewEl.innerHTML = '';

            var image = document.createElement('img');
            image.src = url;
            image.alt = '';
            image.onerror = function () {
                renderErrorPreview(idx);
            };

            previewEl.appendChild(image);
        }

        function extractFileUrl(payload) {
            if (!payload) {
                return '';
            }

            if (typeof payload === 'string') {
                var trimmedPayload = payload.trim();
                if (trimmedPayload.charAt(0) === '{' || trimmedPayload.charAt(0) === '[') {
                    try {
                        return extractFileUrl(JSON.parse(trimmedPayload));
                    } catch (error) {
                    }
                }

                return payload;
            }

            var directKeys = [
                'url',
                'fileUrl',
                'fileURL',
                'value',
                'returnValue',
                'src'
            ];

            for (var i = 0; i < directKeys.length; i++) {
                var directValue = payload[directKeys[i]];
                if (typeof directValue === 'string' && directValue) {
                    return directValue;
                }
            }

            if (payload.selectedItem) {
                var selectedItemUrl = extractFileUrl(payload.selectedItem);
                if (selectedItemUrl) {
                    return selectedItemUrl;
                }
            }

            if (payload.data) {
                var nestedDataUrl = extractFileUrl(payload.data);
                if (nestedDataUrl) {
                    return nestedDataUrl;
                }
            }

            if (payload.value) {
                var nestedValueUrl = extractFileUrl(payload.value);
                if (nestedValueUrl) {
                    return nestedValueUrl;
                }
            }

            return '';
        }

        function normalizeText(value) {
            return String(value || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        }

        function findChooseButton(doc) {
            var candidates = doc.querySelectorAll(
                'button, input[type="button"], input[type="submit"], a.btn'
            );

            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                var text = normalizeText(
                    candidate.innerText ||
                    candidate.textContent ||
                    candidate.value ||
                    ''
                ).trim();

                if (!text) {
                    continue;
                }

                if (!/(chon|choose|select|use|done)/.test(text)) {
                    continue;
                }

                if (/(bo qua|cancel|close|upload|tai len|delete|xoa)/.test(text)) {
                    continue;
                }

                if (candidate.disabled || candidate.getAttribute('aria-disabled') === 'true') {
                    continue;
                }

                return candidate;
            }

            return null;
        }

        function installPopupDoubleClickSupport(pickerWindow) {
            var poller = window.setInterval(function () {
                if (!pickerWindow || pickerWindow.closed) {
                    window.clearInterval(poller);
                    return;
                }

                try {
                    var doc = pickerWindow.document;
                    if (!doc || !doc.body || doc.body.getAttribute('data-vec-ck-mi-bound') === '1') {
                        return;
                    }

                    doc.body.setAttribute('data-vec-ck-mi-bound', '1');
                    doc.addEventListener('dblclick', function (event) {
                        var clickable = event.target.closest(
                            'img, .card, .card-interactive, .list-group-item, tr, li, [role="row"]'
                        );

                        if (!clickable) {
                            return;
                        }

                        window.setTimeout(function () {
                            try {
                                var chooseButton = findChooseButton(doc);
                                if (chooseButton) {
                                    chooseButton.click();
                                }
                            } catch (error) {
                            }
                        }, 120);
                    }, true);
                } catch (error) {
                }
            }, 400);

            return function () {
                window.clearInterval(poller);
            };
        }

        function getSelectionModalEventName(url) {
            try {
                var parsedUrl = new URL(url, window.location.origin);

                return parsedUrl.searchParams.get('eventName')
                    || parsedUrl.searchParams.get('itemSelectedEventName')
                    || parsedUrl.searchParams.get('selectEventName')
                    || ('vecSelectImage' + Date.now());
            } catch (error) {
                return 'vecSelectImage' + Date.now();
            }
        }

        function openLiferaySelectionModal(url, callback) {
            if (
                !window.Liferay ||
                !window.Liferay.Util ||
                typeof window.Liferay.Util.openSelectionModal !== 'function'
            ) {
                return false;
            }

            window.Liferay.Util.openSelectionModal({
                multipleSelection: false,
                onSelect: function (selectedItem) {
                    var selectedUrl = extractFileUrl(selectedItem);
                    if (selectedUrl) {
                        callback(selectedUrl);
                    }
                },
                selectEventName: getSelectionModalEventName(url),
                title: 'Chọn ảnh',
                url: url
            });

            return true;
        }

        function openLiferayImagePicker(callback) {
            var uploadBrowseUrl = editor.config.filebrowserImageBrowseLinkUrl
                || editor.config.filebrowserImageBrowseUrl
                || editor.config.filebrowserBrowseUrl;

            if (uploadBrowseUrl) {
                if (openLiferaySelectionModal(uploadBrowseUrl, callback)) {
                    return;
                }

                var funcNum = editor._.filebrowserFn;
                var url = uploadBrowseUrl
                    + (uploadBrowseUrl.indexOf('?') === -1 ? '?' : '&')
                    + 'CKEditor=' + encodeURIComponent(editor.name)
                    + '&CKEditorFuncNum=' + encodeURIComponent(funcNum)
                    + '&langCode=' + encodeURIComponent(editor.langCode || 'vi');

                var pickerWindow = window.open(
                    url,
                    'CKBrowse',
                    'width=900,height=600,resizable=yes'
                );

                var origFunc = CKEDITOR.tools.callbacks[funcNum];
                var resolved = false;
                var teardownPopupSupport = installPopupDoubleClickSupport(pickerWindow);

                function cleanup() {
                    window.removeEventListener('message', onMessage);
                    teardownPopupSupport();
                    CKEDITOR.tools.callbacks[funcNum] = origFunc;
                }

                function resolveSelection(fileUrl) {
                    var normalizedUrl = extractFileUrl(fileUrl);
                    if (resolved || !normalizedUrl) {
                        return;
                    }

                    resolved = true;
                    cleanup();
                    callback(normalizedUrl);
                }

                function onMessage(event) {
                    if (pickerWindow && event.source !== pickerWindow) {
                        return;
                    }

                    resolveSelection(event.data);
                }

                window.addEventListener('message', onMessage);

                CKEDITOR.tools.callbacks[funcNum] = function (fileUrl) {
                    resolveSelection(fileUrl);
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
                            html: '<div class="vec-ck-multiimage-title">' +
                                'Ảnh ' + (idx + 1) + '</div>'
                        },
                        {
                            type: 'html',
                            html: '<div id="ck_mi_preview_' + idx + '" class="vec-ck-multiimage-preview">' +
                                '<span class="vec-ck-multiimage-empty">Chưa chọn ảnh</span>' +
                                '</div>'
                        },
                        {
                            type: 'hbox',
                            widths: ['74%', '26%'],
                            children: [
                                {
                                    type: 'text',
                                    id: 'url' + idx,
                                    label: 'URL ảnh ' + (idx + 1),
                                    style: 'width:100%',
                                    onChange: function () {
                                        var val = this.getValue();
                                        renderImagePreview(idx, val);
                                    }
                                },
                                {
                                    type: 'button',
                                    id: 'browse' + idx,
                                    label: 'Chọn từ Media',
                                    style: 'margin-top:22px;width:100%;height:40px;white-space:nowrap;',
                                    onClick: function () {
                                        var currentIdx = idx;
                                        var dialog = this.getDialog();
                                        openLiferayImagePicker(function (url) {
                                            dialog.getContentElement('images', 'url' + currentIdx).setValue(url);
                                            renderImagePreview(currentIdx, url);
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
                minWidth: 620,
                minHeight: 220,
                contents: [{
                    id: 'images',
                    label: 'Ảnh',
                    elements: elements
                }],
                onShow: function () {
                    for (var i = 0; i < count; i++) {
                        renderEmptyPreview(i);
                    }
                },
                onOk: function () {
                    try {
                        var dialog = this;
                        var gap = count === 2 ? '2%' : '1%';
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
