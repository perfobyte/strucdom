import {
    DOCUMENT_NODE,
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,

    Node,
    parse,

    NodeType,

    RawValueTags,
    SpaceCharacters,
    UnclosedHtmlTags as unclosed,
    QuotesCharacters,
    HtmlTags,
    ResultCode,

    create_document,
    
} from '@perfobyte/strucdom';

var
    document = create_document(new Array()),
    node = (
        document.append_child(
            document.create_element("div",new Array())
        )
    )
;

console.dir(node.outer_html(unclosed)); // '<div/>'
node.set_attribute('key', "value");

console.dir(node.outer_html(unclosed)); // '<div key="value"/>'
console.dir(
    node.get_attribute("key")
);
// "value"

node.remove_attribute("key");
console.dir(node.outer_html(unclosed)); // '<div/>'
console.log(node.get_attribute("key") === null) // true
