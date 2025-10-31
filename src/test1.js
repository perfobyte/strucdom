(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // conf/NodeType.js
  var NodeType_exports = {};
  __export(NodeType_exports, {
    ATTRIBUTE_NODE: () => ATTRIBUTE_NODE,
    COMMENT_NODE: () => COMMENT_NODE,
    DOCUMENT_NODE: () => DOCUMENT_NODE,
    ELEMENT_NODE: () => ELEMENT_NODE,
    TEXT_NODE: () => TEXT_NODE
  });
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;

  // conf/UnclosedHtmlTags.js
  var UnclosedHtmlTags_default = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "!doctype"
  ];

  // conf/HtmlTags.js
  var HtmlTags_default = [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "bgsound",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "command",
    "content",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "image",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "nobr",
    "noembed",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "plaintext",
    "portal",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "shadow",
    "slot",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "xmp"
  ];

  // conf/SpaceCharacters.js
  var SpaceCharacters_default = [" ", "	", "\n", "\f", "\r"];

  // conf/QuotesCharacters.js
  var QuotesCharacters_default = ['"', "'"];

  // conf/RawValueTags.js
  var RawValueTags_default = ["script", "style"];

  // f/Node/f/i.js
  var i_exports = {};
  __export(i_exports, {
    ATTRIBUTE_NODE: () => ATTRIBUTE_NODE,
    COMMENT_NODE: () => COMMENT_NODE,
    DOCUMENT_NODE: () => DOCUMENT_NODE,
    ELEMENT_NODE: () => ELEMENT_NODE,
    HtmlTags: () => HtmlTags_default,
    NodeType: () => NodeType_exports,
    QuotesCharacters: () => QuotesCharacters_default,
    RawValueTags: () => RawValueTags_default,
    SpaceCharacters: () => SpaceCharacters_default,
    TEXT_NODE: () => TEXT_NODE,
    UnclosedHtmlTags: () => UnclosedHtmlTags_default,
    _inner_html: () => i_default,
    _outer_html: () => i_default2,
    _text_content: () => i_default3,
    append_child: () => append_default,
    first_child: () => first_default,
    get_attribute: () => get_default,
    has_child_nodes: () => has_nodes_default,
    last_child: () => last_default,
    next_sibling: () => next_default,
    previous_sibling: () => previous_default,
    quote_rgx: () => quote_rgx,
    remove: () => remove_default2,
    remove_child: () => remove_default,
    replace_with: () => replace_with_default,
    set_attribute: () => set_default
  });

  // f/Node/f/child/first.js
  var first_default = function() {
    return this.children[0];
  };

  // f/Node/f/child/last.js
  var last_default = function() {
    var childs = this.children;
    return childs[childs.length - 1];
  };

  // f/Node/f/child/has_nodes.js
  var has_nodes_default = function() {
    return this.children.length > 0;
  };

  // f/Node/f/child/append.js
  var append_default = function(node) {
    var prev_parent = node.parent;
    return prev_parent && prev_parent.remove_child(node), (node.parent = this).children.push(node);
  };

  // f/Node/f/child/remove.js
  var remove_default = function(node) {
    var i = 0, childs = this.children;
    return node.parent = null, (i = childs.indexOf(node)) === -1 || childs.splice(i, 1), void 0;
  };

  // f/Node/f/sibling/next.js
  var next_default = function() {
    var parent = null, childs = null, i = 0;
    return (parent = this.parent) ? (i = (childs = parent.children).indexOf(this) + 1) < childs.length ? childs[i] : null : null;
  };

  // f/Node/f/sibling/previous.js
  var previous_default = function() {
    var parent = null, childs = null, i = 0;
    return (parent = this.parent) ? (i = (childs = parent.children).indexOf(this) - 1) >= 0 ? childs[i] : null : null;
  };

  // f/Node/f/other/replace_with.js
  var replace_with_default = function(node) {
    var parent = null, childs = null, i = 0, prev_parent = node.parent;
    return prev_parent && prev_parent.remove_child(node), (parent = this.parent) ? (this.parent = null, node.parent = parent, (childs = parent.children)[childs.indexOf(this)] = node) : null;
  };

  // f/Node/f/other/remove.js
  var remove_default2 = function() {
    return this.parent.remove_child(this);
  };

  // f/Node/f/html/inner/default.js
  var default_default = function(unclosed) {
    var childs = this.children, ATTRIBUTE_NODE2 = this.ATTRIBUTE_NODE, inside = "", i = 0, l = childs.length, node = null, nodeType = 0;
    for (; i < l; i++) {
      if ((nodeType = (node = childs[i]).type) !== ATTRIBUTE_NODE2) {
        inside += node.outer_html(unclosed);
      }
    }
    return inside;
  };

  // f/Node/f/html/inner/data.js
  var data_default = function(unclosed) {
    return this.data;
  };

  // f/Node/f/html/inner/document.js
  var document_default = function(unclosed) {
    var i = 0, childs = this.children, l = childs.length, v = "";
    for (; i < l; i++) {
      v += childs[i].outer_html(unclosed);
    }
    ;
    return v;
  };

  // f/Node/f/html/inner/i.js
  var i_default = {
    [ELEMENT_NODE]: default_default,
    [ATTRIBUTE_NODE]: data_default,
    [TEXT_NODE]: data_default,
    [COMMENT_NODE]: data_default,
    [DOCUMENT_NODE]: document_default
  };

  // f/Node/f/html/outer/default.js
  var default_default2 = function(unclosed) {
    var childs = this.children, ATTRIBUTE_NODE2 = this.ATTRIBUTE_NODE, this_name = this.name, v = `<${this_name}`, inside = "", i = 0, l = childs.length, node = null, name = "", data = "", nodeType = 0;
    for (; i < l; i++) {
      if ((nodeType = (node = childs[i]).type) === ATTRIBUTE_NODE2) {
        v += ` ${node.outer_html(unclosed)}`;
      }
    }
    return (inside = this.inner_html(unclosed)) ? `${v}>${inside}</${this_name}>` : unclosed.includes(this_name) ? `${v}>` : `${v}/>`;
  };

  // f/Node/f/html/outer/comment.js
  var comment_default = function() {
    return `<!--${this.data}-->`;
  };

  // f/Node/f/html/outer/attribute.js
  var attribute_default = function() {
    var d = this.data, n = this.name, space = this.SpaceCharacters, q = this.QuotesCharacters, i = 0, l = space.length;
    return this.data.length > 0 ? d.includes('"') ? `${n}="${d.replace(this.quote_rgx, "&quot;")}"` : `${n}="${d}"` : n;
  };

  // f/Node/f/html/outer/i.js
  var i_default2 = {
    [ELEMENT_NODE]: default_default2,
    [ATTRIBUTE_NODE]: attribute_default,
    [TEXT_NODE]: data_default,
    [COMMENT_NODE]: comment_default,
    [DOCUMENT_NODE]: document_default
  };

  // f/Node/f/attribute/get.js
  var get_default = function(name, value) {
    var childs = this.children, Node2 = this.constructor, ATTRIBUTE_NODE2 = this.ATTRIBUTE_NODE, i = 0, l = childs.length, node = null;
    a: {
      for (; i < l; i++) {
        if ((node = childs[i]).type === ATTRIBUTE_NODE2 && node.name === name) {
          node.data = value;
          node.specified || (node.specified = true);
          break a;
        }
      }
      ;
      childs.push(new Node2(
        ATTRIBUTE_NODE2,
        name,
        null,
        this,
        this.ownerDocument,
        value,
        true
      ));
    }
    return void 0;
  };

  // f/Node/f/attribute/set.js
  var set_default = function(name) {
    var childs = this.children, Node2 = this.constructor, ATTRIBUTE_NODE2 = this.ATTRIBUTE_NODE, i = 0, l = childs.length, v = null, node = null;
    for (; i < l; i++) {
      if ((node = childs[i]).type === ATTRIBUTE_NODE2 && node.name === name) {
        v = node.data;
        break;
      }
    }
    ;
    return v;
  };

  // f/Node/f/text_content/default.js
  var default_default3 = function(unclosed) {
    var childs = this.children, TEXT_NODE2 = this.TEXT_NODE, ELEMENT_NODE2 = this.ELEMENT_NODE, inside = "", i = 0, l = childs.length, node = null, nodeType = 0;
    for (; i < l; i++) {
      if ((nodeType = (node = childs[i]).type) === TEXT_NODE2) {
        inside += node.outer_html(unclosed);
      } else if (nodeType === ELEMENT_NODE2) {
        inside += node.text_content(unclosed);
      }
    }
    return inside;
  };

  // f/Node/f/text_content/i.js
  var i_default3 = {
    [ELEMENT_NODE]: default_default3,
    [ATTRIBUTE_NODE]: data_default,
    [TEXT_NODE]: data_default,
    [COMMENT_NODE]: data_default,
    [DOCUMENT_NODE]: document_default
  };

  // f/Node/f/i.js
  var quote_rgx = /"/g;

  // f/Node/i.js
  function Node(type, name, children, parent, ownerDocument, data, specified) {
    this.name = name;
    this.children = children;
    this.parent = parent;
    this.ownerDocument = ownerDocument;
    this.data = data;
    this.specified = specified;
    this.inner_html = this._inner_html[this.type = type];
    this.outer_html = this._outer_html[type];
    this.text_content = this._text_content[type];
  }
  Node.prototype = i_exports;
  var i_default4 = Node;

  // f/parse.js
  var parse_default = (v, document, i, l, unclosed, space, quotes, Node2, Array2) => {
    var result_code = 0, j = 0, q = 0, index = 0, from = i, IN = TEXT_NODE, attr_with_value = false, is_end_tag = false, is_tag_end = false, is_unclosed = false, current_parent = document, current_childs = document.children, node = null, c = "", tag_name = "", value = "", quote = "", second_c = "";
    a: while (i < l) {
      c = v[i];
      if (IN === TEXT_NODE) {
        if (c === "<") {
          i > from && current_childs.push(new Node2(
            TEXT_NODE,
            "#text",
            null,
            current_parent,
            document,
            v.substring(from, i),
            false
          ));
          if ((second_c = v[i + 1]) === "!" && v[i + 2] === "-" && v[i + 3] === "-") {
            from = i += 4;
            while (i < l && !(v[i] === "-" && v[i + 1] === "-" && v[i + 2] === ">")) {
              i++;
            }
            ;
            current_childs.push(new Node2(
              COMMENT_NODE,
              "#comment",
              null,
              current_parent,
              document,
              v.substring(from, i),
              false
            ));
            from = i += 3;
          } else if (second_c === "/") {
            from = i += 2;
            while (i < l && v[i] !== ">") {
              i++;
            }
            ;
            if (current_parent && current_parent.name === (tag_name = v.substring(from, i).trim().toLowerCase())) {
              current_childs = (current_parent = current_parent.parent).children;
            } else {
              result_code = 1;
              break a;
            }
            from = ++i;
          } else {
            from = ++i;
            while (i < l) {
              c = v[i];
              if (c === ">" || c === "/" || space.includes(c)) {
                break;
              }
              ;
              i++;
            }
            tag_name = v.substring(from, i).toLowerCase();
            is_tag_end = v[i] === ">";
            is_end_tag = v[i] === "/" && v[i + 1] === ">";
            node = new Node2(
              ELEMENT_NODE,
              tag_name,
              new Array2(),
              current_parent,
              document,
              "",
              false
            );
            current_childs.push(node);
            is_unclosed = unclosed.includes(tag_name);
            current_childs = (current_parent = node).children;
            IN = ELEMENT_NODE;
          }
        } else {
          i++;
        }
      } else {
        while (i < l && space.includes(v[i])) i++;
        is_end_tag = (c = v[i]) === "/" && v[i + 1] === ">";
        is_tag_end = c === ">";
        if (is_end_tag || is_tag_end) {
          is_unclosed && (current_childs = (current_parent = current_parent.parent).children, is_unclosed = false);
          from = i += is_end_tag ? 2 : 1;
          IN = TEXT_NODE;
        } else {
          from = i;
          while (i < l) {
            if ((c = v[i]) === "=" || c === ">" || c === "/" || space.includes(c)) {
              break;
            }
            ;
            i++;
          }
          j = i;
          attr_with_value = v[i] === "=";
          if (attr_with_value) {
            i++;
            while (i < l && space.includes(v[i])) i++;
            if ((index = quotes.indexOf(
              c = v[i]
            )) === -1) {
              q = i++;
              is_end_tag = is_tag_end = false;
              while (is_tag_end = (c = v[i]) === ">", is_end_tag = c === "/" && v[i + 1] === ">", !is_tag_end && !is_end_tag && i < l && !space.includes(c)) {
                i++;
              }
              ;
              value = v.substring(q, i);
            } else {
              q = ++i;
              quote = quotes[index];
              while (i < l && v[i] !== quote) i++;
              value = v.substring(q, i);
              if (i < l && v[i] === quote) i++;
              while (i < l && space.includes(v[i])) i++;
              is_tag_end = (c = v[i]) === ">";
              is_end_tag = c === "/" && v[i + 1] === ">";
            }
            current_childs.push(
              new Node2(
                ATTRIBUTE_NODE,
                v.substring(from, j).toLowerCase(),
                null,
                current_parent,
                document,
                value,
                false
              )
            );
            if (is_end_tag || is_tag_end) {
              is_unclosed && (current_childs = (current_parent = current_parent.parent).children, is_unclosed = false);
              from = i += is_end_tag ? 2 : 1;
              IN = TEXT_NODE;
              continue;
            }
          } else if (is_end_tag || is_tag_end) {
            is_unclosed && (current_childs = (current_parent = current_parent.parent).children, is_unclosed = false);
            from = i += is_end_tag ? 2 : 1;
            IN = TEXT_NODE;
          } else {
            current_childs.push(
              new Node2(
                ATTRIBUTE_NODE,
                v.substring(from, j).toLowerCase(),
                null,
                current_parent,
                document,
                "",
                false
              )
            );
          }
        }
        ;
      }
    }
    ;
    return result_code;
  };

  // test.js
  (() => {
    var value = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Parser Stress Test</title>

        <meta name="description" content="Parser test &quot;HTML stress&quot; example with nested tags and tricky attributes.">
        <link rel="stylesheet" href="style.css">
      </head>
      <body id="main" class="page test-page" data-info="x'y&quot;z &lt;3" hidden>

        <!-- HEADER SECTION -->
        <header class="header" role="banner">
          <h1 class='title "weird"' data-level="1">HTML Parser Test</h1>
          <nav class="nav">
            <ul>
              <li><a href="/" title='Home "page"'>Home</a></li>
              <li><a href="/about" title="About &gt; Us">About</a></li>
              <li><a href="/contact" disabled>Contact</a></li>
            </ul>
          </nav>
        </header>

        <!-- MAIN SECTION -->
        <main>
          <section id="intro">
            <p>Hello <b>World</b>!<br>This is a <i>stress</i> test of <code>&lt;HTML&gt;</code> parsing.</p>
            <img src="photo.jpg" alt='image > sample' width=300 height=200>
          </section>

          <!-- FORM TEST -->
          <section id="form-section">
            <form action="/submit" method="post" novalidate autocomplete="off">
              <input type="text" name="username" placeholder="Enter &quot;username&quot;" required>
              <input type="password" name="password" value='p@ss"word'>
              <input type="checkbox" name="agree" checked disabled>
              <textarea name="comments">Multiline
      text &lt;div&gt; inside textarea
      and quotes "here"</textarea>
              <button type="submit">Submit</button>
            </form>
          </section>

          <!-- TABLE TEST -->
          <section>
            <table border="1" cellpadding="2" cellspacing="0">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>&amp;lt;test&gt;</td></tr>
                <tr><td>2</td><td>Bob</td><td>"quoted"</td></tr>
                <tr><td>3</td><td>Charlie</td><td>'single'</td></tr>
              </tbody>
            </table>
          </section>

          <!-- SCRIPT TEST -->
          

          <!-- COMMENT EDGE CASES -->
          <!-- single-line comment -->
          <!-- nested <!-- fake nested --> comment -->

          <!-- SVG TEST -->
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="green" fill="yellow" />
            <text x="10" y="90">SVG &lt;text&gt;</text>
          </svg>

          <!-- VOID ELEMENTS -->
          <br>
          <hr>
          <input type="hidden" value="done">
          <meta charset="UTF-8">
          <link rel="icon" href="favicon.ico">
          <source src="audio.mp3" type="audio/mpeg">
        </main>

        <!-- FOOTER -->
        <footer>
          <p>Made with &lt;3 in 2025. Email: <a href="mailto:test@example.com">test@example.com</a></p>
        </footer>

      </body>
      </html>
    `, Container = Array, document = new i_default4(
      DOCUMENT_NODE,
      "#document",
      new Container(),
      null,
      null,
      "",
      false
    ), code = parse_default(
      value,
      document,
      0,
      value.length,
      UnclosedHtmlTags_default,
      SpaceCharacters_default,
      QuotesCharacters_default,
      i_default4,
      Container
    );
    return console.log(`code = ${code}`), console.log(
      document.outer_html(UnclosedHtmlTags_default)
    );
  })();
})();
//# sourceMappingURL=test1.js.map
