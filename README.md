# strucdom

## Installation:

```sh
npm i strucdom
```

## Imports:

```js
import {
    DOCUMENT_NODE,
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,

    NodeType,

    RawValueTags,
    SpaceCharacters,
    UnclosedHtmlTags,
    QuotesCharacters,
    HtmlTags,
    ResultCode,
} from './0.js';

console.dir(NodeType); // { DOCUMENT_NODE: 9, ELEMENT_NODE: 1, ... }

console.dir(RawValueTags); // ["script", "style"]
console.dir(HtmlTags); // ["a", "abbr", "acronym", "address", ... ]
console.dir(QuotesCharacters); // ['"', "'"]
console.dir(UnclosedHtmlTags); // [ "area", "base", "br", "col", ... ]
console.dir(SpaceCharacters); // [" ", "\t", "\n", "\f", "\r"]

ResultCode.SUCCESS;
ResultCode.TAG_NOT_OPENED;

```

* Parsing of raw script and style tags is not yet supported.

## Object initialization:

```js
var
  html = `<div data-hello="world">textContent<!--comment--></div><!--comment2-->another text`,

  Container = Array,

  document = (
        new Node(
            DOCUMENT_NODE, // type
            "#document", // name
            
            new Container(), // children
            null, // parent
            null, // ownerDocument

            "", // data
            false, // specified
        )
  ),

  result_code = (
    parse(
      html, document,
      0, html.length,
      UnclosedHtmlTags, SpaceCharacters, QuotesCharacters,
      Node, Container,
    )
  ),

  separator = " / ",

  div = document.first_child()
;

div.set_attribute("data-hello", "new_value");

console.dir(
  document.outer_html(UnclosedHtmlTags)
);
// "<div data-hello="new_value">textContent<!--comment--></div><!--comment2-->another text"

console.dir(
  div.get_attribute("data-hello")
);
// "new_value"

console.dir(
  document.text_content(
    UnclosedHtmlTags,
    separator,
  )
);
// "textContent / another text"

```

## Structure:

```js
import {NodeType} from "strucdom"

var
    node = document.children[1],

    is_element = false,
    is_document = false,
    is_attribute = false,
    is_text = false,
    is_comment = false,

    type = "",
    name = ""
;

// Type of node:

type = node.type;

console.log(is_element = (type === NodeType.ELEMENT_NODE)); // true

console.log(is_document = (type === NodeType.DOCUMENT_NODE)); // false
console.log(is_attribute = (type === NodeType.ATTRIBUTE_NODE)); // false
console.log(is_text = (type === NodeType.TEXT_NODE)); // false
console.log(is_comment = (type === NodeType.COMMENT_NODE)); // false


// Name of a node:

name = node.name;

if (is_element) && console.dir(name);
// "div"
// * or an another arbitrary value that does not include a space, a slash character, ">", "<"


if (is_document) && console.dir(name); // "#document"
if (is_attribute) && console.dir(name); // "new_value" or an another arbitrary value
if (is_text) && console.dir(name); // "#text"
if (is_comment) && console.dir(name); // "#comment"


// Children:

node.children; // Container of included nodes


// Parent node:
node.parent;

// Data:
node.data; // value of attribute, text and comment node;

// Specified:
node.specified;
// a boolean value that indicates whether the node object was modified after parsing

```

## Methods:

### General:

```js
import {create_document, UnclosedHtmlTags} from 'strucdom';

var
    Container = Array,
    document_childs = new Container(),

    node = create_document(document_childs), // document
    separator = " | ",

    new_node = null
;

node.text_content(UnclosedHtmlTags, separator); // ""
node.inner_html(UnclosedHtmlTags); // ""
node.outer_html(UnclosedHtmlTags); // ""

node.create_document(new Container());
node.create_text("text value");
node.create_comment("comment value");
node.create_attribute("key", "value");
node.create_element("div", new Container());

node.append_child(
    new_node = node.create_text("hello_world")
);

new_mode === node.first_child() === node.last_child(); // true

node
.first_child()
.replace_with(
    new_node = node.create_comment("and now comment instead of comment")
)

node.remove_child(new_node);
// or:
new_node.remove();

node.first_child(); // null
node.last_child(); // null

node.has_child_nodes(); // true or false

node.append_child(node.create_element("div", new Container()));

new_node = node.create_element("div", new Container());

new_node.append_child(new_node.create_text("hello_world"));

node.append_child(new_node);

node.last_child().previous_sibling().text_content(); // "hello_world"

node.first_child().next_sibling() === new_mode; // true

```


### Element methods:

```js

var node = document.create_element("div",new Array());

node.set_attribute('key', "value");
console.dir(
    node.get_attribute("key")
);
// "value"

```


# Next updates:

* Methods:

- querySelector
- querySelectorAll
