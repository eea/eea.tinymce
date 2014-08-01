// jslint:disable
// fork of original ploneStyle plugin done by Rob Gietema
(function() {
    tinymce.create("tinymce.plugins.EEAPloneStylePlugin", {
        _previousNode: null,
        _styles: null,
        _control: null,
        labels: null,
        init: function(ed, url) {
            this._init(ed, url);
        },
        _init: function(ed, url) {
            var t = this;
            this._styles = eval(ed.getParam("theme_advanced_styles"));
            this.labels = eval(ed.getParam("labels"));
            ed.addCommand("mceSetStyle", function(ui, v) {
                t._execCommand(ed, v, t._styles);
            });
            ed.onNodeChange.add(this._nodeChange, this);
        },
        _execCommand: function(ed, v, styles) {
            var e = ed.selection.getNode();
            if (e) {
                if (v === "-") {
                    return;
                }
                function ReplaceTag (curelm, newtag) {
                    if (curelm.nodeName.toLowerCase() !==newtag) {
                        var newelm, length, a, b, c;
                        if (((curelm.nodeName.toLowerCase() === "td") || (curelm.nodeName.toLowerCase() === "th")) && ((newtag !=="td") && (newtag !=="th"))) {
                            newelm = ed.getDoc().createElement(curelm.nodeName);
                            var child = newelm.appendChild(ed.getDoc().createElement(newtag));
                            for (c = 0, length = curelm.childNodes.length; c < length; c++) {
                                child.appendChild(curelm.childNodes[c].cloneNode(1));
                            }
                            for (a = 0, length = curelm.attributes.length; a < length; a++) {
                                ed.dom.setAttrib(newelm, curelm.attributes[a].name, ed.dom.getAttrib(e, curelm.attributes[a].name));
                            }
                        } else {
                            newelm = ed.getDoc().createElement(newtag);
                            for (c= 0, length = curelm.childNodes.length; c < length; c++) {
                                newelm.appendChild(curelm.childNodes[c].cloneNode(1));
                            }
                            for (a = 0, length = curelm.attributes.length; a < length; a++) {
                                ed.dom.setAttrib(newelm, curelm.attributes[a].name, ed.dom.getAttrib(e, curelm.attributes[a].name));
                            }
                        }
                        b = ed.selection.getBookmark();
                        curelm.parentNode.replaceChild(newelm, curelm);
                        ed.selection.moveToBookmark(b);
                        curelm = newelm;
                    }
                    return curelm;
                }

                var selected_style = styles[parseInt(v)];
                var tag = selected_style.tag,
                    className = selected_style.className,
                    style_type = selected_style.type,
                    wrapped_template, bookmark, n;
                    if (style_type === "Tables") {
                        switch (tag) {
                            case "th":
                            case "td":
                                if (n = this._getParentNode(e, ["th", "td"])) {
                                    n = ReplaceTag(n, tag);
                                    n.className = className;
                                }
                                break;
                            case "tr":
                                if (n = this._getParentNode(e, ["tr"])) {
                                    n.className = className;
                                }
                                break;
                            case "table":
                                if (n = this._getParentNode(e, ["table"])) {
                                    n.className = className;
                                }
                                break;
                        }
                    }
                    else if (style_type === "Lists" || (tag === "ol" || tag === "ul")) {
                        if (tag === "dd" || tag === "dt") {
                            e = ReplaceTag(e, tag);
                        } else {
                            n = this._getParentNode(e, ["ol", "ul"]);
                            n.className = className;
                        }
                    }
                    else {
                        if ((tag === "") && (className === "")) {
                            ed.execCommand("RemoveFormat", false, null);
                        }
                        // #20461 wrap selection with content if style found within style_type
                        else if (style_type === "Wrap selection with") {
                            ed.focus();
                            bookmark = ed.selection.getBookmark();
                            wrapped_template = '<' + tag + ' class="' + className + '">' +
                                ed.selection.getContent() + '</' + tag + '>';
                            ed.selection.setContent(wrapped_template);
                            ed.selection.moveToBookmark(bookmark);
                        }
                        else if (tag === "span") {
                            ed.formatter.apply(styles[parseInt(v)].title);
                        }
                        else {
                            tinymce.each(ed.selection.getSelectedBlocks(), function (e) {
                                if ((tag === "") && (className === "")) {
                                    ed.execCommand("RemoveFormat", false, null);
                                } else {
                                    if (e.nodeName.toLowerCase() !=="body") {
                                        if (e.tagName.toLowerCase() !==tag.toLowerCase()) {
                                            e = ReplaceTag(e, tag);
                                        }
                                        if (className !=="") {
                                            var classnames = ed.dom.getAttrib(e, "class").split(" ");
                                            var newclassnames = [];
                                            newclassnames.push(className);
                                            for (var i = 0; i < classnames.length; i++) {
                                                if ((classnames[i] === "image-left") || (classnames[i] === "image-right") || (classnames[i] === "image-inline") || (classnames[i] === "captioned")) {
                                                    newclassnames.push(classnames[i]);
                                                }
                                            }
                                            e.className = newclassnames.join(" ");
                                        }
                                    }
                                }
                            });
                        }
                }
                ed.nodeChanged()
            }
        },
        _nodeChange: function(ed, cm, n) {
            if (tinyMCE.activeEditor.id !==ed.id) {
                return;
            }
            if (n === this._previousNode) {
                return;
            } else {
                this._previousNode = n;
            }
            this._rebuildListBox(ed, n);
        },
        _inArray: function(s, a) {
            for (var i = 0; i < a.length; i++) {
                if (s === a[i]) {
                    return true;
                }
            }
            return false;
        },
        _getParentNode: function(e, a) {
            a.push("body");
            var p = e;
            while (!this._inArray(p.nodeName.toLowerCase(), a)) {
                if (p.parentNode === null) {
                    return false;
                } else {
                    p = p.parentNode;
                }
            }
            if (p.nodeName.toLowerCase() === "body") {
                return false;
            } else {
                return p;
            }
        },
        _registerFormats: function(ed, styles) {
            var i, s, format, tagParam;
            for (i = 0; i < styles.length; i++) {
                s = styles[i];
                format = {
                    classes: (s.className || ""),
                    wrapper: (s.tag === "blockquote" || s.tag === "div")
                };
                tagParam = s.tag === "span" ? "inline" : "block";
                format[tagParam] = s.tag;
                ed.formatter.register(s.title, format);
            }
        },
        _rebuildListBox: function(ed, n) {
            if (this._control === null) {
                return;
            }
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function(obj, start) {
                    for (var i = (start || 0), j = this.length; i < j; i++) {
                        if (this[i] === obj) {
                            return i;
                        }
                    }
                    return -1;
                };
            }
            this._registerFormats(ed, this._styles);
            this._control.items = [];
            this._control.oldID = null;
            this._control.select();
            var t = this._getParentNode(n, ["td", "th"]);
            var ul = this._getParentNode(n, ["ul"]);
            var ol = this._getParentNode(n, ["ol"]);
            var dl = this._getParentNode(n, ["dl"]);
            var tag, style_title;
            for (var i = 0; i < this._styles.length; i++) {
                if ( !t && this._styles[i].type === "Tables") {
                  continue;
                }
                if ( !ul && !ol && !dl && this._styles[i].type === "Lists" ) {
                  continue;
                }
                tag = this._styles[i].tag;
                if ((((tag !=="td") && (tag !=="th") && (tag !=="tr") && (tag !=="table")) || t) && (tag !=="ul" || ul) && (tag !=="ol" || ol) && (((tag !=="dl") && (tag !=="dd") && (tag !=="dt")) || dl)) {
                    style_title = this._styles[i].title;
                    this._control.add(style_title, this._styles[i].className === "-" ? "-" : i, {
                        "class": this._styles[i].className === "-" ? "mceMenuItemTitle" : "mce_formatPreview mce_" + this._styles[i].tag
                    });
                    var p = this._getParentNode(n, ["th", "td", "p", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "div", "span", "blockquote", "samp", "code", "ul", "ol", "dl", "img"]);
                    var il = false;
                    if (p && (p.nodeName.toLowerCase() === "ul" || p.nodeName.toLowerCase() === "ol")) {
                        var lc = ed.dom.getAttrib(p, "class");
                        if (lc === this._styles[i].className) {
                            il = true;
                        }
                    } else {
                        if (p && p.nodeName.toLowerCase() === "dl") {
                            var d = this._getParentNode(n, ["dd", "dt"]);
                            if (d && d.nodeName.toLowerCase() === tag) {
                                il = true;
                                p = d;
                            }
                        } else {
                            il = true;
                        }
                    }
                    if (p && (p.nodeName.toLowerCase() === this._styles[i].tag) && (p.className.indexOf(this._styles[i].className) !==-1) && il) {
                        this._control.select(i);
                    }
                }
            }
            if (this._control.menu) {
                tinymce.DOM.remove("menu_" + this._control.menu.id);
            }
            this._control.renderMenu();
        },
        createControl: function(n, cm) {

          if (n === "style") {
                this._control = cm.createListBox("style_" + tinyMCE.activeEditor.id, {
                    title: this.labels.label_style_ldots,
                    cmd: "mceSetStyle"
                });
                return this._control;
            }
            return null;
        },
        getInfo: function() {
            return {
                longname: "EEA Plone style",
                author: "David Ichim",
                authorurl: "http://plone.org",
                infourl: "http://plone.org/products/tinymce",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });
    tinymce.PluginManager.add("eeaplonestyle", tinymce.plugins.EEAPloneStylePlugin);
})();
