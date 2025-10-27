import { TAG_NAMES as $, NS, hasUnescapedText } from '../common/html/i.js';
import { escapeText, escapeAttribute } from '../entities/entities.js';
import { defaultTreeAdapter } from '../tree-adapters/default.js';

export var
    empty_str = () => "",

    VOID_ELEMENTS = new Set([
        $.AREA,
        $.BASE,
        $.BASEFONT,
        $.BGSOUND,
        $.BR,
        $.COL,
        $.EMBED,
        $.FRAME,
        $.HR,
        $.IMG,
        $.INPUT,
        $.KEYGEN,
        $.LINK,
        $.META,
        $.PARAM,
        $.SOURCE,
        $.TRACK,
        $.WBR,
    ]),

    defaultOpts = { treeAdapter: defaultTreeAdapter, scriptingEnabled: true },

    isVoidElement = (
        (node, options) => {
            return (options.treeAdapter.isElementNode(node) &&
                options.treeAdapter.getNamespaceURI(node) === NS.HTML &&
                VOID_ELEMENTS.has(options.treeAdapter.getTagName(node)));
        }
    ),

    serialize = (node, options) => {
        var
            opts = {
                ...defaultOpts,
                ...options
            }
        ;
        return (
            isVoidElement(node, opts)
            ? ""
            : serializeChildNodes(node, opts)
        );
    },

    serializeOuter = (node, options) => {
        return serializeNode(node, { ...defaultOpts, ...options });
    },

    serializeChildNodes(parentNode, options) {
        var
            html = '',
            ta = options.treeAdapter,

            container = (
                ta.isElementNode(parentNode)
                &&
                (ta.getTagName(parentNode) === $.TEMPLATE)
                &&
                (
                    (ta.getNamespaceURI(parentNode) === NS.HTML)
                    ? ta.getTemplateContent(parentNode)
                    : parentNode
                )
            ),
            childNodes = ta.getChildNodes(container)
        ;
        
        if (childNodes) {
            for (var currentNode of childNodes) {
                html += serializeNode(currentNode, options);
            }
        }
        return html;
    },

    serializeNode(node, options) {
        var
            ta = options.treeAdapter
        ;
        return (
            ta.isElementNode(node)
            ? serializeElement
            :
            ta.isTextNode(node)
            ? serializeTextNode
            :
            ta.isCommentNode(node)
            ? serializeCommentNode
            :
            ta.isDocumentTypeNode(node)
            ? serializeDocumentTypeNode
            : empty_str
        )(node, options);
    },

    serializeElement = (node, options) => {
        var tn = options.treeAdapter.getTagName(node);
        return (
            `<${
                tn
            }${
                serializeAttributes(node, options)
            }>${
                isVoidElement(node, options)
                ? ''
                : `${
                    serializeChildNodes(
                        node,
                        options
                    )
                }</${
                    tn
                }>`
            }`
        );
    },

    serializeAttributes = (node, opt) => {
        var
            treeAdapter = opt.treeAdapter,
            html = ''
        ;
        
        for (var attr of treeAdapter.getAttrList(node)) {
            html += ' ';
            if (attr.namespace) {
                switch (attr.namespace) {
                    case NS.XML: {
                        html += `xml:${attr.name}`;
                        break;
                    }
                    case NS.XMLNS: {
                        if (attr.name !== 'xmlns') {
                            html += 'xmlns:';
                        }
                        html += attr.name;
                        break;
                    }
                    case NS.XLINK: {
                        html += `xlink:${attr.name}`;
                        break;
                    }
                    default: {
                        html += `${attr.prefix}:${attr.name}`;
                    }
                }
            }
            else {
                html += attr.name;
            }
            html += `="${escapeAttribute(attr.value)}"`;
        }
        return html;
    },

    serializeTextNode = (node, options) => {
        var
            treeAdapter = options.treeAdapter,
            content = treeAdapter.getTextNodeContent(node),
            parent = treeAdapter.getParentNode(node),
            parentTn = (
                parent
                &&
                treeAdapter.isElementNode(parent)
                &&
                treeAdapter.getTagName(parent)
            )
        ;

        return (
            parentTn
            &&
            (treeAdapter.getNamespaceURI(parent) === NS.HTML)
            &&
            (
                hasUnescapedText(parentTn, options.scriptingEnabled)
                ? content
                : escapeText(content)
            )
        );
    },

    serializeCommentNode = (node, o) => {
        return `<!--${o.treeAdapter.getCommentNodeContent(node)}-->`;
    },

    serializeDocumentTypeNode = (node, o) => {
        return `<!DOCTYPE ${o.treeAdapter.getDocumentTypeNodeName(node)}>`;
    }
;
