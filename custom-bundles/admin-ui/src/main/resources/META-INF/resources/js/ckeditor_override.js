/* global CKEDITOR */
(function () {
    'use strict';

    var MAX_ATTEMPTS = 40;
    var attempts = 0;

    function waitForCKEditor() {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
            console.warn('[AdminUI] CKEditor not found after ' + MAX_ATTEMPTS + ' attempts');
            return;
        }

        if (typeof CKEDITOR === 'undefined') {
            setTimeout(waitForCKEditor, 300);
            return;
        }

        console.log('[AdminUI] CKEditor found, attaching hooks...');
        attachCKEditorHooks();
    }

    function registerExternalPlugins() {
        CKEDITOR.plugins.addExternal(
            'multiimage',
            '/o/vec-custom-admin-ui/ckeditor/plugins/multiimage/',
            'plugin.js'
        );
    }

    function attachCKEditorHooks() {
        registerExternalPlugins();

        CKEDITOR.on('instanceCreated', function (ev) {
            var editor = ev.editor;

            editor.on('configLoaded', function () {
                var extra = editor.config.extraPlugins || '';
                if (extra.indexOf('autogrow') === -1) {
                    editor.config.extraPlugins = extra
                        ? extra + ',autogrow,multiimage'
                        : 'autogrow,multiimage';
                }
                editor.config.autoGrow_minHeight = 150;
                editor.config.autoGrow_maxHeight = 0;
                editor.config.autoGrow_onStartup = true;
                editor.config.autoGrow_bottomSpace = 20;
                editor.config.resize_enabled = false;

                if (!Array.isArray(editor.config.contentsCss)) {
                    editor.config.contentsCss = [editor.config.contentsCss || ''];
                }
                var cssUrl = '/o/vec-custom-admin-ui/css/ckeditor-custom.css';
                if (editor.config.contentsCss.indexOf(cssUrl) === -1) {
                    editor.config.contentsCss.push(cssUrl);
                }
            });
        });

        CKEDITOR.on('instanceReady', function (ev) {
            var editor = ev.editor;
            console.log('[AdminUI] CKEditor instanceReady:', editor.name);

            initStickyToolbar(editor);

            function fixImages() {
                setTimeout(function () {
                    if (!editor.document) return;
                    var imgs = editor.document.$.querySelectorAll('img');
                    imgs.forEach(function (img) {
                        img.removeAttribute('width');
                        img.removeAttribute('height');
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';
                    });
                }, 200);
            }

            editor.on('paste', fixImages);
            editor.on('drop', fixImages);
            editor.on('afterCommandExec', function (e) {
                var name = e.data.name;
                if (name === 'image' || name === 'image2' || name === 'imageInsert') {
                    fixImages();
                }
            });

            // BUG 3 FIX: Force autogrow
            function triggerAutogrow() {
                if (editor.plugins && editor.plugins.autogrow) {
                    editor.execCommand('autogrow');
                }
            }

            setTimeout(triggerAutogrow, 300);
            editor.on('change', triggerAutogrow);
            editor.on('key', function () {
                setTimeout(triggerAutogrow, 50);
            });
        });
    }

    function initStickyToolbar(editor) {
        var editorContainer = editor.container && editor.container.$;
        if (!editorContainer) return;

        var toolbar = editorContainer.querySelector('.cke_top');
        if (!toolbar) return;

        var scrollParent = getScrollParent(editorContainer);
        var target = scrollParent === window ? window : scrollParent;

        if (target._ckStickyAttached) return;
        target._ckStickyAttached = true;

        target.addEventListener('scroll', function () {
            var rect = editorContainer.getBoundingClientRect();
            var toolbarH = toolbar.offsetHeight;

            if (rect.top < 0 && rect.bottom > toolbarH) {
                toolbar.style.position = 'sticky';
                toolbar.style.top = '0';
                toolbar.style.zIndex = '9999';
                toolbar.classList.add('cke-toolbar-sticky');
            } else {
                toolbar.style.position = '';
                toolbar.style.top = '';
                toolbar.style.zIndex = '';
                toolbar.classList.remove('cke-toolbar-sticky');
            }
        });
    }

    function getScrollParent(el) {
        var parent = el.parentElement;
        while (parent) {
            var style = window.getComputedStyle(parent);
            var overflow = style.overflow + style.overflowY;
            if (/auto|scroll|overlay/.test(overflow)) return parent;
            parent = parent.parentElement;
        }
        return window;
    }

    waitForCKEditor();
})();
