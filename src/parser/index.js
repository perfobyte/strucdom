import { Tokenizer, TokenizerMode } from '../tokenizer/index.ts';
import { OpenElementStack } from './open-element-stack.ts';
import { FormattingElementList, EntryType } from './formatting-element-list.ts';
import { defaultTreeAdapter } from '../tree-adapters/default.ts';
import * as doctype from '../common/doctype.ts';
import * as foreignContent from '../common/foreign_content/i.js';
import { ERR } from '../common/ERR.js';
import * as unicode from '../common/unicode.ts';
import { TAG_ID as $, TAG_NAMES as TN, NS, ATTRS, SPECIAL_ELEMENTS, DOCUMENT_MODE, NUMBERED_HEADERS, getTagID, } from '../common/html.ts';
import { TokenType, getTokenAttr, } from '../common/token.ts';
var HIDDEN_INPUT_TYPE = 'hidden';
var AA_OUTER_LOOP_ITER = 8;
var AA_INNER_LOOP_ITER = 3;
var InsertionMode;
(function (InsertionMode) {
    InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
    InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
    InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
    InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
    InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
    InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
    InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
    InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
    InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
    InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
    InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
    InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
    InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
    InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
    InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
    InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
    InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
    InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
    InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
    InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
    InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
    InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
    InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
var BASE_LOC = {
    startLine: -1,
    startCol: -1,
    startOffset: -1,
    endLine: -1,
    endCol: -1,
    endOffset: -1,
};
var TABLE_STRUCTURE_TAGS = new Set([$.TABLE, $.TBODY, $.TFOOT, $.THEAD, $.TR]);
var defaultParserOptions = {
    scriptingEnabled: true,
    sourceCodeLocationInfo: false,
    treeAdapter: defaultTreeAdapter,
    onParseError: null,
};
export class Parser {
    constructor(options, document, fragmentContext = null, scriptHandler = null) {
        this.fragmentContext = fragmentContext;
        this.scriptHandler = scriptHandler;
        this.currentToken = null;
        this.stopped = false;
        this.insertionMode = InsertionMode.INITIAL;
        this.originalInsertionMode = InsertionMode.INITIAL;
        this.headElement = null;
        this.formElement = null;
        this.currentNotInHTML = false;
        this.tmplInsertionModeStack = [];
        this.pendingCharacterTokens = [];
        this.hasNonWhitespacePendingCharacterToken = false;
        this.framesetOk = true;
        this.skipNextNewLine = false;
        this.fosterParentingEnabled = false;
        this.options = {
            ...defaultParserOptions,
            ...options,
        };
        this.treeAdapter = this.options.treeAdapter;
        this.onParseError = this.options.onParseError;
        if (this.onParseError) {
            this.options.sourceCodeLocationInfo = true;
        }
        this.document = document ?? this.treeAdapter.createDocument();
        this.tokenizer = new Tokenizer(this.options, this);
        this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
        this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : $.UNKNOWN;
        this._setContextModes(fragmentContext ?? this.document, this.fragmentContextID);
        this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
    }
    static parse(html, options) {
        var parser = new this(options);
        parser.tokenizer.write(html, true);
        return parser.document;
    }
    static getFragmentParser(fragmentContext, options) {
        var opts = {
            ...defaultParserOptions,
            ...options,
        };
        fragmentContext ?? (fragmentContext = opts.treeAdapter.createElement(TN.TEMPLATE, NS.HTML, []));
        var documentMock = opts.treeAdapter.createElement('documentmock', NS.HTML, []);
        var parser = new this(opts, documentMock, fragmentContext);
        if (parser.fragmentContextID === $.TEMPLATE) {
            parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
        }
        parser._initTokenizerForFragmentParsing();
        parser._insertFakeRootElement();
        parser._resetInsertionMode();
        parser._findFormInFragmentContext();
        return parser;
    }
    getFragment() {
        var rootElement = this.treeAdapter.getFirstChild(this.document);
        var fragment = this.treeAdapter.createDocumentFragment();
        this._adoptNodes(rootElement, fragment);
        return fragment;
    }
    _err(token, code, beforeToken) {
        if (!this.onParseError)
            return;
        var loc = token.location ?? BASE_LOC;
        var err = {
            code,
            startLine: loc.startLine,
            startCol: loc.startCol,
            startOffset: loc.startOffset,
            endLine: beforeToken ? loc.startLine : loc.endLine,
            endCol: beforeToken ? loc.startCol : loc.endCol,
            endOffset: beforeToken ? loc.startOffset : loc.endOffset,
        };
        this.onParseError(err);
    }
    onItemPush(node, tid, isTop) {
        this.treeAdapter.onItemPush?.(node);
        if (isTop && this.openElements.stackTop > 0)
            this._setContextModes(node, tid);
    }
    onItemPop(node, isTop) {
        if (this.options.sourceCodeLocationInfo) {
            this._setEndLocation(node, this.currentToken);
        }
        this.treeAdapter.onItemPop?.(node, this.openElements.current);
        if (isTop) {
            var current;
            var currentTagId;
            if (this.openElements.stackTop === 0 && this.fragmentContext) {
                current = this.fragmentContext;
                currentTagId = this.fragmentContextID;
            }
            else {
                ({ current, currentTagId } = this.openElements);
            }
            this._setContextModes(current, currentTagId);
        }
    }
    _setContextModes(current, tid) {
        var isHTML = current === this.document || (current && this.treeAdapter.getNamespaceURI(current) === NS.HTML);
        this.currentNotInHTML = !isHTML;
        this.tokenizer.inForeignNode =
            !isHTML && current !== undefined && tid !== undefined && !this._isIntegrationPoint(tid, current);
    }
    _switchToTextParsing(currentToken, nextTokenizerState) {
        this._insertElement(currentToken, NS.HTML);
        this.tokenizer.state = nextTokenizerState;
        this.originalInsertionMode = this.insertionMode;
        this.insertionMode = InsertionMode.TEXT;
    }
    switchToPlaintextParsing() {
        this.insertionMode = InsertionMode.TEXT;
        this.originalInsertionMode = InsertionMode.IN_BODY;
        this.tokenizer.state = TokenizerMode.PLAINTEXT;
    }
    _getAdjustedCurrentElement() {
        return this.openElements.stackTop === 0 && this.fragmentContext
            ? this.fragmentContext
            : this.openElements.current;
    }
    _findFormInFragmentContext() {
        var node = this.fragmentContext;
        while (node) {
            if (this.treeAdapter.getTagName(node) === TN.FORM) {
                this.formElement = node;
                break;
            }
            node = this.treeAdapter.getParentNode(node);
        }
    }
    _initTokenizerForFragmentParsing() {
        if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS.HTML) {
            return;
        }
        switch (this.fragmentContextID) {
            case $.TITLE:
            case $.TEXTAREA: {
                this.tokenizer.state = TokenizerMode.RCDATA;
                break;
            }
            case $.STYLE:
            case $.XMP:
            case $.IFRAME:
            case $.NOEMBED:
            case $.NOFRAMES:
            case $.NOSCRIPT: {
                this.tokenizer.state = TokenizerMode.RAWTEXT;
                break;
            }
            case $.SCRIPT: {
                this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
                break;
            }
            case $.PLAINTEXT: {
                this.tokenizer.state = TokenizerMode.PLAINTEXT;
                break;
            }
            default:
        }
    }
    _setDocumentType(token) {
        var name = token.name || '';
        var publicId = token.publicId || '';
        var systemId = token.systemId || '';
        this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
        if (token.location) {
            var documentChildren = this.treeAdapter.getChildNodes(this.document);
            var docTypeNode = documentChildren.find((node) => this.treeAdapter.isDocumentTypeNode(node));
            if (docTypeNode) {
                this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
            }
        }
    }
    _attachElementToTree(element, location) {
        if (this.options.sourceCodeLocationInfo) {
            var loc = location && {
                ...location,
                startTag: location,
            };
            this.treeAdapter.setNodeSourceCodeLocation(element, loc);
        }
        if (this._shouldFosterParentOnInsertion()) {
            this._fosterParentElement(element);
        }
        else {
            var parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.appendChild(parent ?? this.document, element);
        }
    }
    _appendElement(token, namespaceURI) {
        var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
    }
    _insertElement(token, namespaceURI) {
        var element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
        this.openElements.push(element, token.tagID);
    }
    _insertFakeElement(tagName, tagID) {
        var element = this.treeAdapter.createElement(tagName, NS.HTML, []);
        this._attachElementToTree(element, null);
        this.openElements.push(element, tagID);
    }
    _insertTemplate(token) {
        var tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
        var content = this.treeAdapter.createDocumentFragment();
        this.treeAdapter.setTemplateContent(tmpl, content);
        this._attachElementToTree(tmpl, token.location);
        this.openElements.push(tmpl, token.tagID);
        if (this.options.sourceCodeLocationInfo)
            this.treeAdapter.setNodeSourceCodeLocation(content, null);
    }
    _insertFakeRootElement() {
        var element = this.treeAdapter.createElement(TN.HTML, NS.HTML, []);
        if (this.options.sourceCodeLocationInfo)
            this.treeAdapter.setNodeSourceCodeLocation(element, null);
        this.treeAdapter.appendChild(this.openElements.current, element);
        this.openElements.push(element, $.HTML);
    }
    _appendCommentNode(token, parent) {
        var commentNode = this.treeAdapter.createCommentNode(token.data);
        this.treeAdapter.appendChild(parent, commentNode);
        if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
        }
    }
    _insertCharacters(token) {
        var parent;
        var beforeElement;
        if (this._shouldFosterParentOnInsertion()) {
            ({ parent, beforeElement } = this._findFosterParentingLocation());
            if (beforeElement) {
                this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
            }
            else {
                this.treeAdapter.insertText(parent, token.chars);
            }
        }
        else {
            parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.insertText(parent, token.chars);
        }
        if (!token.location)
            return;
        var siblings = this.treeAdapter.getChildNodes(parent);
        var textNodeIdx = beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length;
        var textNode = siblings[textNodeIdx - 1];
        var tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);
        if (tnLoc) {
            var { endLine, endCol, endOffset } = token.location;
            this.treeAdapter.updateNodeSourceCodeLocation(textNode, { endLine, endCol, endOffset });
        }
        else if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
        }
    }
    _adoptNodes(donor, recipient) {
        for (var child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
            this.treeAdapter.detachNode(child);
            this.treeAdapter.appendChild(recipient, child);
        }
    }
    _setEndLocation(element, closingToken) {
        if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
            var ctLoc = closingToken.location;
            var tn = this.treeAdapter.getTagName(element);
            var endLoc = closingToken.type === TokenType.END_TAG && tn === closingToken.tagName
                ? {
                    endTag: { ...ctLoc },
                    endLine: ctLoc.endLine,
                    endCol: ctLoc.endCol,
                    endOffset: ctLoc.endOffset,
                }
                : {
                    endLine: ctLoc.startLine,
                    endCol: ctLoc.startCol,
                    endOffset: ctLoc.startOffset,
                };
            this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
        }
    }
    shouldProcessStartTagTokenInForeignContent(token) {
        if (!this.currentNotInHTML)
            return false;
        var current;
        var currentTagId;
        if (this.openElements.stackTop === 0 && this.fragmentContext) {
            current = this.fragmentContext;
            currentTagId = this.fragmentContextID;
        }
        else {
            ({ current, currentTagId } = this.openElements);
        }
        if (token.tagID === $.SVG &&
            this.treeAdapter.getTagName(current) === TN.ANNOTATION_XML &&
            this.treeAdapter.getNamespaceURI(current) === NS.MATHML) {
            return false;
        }
        return (this.tokenizer.inForeignNode ||
            ((token.tagID === $.MGLYPH || token.tagID === $.MALIGNMARK) &&
                currentTagId !== undefined &&
                !this._isIntegrationPoint(currentTagId, current, NS.HTML)));
    }
    _processToken(token) {
        switch (token.type) {
            case TokenType.CHARACTER: {
                this.onCharacter(token);
                break;
            }
            case TokenType.NULL_CHARACTER: {
                this.onNullCharacter(token);
                break;
            }
            case TokenType.COMMENT: {
                this.onComment(token);
                break;
            }
            case TokenType.DOCTYPE: {
                this.onDoctype(token);
                break;
            }
            case TokenType.START_TAG: {
                this._processStartTag(token);
                break;
            }
            case TokenType.END_TAG: {
                this.onEndTag(token);
                break;
            }
            case TokenType.EOF: {
                this.onEof(token);
                break;
            }
            case TokenType.WHITESPACE_CHARACTER: {
                this.onWhitespaceCharacter(token);
                break;
            }
        }
    }
    _isIntegrationPoint(tid, element, foreignNS) {
        var ns = this.treeAdapter.getNamespaceURI(element);
        var attrs = this.treeAdapter.getAttrList(element);
        return foreignContent.isIntegrationPoint(tid, ns, attrs, foreignNS);
    }
    _reconstructActiveFormattingElements() {
        var listLength = this.activeFormattingElements.entries.length;
        if (listLength) {
            var endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === EntryType.Marker || this.openElements.contains(entry.element));
            var unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
            for (var i = unopenIdx; i >= 0; i--) {
                var entry = this.activeFormattingElements.entries[i];
                this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
                entry.element = this.openElements.current;
            }
        }
    }
    _closeTableCell() {
        this.openElements.generateImpliedEndTags();
        this.openElements.popUntilTableCellPopped();
        this.activeFormattingElements.clearToLastMarker();
        this.insertionMode = InsertionMode.IN_ROW;
    }
    _closePElement() {
        this.openElements.generateImpliedEndTagsWithExclusion($.P);
        this.openElements.popUntilTagNamePopped($.P);
    }
    _resetInsertionMode() {
        for (var i = this.openElements.stackTop; i >= 0; i--) {
            switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
                case $.TR: {
                    this.insertionMode = InsertionMode.IN_ROW;
                    return;
                }
                case $.TBODY:
                case $.THEAD:
                case $.TFOOT: {
                    this.insertionMode = InsertionMode.IN_TABLE_BODY;
                    return;
                }
                case $.CAPTION: {
                    this.insertionMode = InsertionMode.IN_CAPTION;
                    return;
                }
                case $.COLGROUP: {
                    this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
                    return;
                }
                case $.TABLE: {
                    this.insertionMode = InsertionMode.IN_TABLE;
                    return;
                }
                case $.BODY: {
                    this.insertionMode = InsertionMode.IN_BODY;
                    return;
                }
                case $.FRAMESET: {
                    this.insertionMode = InsertionMode.IN_FRAMESET;
                    return;
                }
                case $.SELECT: {
                    this._resetInsertionModeForSelect(i);
                    return;
                }
                case $.TEMPLATE: {
                    this.insertionMode = this.tmplInsertionModeStack[0];
                    return;
                }
                case $.HTML: {
                    this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
                    return;
                }
                case $.TD:
                case $.TH: {
                    if (i > 0) {
                        this.insertionMode = InsertionMode.IN_CELL;
                        return;
                    }
                    break;
                }
                case $.HEAD: {
                    if (i > 0) {
                        this.insertionMode = InsertionMode.IN_HEAD;
                        return;
                    }
                    break;
                }
            }
        }
        this.insertionMode = InsertionMode.IN_BODY;
    }
    _resetInsertionModeForSelect(selectIdx) {
        if (selectIdx > 0) {
            for (var i = selectIdx - 1; i > 0; i--) {
                var tn = this.openElements.tagIDs[i];
                if (tn === $.TEMPLATE) {
                    break;
                }
                else if (tn === $.TABLE) {
                    this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
                    return;
                }
            }
        }
        this.insertionMode = InsertionMode.IN_SELECT;
    }
    _isElementCausesFosterParenting(tn) {
        return TABLE_STRUCTURE_TAGS.has(tn);
    }
    _shouldFosterParentOnInsertion() {
        return (this.fosterParentingEnabled &&
            this.openElements.currentTagId !== undefined &&
            this._isElementCausesFosterParenting(this.openElements.currentTagId));
    }
    _findFosterParentingLocation() {
        for (var i = this.openElements.stackTop; i >= 0; i--) {
            var openElement = this.openElements.items[i];
            switch (this.openElements.tagIDs[i]) {
                case $.TEMPLATE: {
                    if (this.treeAdapter.getNamespaceURI(openElement) === NS.HTML) {
                        return { parent: this.treeAdapter.getTemplateContent(openElement), beforeElement: null };
                    }
                    break;
                }
                case $.TABLE: {
                    var parent = this.treeAdapter.getParentNode(openElement);
                    if (parent) {
                        return { parent, beforeElement: openElement };
                    }
                    return { parent: this.openElements.items[i - 1], beforeElement: null };
                }
                default:
            }
        }
        return { parent: this.openElements.items[0], beforeElement: null };
    }
    _fosterParentElement(element) {
        var location = this._findFosterParentingLocation();
        if (location.beforeElement) {
            this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
        }
        else {
            this.treeAdapter.appendChild(location.parent, element);
        }
    }
    _isSpecialElement(element, id) {
        var ns = this.treeAdapter.getNamespaceURI(element);
        return SPECIAL_ELEMENTS[ns].has(id);
    }
    onCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            characterInForeignContent(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                tokenInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HTML: {
                tokenBeforeHtml(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD: {
                tokenBeforeHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD: {
                tokenInHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD_NO_SCRIPT: {
                tokenInHeadNoScript(this, token);
                break;
            }
            case InsertionMode.AFTER_HEAD: {
                tokenAfterHead(this, token);
                break;
            }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE: {
                characterInBody(this, token);
                break;
            }
            case InsertionMode.TEXT:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE: {
                this._insertCharacters(token);
                break;
            }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW: {
                characterInTable(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                characterInTableText(this, token);
                break;
            }
            case InsertionMode.IN_COLUMN_GROUP: {
                tokenInColumnGroup(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY: {
                tokenAfterBody(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_BODY: {
                tokenAfterAfterBody(this, token);
                break;
            }
            default:
        }
    }
    onNullCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            nullCharacterInForeignContent(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                tokenInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HTML: {
                tokenBeforeHtml(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD: {
                tokenBeforeHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD: {
                tokenInHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD_NO_SCRIPT: {
                tokenInHeadNoScript(this, token);
                break;
            }
            case InsertionMode.AFTER_HEAD: {
                tokenAfterHead(this, token);
                break;
            }
            case InsertionMode.TEXT: {
                this._insertCharacters(token);
                break;
            }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW: {
                characterInTable(this, token);
                break;
            }
            case InsertionMode.IN_COLUMN_GROUP: {
                tokenInColumnGroup(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY: {
                tokenAfterBody(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_BODY: {
                tokenAfterAfterBody(this, token);
                break;
            }
            default:
        }
    }
    onComment(token) {
        this.skipNextNewLine = false;
        if (this.currentNotInHTML) {
            appendComment(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
            case InsertionMode.BEFORE_HTML:
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET: {
                appendComment(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                tokenInTableText(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY: {
                appendCommentToRootHtmlElement(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET: {
                appendCommentToDocument(this, token);
                break;
            }
            default:
        }
    }
    onDoctype(token) {
        this.skipNextNewLine = false;
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                doctypeInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD: {
                this._err(token, ERR.misplacedDoctype);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                tokenInTableText(this, token);
                break;
            }
            default:
        }
    }
    onStartTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        this._processStartTag(token);
        if (token.selfClosing && !token.ackSelfClosing) {
            this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
        }
    }
    _processStartTag(token) {
        if (this.shouldProcessStartTagTokenInForeignContent(token)) {
            startTagInForeignContent(this, token);
        }
        else {
            this._startTagOutsideForeignContent(token);
        }
    }
    _startTagOutsideForeignContent(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                tokenInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HTML: {
                startTagBeforeHtml(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD: {
                startTagBeforeHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD: {
                startTagInHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD_NO_SCRIPT: {
                startTagInHeadNoScript(this, token);
                break;
            }
            case InsertionMode.AFTER_HEAD: {
                startTagAfterHead(this, token);
                break;
            }
            case InsertionMode.IN_BODY: {
                startTagInBody(this, token);
                break;
            }
            case InsertionMode.IN_TABLE: {
                startTagInTable(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                tokenInTableText(this, token);
                break;
            }
            case InsertionMode.IN_CAPTION: {
                startTagInCaption(this, token);
                break;
            }
            case InsertionMode.IN_COLUMN_GROUP: {
                startTagInColumnGroup(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_BODY: {
                startTagInTableBody(this, token);
                break;
            }
            case InsertionMode.IN_ROW: {
                startTagInRow(this, token);
                break;
            }
            case InsertionMode.IN_CELL: {
                startTagInCell(this, token);
                break;
            }
            case InsertionMode.IN_SELECT: {
                startTagInSelect(this, token);
                break;
            }
            case InsertionMode.IN_SELECT_IN_TABLE: {
                startTagInSelectInTable(this, token);
                break;
            }
            case InsertionMode.IN_TEMPLATE: {
                startTagInTemplate(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY: {
                startTagAfterBody(this, token);
                break;
            }
            case InsertionMode.IN_FRAMESET: {
                startTagInFrameset(this, token);
                break;
            }
            case InsertionMode.AFTER_FRAMESET: {
                startTagAfterFrameset(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_BODY: {
                startTagAfterAfterBody(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_FRAMESET: {
                startTagAfterAfterFrameset(this, token);
                break;
            }
            default:
        }
    }
    onEndTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        if (this.currentNotInHTML) {
            endTagInForeignContent(this, token);
        }
        else {
            this._endTagOutsideForeignContent(token);
        }
    }
    _endTagOutsideForeignContent(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                tokenInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HTML: {
                endTagBeforeHtml(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD: {
                endTagBeforeHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD: {
                endTagInHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD_NO_SCRIPT: {
                endTagInHeadNoScript(this, token);
                break;
            }
            case InsertionMode.AFTER_HEAD: {
                endTagAfterHead(this, token);
                break;
            }
            case InsertionMode.IN_BODY: {
                endTagInBody(this, token);
                break;
            }
            case InsertionMode.TEXT: {
                endTagInText(this, token);
                break;
            }
            case InsertionMode.IN_TABLE: {
                endTagInTable(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                tokenInTableText(this, token);
                break;
            }
            case InsertionMode.IN_CAPTION: {
                endTagInCaption(this, token);
                break;
            }
            case InsertionMode.IN_COLUMN_GROUP: {
                endTagInColumnGroup(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_BODY: {
                endTagInTableBody(this, token);
                break;
            }
            case InsertionMode.IN_ROW: {
                endTagInRow(this, token);
                break;
            }
            case InsertionMode.IN_CELL: {
                endTagInCell(this, token);
                break;
            }
            case InsertionMode.IN_SELECT: {
                endTagInSelect(this, token);
                break;
            }
            case InsertionMode.IN_SELECT_IN_TABLE: {
                endTagInSelectInTable(this, token);
                break;
            }
            case InsertionMode.IN_TEMPLATE: {
                endTagInTemplate(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY: {
                endTagAfterBody(this, token);
                break;
            }
            case InsertionMode.IN_FRAMESET: {
                endTagInFrameset(this, token);
                break;
            }
            case InsertionMode.AFTER_FRAMESET: {
                endTagAfterFrameset(this, token);
                break;
            }
            case InsertionMode.AFTER_AFTER_BODY: {
                tokenAfterAfterBody(this, token);
                break;
            }
            default:
        }
    }
    onEof(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL: {
                tokenInInitialMode(this, token);
                break;
            }
            case InsertionMode.BEFORE_HTML: {
                tokenBeforeHtml(this, token);
                break;
            }
            case InsertionMode.BEFORE_HEAD: {
                tokenBeforeHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD: {
                tokenInHead(this, token);
                break;
            }
            case InsertionMode.IN_HEAD_NO_SCRIPT: {
                tokenInHeadNoScript(this, token);
                break;
            }
            case InsertionMode.AFTER_HEAD: {
                tokenAfterHead(this, token);
                break;
            }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE: {
                eofInBody(this, token);
                break;
            }
            case InsertionMode.TEXT: {
                eofInText(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                tokenInTableText(this, token);
                break;
            }
            case InsertionMode.IN_TEMPLATE: {
                eofInTemplate(this, token);
                break;
            }
            case InsertionMode.AFTER_BODY:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET: {
                stopParsing(this, token);
                break;
            }
            default:
        }
    }
    onWhitespaceCharacter(token) {
        if (this.skipNextNewLine) {
            this.skipNextNewLine = false;
            if (token.chars.charCodeAt(0) === unicode.CODE_POINTS.LINE_FEED) {
                if (token.chars.length === 1) {
                    return;
                }
                token.chars = token.chars.substr(1);
            }
        }
        if (this.tokenizer.inForeignNode) {
            this._insertCharacters(token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.TEXT:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET: {
                this._insertCharacters(token);
                break;
            }
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.AFTER_BODY:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET: {
                whitespaceCharacterInBody(this, token);
                break;
            }
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW: {
                characterInTable(this, token);
                break;
            }
            case InsertionMode.IN_TABLE_TEXT: {
                whitespaceCharacterInTableText(this, token);
                break;
            }
            default:
        }
    }
}
function aaObtainFormattingElementEntry(p, token) {
    var formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
    if (formattingElementEntry) {
        if (!p.openElements.contains(formattingElementEntry.element)) {
            p.activeFormattingElements.removeEntry(formattingElementEntry);
            formattingElementEntry = null;
        }
        else if (!p.openElements.hasInScope(token.tagID)) {
            formattingElementEntry = null;
        }
    }
    else {
        genericEndTagInBody(p, token);
    }
    return formattingElementEntry;
}
function aaObtainFurthestBlock(p, formattingElementEntry) {
    var furthestBlock = null;
    var idx = p.openElements.stackTop;
    for (; idx >= 0; idx--) {
        var element = p.openElements.items[idx];
        if (element === formattingElementEntry.element) {
            break;
        }
        if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) {
            furthestBlock = element;
        }
    }
    if (!furthestBlock) {
        p.openElements.shortenToLength(Math.max(idx, 0));
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    }
    return furthestBlock;
}
function aaInnerLoop(p, furthestBlock, formattingElement) {
    var lastElement = furthestBlock;
    var nextElement = p.openElements.getCommonAncestor(furthestBlock);
    for (var i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
        nextElement = p.openElements.getCommonAncestor(element);
        var elementEntry = p.activeFormattingElements.getElementEntry(element);
        var counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
        var shouldRemoveFromOpenElements = !elementEntry || counterOverflow;
        if (shouldRemoveFromOpenElements) {
            if (counterOverflow) {
                p.activeFormattingElements.removeEntry(elementEntry);
            }
            p.openElements.remove(element);
        }
        else {
            element = aaRecreateElementFromEntry(p, elementEntry);
            if (lastElement === furthestBlock) {
                p.activeFormattingElements.bookmark = elementEntry;
            }
            p.treeAdapter.detachNode(lastElement);
            p.treeAdapter.appendChild(element, lastElement);
            lastElement = element;
        }
    }
    return lastElement;
}
function aaRecreateElementFromEntry(p, elementEntry) {
    var ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
    var newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
    p.openElements.replace(elementEntry.element, newElement);
    elementEntry.element = newElement;
    return newElement;
}
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
    var tn = p.treeAdapter.getTagName(commonAncestor);
    var tid = getTagID(tn);
    if (p._isElementCausesFosterParenting(tid)) {
        p._fosterParentElement(lastElement);
    }
    else {
        var ns = p.treeAdapter.getNamespaceURI(commonAncestor);
        if (tid === $.TEMPLATE && ns === NS.HTML) {
            commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
        }
        p.treeAdapter.appendChild(commonAncestor, lastElement);
    }
}
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
    var ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
    var { token } = formattingElementEntry;
    var newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
    p._adoptNodes(furthestBlock, newElement);
    p.treeAdapter.appendChild(furthestBlock, newElement);
    p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
    p.activeFormattingElements.removeEntry(formattingElementEntry);
    p.openElements.remove(formattingElementEntry.element);
    p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
function callAdoptionAgency(p, token) {
    for (var i = 0; i < AA_OUTER_LOOP_ITER; i++) {
        var formattingElementEntry = aaObtainFormattingElementEntry(p, token);
        if (!formattingElementEntry) {
            break;
        }
        var furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
        if (!furthestBlock) {
            break;
        }
        p.activeFormattingElements.bookmark = formattingElementEntry;
        var lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
        var commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
        p.treeAdapter.detachNode(lastElement);
        if (commonAncestor)
            aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
        aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
    }
}
function appendComment(p, token) {
    p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
    p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
    p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
    p.stopped = true;
    if (token.location) {
        var target = p.fragmentContext ? 0 : 2;
        for (var i = p.openElements.stackTop; i >= target; i--) {
            p._setEndLocation(p.openElements.items[i], token);
        }
        if (!p.fragmentContext && p.openElements.stackTop >= 0) {
            var htmlElement = p.openElements.items[0];
            var htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
            if (htmlLocation && !htmlLocation.endTag) {
                p._setEndLocation(htmlElement, token);
                if (p.openElements.stackTop >= 1) {
                    var bodyElement = p.openElements.items[1];
                    var bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
                    if (bodyLocation && !bodyLocation.endTag) {
                        p._setEndLocation(bodyElement, token);
                    }
                }
            }
        }
    }
}
function doctypeInInitialMode(p, token) {
    p._setDocumentType(token);
    var mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : doctype.getDocumentMode(token);
    if (!doctype.isConforming(token)) {
        p._err(token, ERR.nonConformingDoctype);
    }
    p.treeAdapter.setDocumentMode(p.document, mode);
    p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
    p._err(token, ERR.missingDoctype, true);
    p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
    p.insertionMode = InsertionMode.BEFORE_HTML;
    p._processToken(token);
}
function startTagBeforeHtml(p, token) {
    if (token.tagID === $.HTML) {
        p._insertElement(token, NS.HTML);
        p.insertionMode = InsertionMode.BEFORE_HEAD;
    }
    else {
        tokenBeforeHtml(p, token);
    }
}
function endTagBeforeHtml(p, token) {
    var tn = token.tagID;
    if (tn === $.HTML || tn === $.HEAD || tn === $.BODY || tn === $.BR) {
        tokenBeforeHtml(p, token);
    }
}
function tokenBeforeHtml(p, token) {
    p._insertFakeRootElement();
    p.insertionMode = InsertionMode.BEFORE_HEAD;
    p._processToken(token);
}
function startTagBeforeHead(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.HEAD: {
            p._insertElement(token, NS.HTML);
            p.headElement = p.openElements.current;
            p.insertionMode = InsertionMode.IN_HEAD;
            break;
        }
        default: {
            tokenBeforeHead(p, token);
        }
    }
}
function endTagBeforeHead(p, token) {
    var tn = token.tagID;
    if (tn === $.HEAD || tn === $.BODY || tn === $.HTML || tn === $.BR) {
        tokenBeforeHead(p, token);
    }
    else {
        p._err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function tokenBeforeHead(p, token) {
    p._insertFakeElement(TN.HEAD, $.HEAD);
    p.headElement = p.openElements.current;
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
function startTagInHead(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.BASE:
        case $.BASEFONT:
        case $.BGSOUND:
        case $.LINK:
        case $.META: {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.TITLE: {
            p._switchToTextParsing(token, TokenizerMode.RCDATA);
            break;
        }
        case $.NOSCRIPT: {
            if (p.options.scriptingEnabled) {
                p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
            }
            else {
                p._insertElement(token, NS.HTML);
                p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
            }
            break;
        }
        case $.NOFRAMES:
        case $.STYLE: {
            p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
            break;
        }
        case $.SCRIPT: {
            p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
            break;
        }
        case $.TEMPLATE: {
            p._insertTemplate(token);
            p.activeFormattingElements.insertMarker();
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_TEMPLATE;
            p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
            break;
        }
        case $.HEAD: {
            p._err(token, ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            tokenInHead(p, token);
        }
    }
}
function endTagInHead(p, token) {
    switch (token.tagID) {
        case $.HEAD: {
            p.openElements.pop();
            p.insertionMode = InsertionMode.AFTER_HEAD;
            break;
        }
        case $.BODY:
        case $.BR:
        case $.HTML: {
            tokenInHead(p, token);
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default: {
            p._err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function templateEndTagInHead(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.generateImpliedEndTagsThoroughly();
        if (p.openElements.currentTagId !== $.TEMPLATE) {
            p._err(token, ERR.closingOfElementWithOpenChildElements);
        }
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p._resetInsertionMode();
    }
    else {
        p._err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function tokenInHead(p, token) {
    p.openElements.pop();
    p.insertionMode = InsertionMode.AFTER_HEAD;
    p._processToken(token);
}
function startTagInHeadNoScript(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.BASEFONT:
        case $.BGSOUND:
        case $.HEAD:
        case $.LINK:
        case $.META:
        case $.NOFRAMES:
        case $.STYLE: {
            startTagInHead(p, token);
            break;
        }
        case $.NOSCRIPT: {
            p._err(token, ERR.nestedNoscriptInHead);
            break;
        }
        default: {
            tokenInHeadNoScript(p, token);
        }
    }
}
function endTagInHeadNoScript(p, token) {
    switch (token.tagID) {
        case $.NOSCRIPT: {
            p.openElements.pop();
            p.insertionMode = InsertionMode.IN_HEAD;
            break;
        }
        case $.BR: {
            tokenInHeadNoScript(p, token);
            break;
        }
        default: {
            p._err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function tokenInHeadNoScript(p, token) {
    var errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
    p._err(token, errCode);
    p.openElements.pop();
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
function startTagAfterHead(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.BODY: {
            p._insertElement(token, NS.HTML);
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_BODY;
            break;
        }
        case $.FRAMESET: {
            p._insertElement(token, NS.HTML);
            p.insertionMode = InsertionMode.IN_FRAMESET;
            break;
        }
        case $.BASE:
        case $.BASEFONT:
        case $.BGSOUND:
        case $.LINK:
        case $.META:
        case $.NOFRAMES:
        case $.SCRIPT:
        case $.STYLE:
        case $.TEMPLATE:
        case $.TITLE: {
            p._err(token, ERR.abandonedHeadElementChild);
            p.openElements.push(p.headElement, $.HEAD);
            startTagInHead(p, token);
            p.openElements.remove(p.headElement);
            break;
        }
        case $.HEAD: {
            p._err(token, ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            tokenAfterHead(p, token);
        }
    }
}
function endTagAfterHead(p, token) {
    switch (token.tagID) {
        case $.BODY:
        case $.HTML:
        case $.BR: {
            tokenAfterHead(p, token);
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default: {
            p._err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function tokenAfterHead(p, token) {
    p._insertFakeElement(TN.BODY, $.BODY);
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
function modeInBody(p, token) {
    switch (token.type) {
        case TokenType.CHARACTER: {
            characterInBody(p, token);
            break;
        }
        case TokenType.WHITESPACE_CHARACTER: {
            whitespaceCharacterInBody(p, token);
            break;
        }
        case TokenType.COMMENT: {
            appendComment(p, token);
            break;
        }
        case TokenType.START_TAG: {
            startTagInBody(p, token);
            break;
        }
        case TokenType.END_TAG: {
            endTagInBody(p, token);
            break;
        }
        case TokenType.EOF: {
            eofInBody(p, token);
            break;
        }
        default:
    }
}
function whitespaceCharacterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
}
function characterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
    p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
    if (p.openElements.tmplCount === 0) {
        p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
    }
}
function bodyStartTagInBody(p, token) {
    var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (bodyElement && p.openElements.tmplCount === 0) {
        p.framesetOk = false;
        p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
    }
}
function framesetStartTagInBody(p, token) {
    var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (p.framesetOk && bodyElement) {
        p.treeAdapter.detachNode(bodyElement);
        p.openElements.popAllUpToHtmlElement();
        p._insertElement(token, NS.HTML);
        p.insertionMode = InsertionMode.IN_FRAMESET;
    }
}
function addressStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    if (p.openElements.currentTagId !== undefined && NUMBERED_HEADERS.has(p.openElements.currentTagId)) {
        p.openElements.pop();
    }
    p._insertElement(token, NS.HTML);
}
function preStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    p.skipNextNewLine = true;
    p.framesetOk = false;
}
function formStartTagInBody(p, token) {
    var inTemplate = p.openElements.tmplCount > 0;
    if (!p.formElement || inTemplate) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
        p._insertElement(token, NS.HTML);
        if (!inTemplate) {
            p.formElement = p.openElements.current;
        }
    }
}
function listItemStartTagInBody(p, token) {
    p.framesetOk = false;
    var tn = token.tagID;
    for (var i = p.openElements.stackTop; i >= 0; i--) {
        var elementId = p.openElements.tagIDs[i];
        if ((tn === $.LI && elementId === $.LI) ||
            ((tn === $.DD || tn === $.DT) && (elementId === $.DD || elementId === $.DT))) {
            p.openElements.generateImpliedEndTagsWithExclusion(elementId);
            p.openElements.popUntilTagNamePopped(elementId);
            break;
        }
        if (elementId !== $.ADDRESS &&
            elementId !== $.DIV &&
            elementId !== $.P &&
            p._isSpecialElement(p.openElements.items[i], elementId)) {
            break;
        }
    }
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.BUTTON)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped($.BUTTON);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
}
function aStartTagInBody(p, token) {
    var activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TN.A);
    if (activeElementEntry) {
        callAdoptionAgency(p, token);
        p.openElements.remove(activeElementEntry.element);
        p.activeFormattingElements.removeEntry(activeElementEntry);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    if (p.openElements.hasInScope($.NOBR)) {
        callAdoptionAgency(p, token);
        p._reconstructActiveFormattingElements();
    }
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.activeFormattingElements.insertMarker();
    p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
    if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function isHiddenInput(token) {
    var inputType = getTokenAttr(token, ATTRS.TYPE);
    return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, NS.HTML);
    if (!isHiddenInput(token)) {
        p.framesetOk = false;
    }
    token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
    p._appendElement(token, NS.HTML);
    token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._appendElement(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
    token.tagName = TN.IMG;
    token.tagID = $.IMG;
    areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
    p._insertElement(token, NS.HTML);
    p.skipNextNewLine = true;
    p.tokenizer.state = TokenizerMode.RCDATA;
    p.originalInsertionMode = p.insertionMode;
    p.framesetOk = false;
    p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p._closePElement();
    }
    p._reconstructActiveFormattingElements();
    p.framesetOk = false;
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
    p.framesetOk = false;
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
    p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode =
        p.insertionMode === InsertionMode.IN_TABLE ||
            p.insertionMode === InsertionMode.IN_CAPTION ||
            p.insertionMode === InsertionMode.IN_TABLE_BODY ||
            p.insertionMode === InsertionMode.IN_ROW ||
            p.insertionMode === InsertionMode.IN_CELL
            ? InsertionMode.IN_SELECT_IN_TABLE
            : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
    if (p.openElements.currentTagId === $.OPTION) {
        p.openElements.pop();
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY)) {
        p.openElements.generateImpliedEndTags();
    }
    p._insertElement(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY)) {
        p.openElements.generateImpliedEndTagsWithExclusion($.RTC);
    }
    p._insertElement(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    foreignContent.adjustTokenMathMLAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, NS.MATHML);
    }
    else {
        p._insertElement(token, NS.MATHML);
    }
    token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    foreignContent.adjustTokenSVGAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, NS.SVG);
    }
    else {
        p._insertElement(token, NS.SVG);
    }
    token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, NS.HTML);
}
function startTagInBody(p, token) {
    switch (token.tagID) {
        case $.I:
        case $.S:
        case $.B:
        case $.U:
        case $.EM:
        case $.TT:
        case $.BIG:
        case $.CODE:
        case $.FONT:
        case $.SMALL:
        case $.STRIKE:
        case $.STRONG: {
            bStartTagInBody(p, token);
            break;
        }
        case $.A: {
            aStartTagInBody(p, token);
            break;
        }
        case $.H1:
        case $.H2:
        case $.H3:
        case $.H4:
        case $.H5:
        case $.H6: {
            numberedHeaderStartTagInBody(p, token);
            break;
        }
        case $.P:
        case $.DL:
        case $.OL:
        case $.UL:
        case $.DIV:
        case $.DIR:
        case $.NAV:
        case $.MAIN:
        case $.MENU:
        case $.ASIDE:
        case $.CENTER:
        case $.FIGURE:
        case $.FOOTER:
        case $.HEADER:
        case $.HGROUP:
        case $.DIALOG:
        case $.DETAILS:
        case $.ADDRESS:
        case $.ARTICLE:
        case $.SEARCH:
        case $.SECTION:
        case $.SUMMARY:
        case $.FIELDSET:
        case $.BLOCKQUOTE:
        case $.FIGCAPTION: {
            addressStartTagInBody(p, token);
            break;
        }
        case $.LI:
        case $.DD:
        case $.DT: {
            listItemStartTagInBody(p, token);
            break;
        }
        case $.BR:
        case $.IMG:
        case $.WBR:
        case $.AREA:
        case $.EMBED:
        case $.KEYGEN: {
            areaStartTagInBody(p, token);
            break;
        }
        case $.HR: {
            hrStartTagInBody(p, token);
            break;
        }
        case $.RB:
        case $.RTC: {
            rbStartTagInBody(p, token);
            break;
        }
        case $.RT:
        case $.RP: {
            rtStartTagInBody(p, token);
            break;
        }
        case $.PRE:
        case $.LISTING: {
            preStartTagInBody(p, token);
            break;
        }
        case $.XMP: {
            xmpStartTagInBody(p, token);
            break;
        }
        case $.SVG: {
            svgStartTagInBody(p, token);
            break;
        }
        case $.HTML: {
            htmlStartTagInBody(p, token);
            break;
        }
        case $.BASE:
        case $.LINK:
        case $.META:
        case $.STYLE:
        case $.TITLE:
        case $.SCRIPT:
        case $.BGSOUND:
        case $.BASEFONT:
        case $.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        case $.BODY: {
            bodyStartTagInBody(p, token);
            break;
        }
        case $.FORM: {
            formStartTagInBody(p, token);
            break;
        }
        case $.NOBR: {
            nobrStartTagInBody(p, token);
            break;
        }
        case $.MATH: {
            mathStartTagInBody(p, token);
            break;
        }
        case $.TABLE: {
            tableStartTagInBody(p, token);
            break;
        }
        case $.INPUT: {
            inputStartTagInBody(p, token);
            break;
        }
        case $.PARAM:
        case $.TRACK:
        case $.SOURCE: {
            paramStartTagInBody(p, token);
            break;
        }
        case $.IMAGE: {
            imageStartTagInBody(p, token);
            break;
        }
        case $.BUTTON: {
            buttonStartTagInBody(p, token);
            break;
        }
        case $.APPLET:
        case $.OBJECT:
        case $.MARQUEE: {
            appletStartTagInBody(p, token);
            break;
        }
        case $.IFRAME: {
            iframeStartTagInBody(p, token);
            break;
        }
        case $.SELECT: {
            selectStartTagInBody(p, token);
            break;
        }
        case $.OPTION:
        case $.OPTGROUP: {
            optgroupStartTagInBody(p, token);
            break;
        }
        case $.NOEMBED:
        case $.NOFRAMES: {
            rawTextStartTagInBody(p, token);
            break;
        }
        case $.FRAMESET: {
            framesetStartTagInBody(p, token);
            break;
        }
        case $.TEXTAREA: {
            textareaStartTagInBody(p, token);
            break;
        }
        case $.NOSCRIPT: {
            if (p.options.scriptingEnabled) {
                rawTextStartTagInBody(p, token);
            }
            else {
                genericStartTagInBody(p, token);
            }
            break;
        }
        case $.PLAINTEXT: {
            plaintextStartTagInBody(p, token);
            break;
        }
        case $.COL:
        case $.TH:
        case $.TD:
        case $.TR:
        case $.HEAD:
        case $.FRAME:
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD:
        case $.CAPTION:
        case $.COLGROUP: {
            break;
        }
        default: {
            genericStartTagInBody(p, token);
        }
    }
}
function bodyEndTagInBody(p, token) {
    if (p.openElements.hasInScope($.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        if (p.options.sourceCodeLocationInfo) {
            var bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
            if (bodyElement) {
                p._setEndLocation(bodyElement, token);
            }
        }
    }
}
function htmlEndTagInBody(p, token) {
    if (p.openElements.hasInScope($.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        endTagAfterBody(p, token);
    }
}
function addressEndTagInBody(p, token) {
    var tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function formEndTagInBody(p) {
    var inTemplate = p.openElements.tmplCount > 0;
    var { formElement } = p;
    if (!inTemplate) {
        p.formElement = null;
    }
    if ((formElement || inTemplate) && p.openElements.hasInScope($.FORM)) {
        p.openElements.generateImpliedEndTags();
        if (inTemplate) {
            p.openElements.popUntilTagNamePopped($.FORM);
        }
        else if (formElement) {
            p.openElements.remove(formElement);
        }
    }
}
function pEndTagInBody(p) {
    if (!p.openElements.hasInButtonScope($.P)) {
        p._insertFakeElement(TN.P, $.P);
    }
    p._closePElement();
}
function liEndTagInBody(p) {
    if (p.openElements.hasInListItemScope($.LI)) {
        p.openElements.generateImpliedEndTagsWithExclusion($.LI);
        p.openElements.popUntilTagNamePopped($.LI);
    }
}
function ddEndTagInBody(p, token) {
    var tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTagsWithExclusion(tn);
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function numberedHeaderEndTagInBody(p) {
    if (p.openElements.hasNumberedHeaderInScope()) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilNumberedHeaderPopped();
    }
}
function appletEndTagInBody(p, token) {
    var tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
        p.activeFormattingElements.clearToLastMarker();
    }
}
function brEndTagInBody(p) {
    p._reconstructActiveFormattingElements();
    p._insertFakeElement(TN.BR, $.BR);
    p.openElements.pop();
    p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
    var tn = token.tagName;
    var tid = token.tagID;
    for (var i = p.openElements.stackTop; i > 0; i--) {
        var element = p.openElements.items[i];
        var elementId = p.openElements.tagIDs[i];
        if (tid === elementId && (tid !== $.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
            p.openElements.generateImpliedEndTagsWithExclusion(tid);
            if (p.openElements.stackTop >= i)
                p.openElements.shortenToLength(i);
            break;
        }
        if (p._isSpecialElement(element, elementId)) {
            break;
        }
    }
}
function endTagInBody(p, token) {
    switch (token.tagID) {
        case $.A:
        case $.B:
        case $.I:
        case $.S:
        case $.U:
        case $.EM:
        case $.TT:
        case $.BIG:
        case $.CODE:
        case $.FONT:
        case $.NOBR:
        case $.SMALL:
        case $.STRIKE:
        case $.STRONG: {
            callAdoptionAgency(p, token);
            break;
        }
        case $.P: {
            pEndTagInBody(p);
            break;
        }
        case $.DL:
        case $.UL:
        case $.OL:
        case $.DIR:
        case $.DIV:
        case $.NAV:
        case $.PRE:
        case $.MAIN:
        case $.MENU:
        case $.ASIDE:
        case $.BUTTON:
        case $.CENTER:
        case $.FIGURE:
        case $.FOOTER:
        case $.HEADER:
        case $.HGROUP:
        case $.DIALOG:
        case $.ADDRESS:
        case $.ARTICLE:
        case $.DETAILS:
        case $.SEARCH:
        case $.SECTION:
        case $.SUMMARY:
        case $.LISTING:
        case $.FIELDSET:
        case $.BLOCKQUOTE:
        case $.FIGCAPTION: {
            addressEndTagInBody(p, token);
            break;
        }
        case $.LI: {
            liEndTagInBody(p);
            break;
        }
        case $.DD:
        case $.DT: {
            ddEndTagInBody(p, token);
            break;
        }
        case $.H1:
        case $.H2:
        case $.H3:
        case $.H4:
        case $.H5:
        case $.H6: {
            numberedHeaderEndTagInBody(p);
            break;
        }
        case $.BR: {
            brEndTagInBody(p);
            break;
        }
        case $.BODY: {
            bodyEndTagInBody(p, token);
            break;
        }
        case $.HTML: {
            htmlEndTagInBody(p, token);
            break;
        }
        case $.FORM: {
            formEndTagInBody(p);
            break;
        }
        case $.APPLET:
        case $.OBJECT:
        case $.MARQUEE: {
            appletEndTagInBody(p, token);
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default: {
            genericEndTagInBody(p, token);
        }
    }
}
function eofInBody(p, token) {
    if (p.tmplInsertionModeStack.length > 0) {
        eofInTemplate(p, token);
    }
    else {
        stopParsing(p, token);
    }
}
function endTagInText(p, token) {
    if (token.tagID === $.SCRIPT) {
        p.scriptHandler?.(p.openElements.current);
    }
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
    p._err(token, ERR.eofInElementThatCanContainOnlyText);
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
    p.onEof(token);
}
function characterInTable(p, token) {
    if (p.openElements.currentTagId !== undefined && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
        p.pendingCharacterTokens.length = 0;
        p.hasNonWhitespacePendingCharacterToken = false;
        p.originalInsertionMode = p.insertionMode;
        p.insertionMode = InsertionMode.IN_TABLE_TEXT;
        switch (token.type) {
            case TokenType.CHARACTER: {
                characterInTableText(p, token);
                break;
            }
            case TokenType.WHITESPACE_CHARACTER: {
                whitespaceCharacterInTableText(p, token);
                break;
            }
        }
    }
    else {
        tokenInTable(p, token);
    }
}
function captionStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.activeFormattingElements.insertMarker();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(TN.COLGROUP, $.COLGROUP);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
    startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(TN.TBODY, $.TBODY);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
    startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
    if (p.openElements.hasInTableScope($.TABLE)) {
        p.openElements.popUntilTagNamePopped($.TABLE);
        p._resetInsertionMode();
        p._processStartTag(token);
    }
}
function inputStartTagInTable(p, token) {
    if (isHiddenInput(token)) {
        p._appendElement(token, NS.HTML);
    }
    else {
        tokenInTable(p, token);
    }
    token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
    if (!p.formElement && p.openElements.tmplCount === 0) {
        p._insertElement(token, NS.HTML);
        p.formElement = p.openElements.current;
        p.openElements.pop();
    }
}
function startTagInTable(p, token) {
    switch (token.tagID) {
        case $.TD:
        case $.TH:
        case $.TR: {
            tdStartTagInTable(p, token);
            break;
        }
        case $.STYLE:
        case $.SCRIPT:
        case $.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        case $.COL: {
            colStartTagInTable(p, token);
            break;
        }
        case $.FORM: {
            formStartTagInTable(p, token);
            break;
        }
        case $.TABLE: {
            tableStartTagInTable(p, token);
            break;
        }
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD: {
            tbodyStartTagInTable(p, token);
            break;
        }
        case $.INPUT: {
            inputStartTagInTable(p, token);
            break;
        }
        case $.CAPTION: {
            captionStartTagInTable(p, token);
            break;
        }
        case $.COLGROUP: {
            colgroupStartTagInTable(p, token);
            break;
        }
        default: {
            tokenInTable(p, token);
        }
    }
}
function endTagInTable(p, token) {
    switch (token.tagID) {
        case $.TABLE: {
            if (p.openElements.hasInTableScope($.TABLE)) {
                p.openElements.popUntilTagNamePopped($.TABLE);
                p._resetInsertionMode();
            }
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        case $.BODY:
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.HTML:
        case $.TBODY:
        case $.TD:
        case $.TFOOT:
        case $.TH:
        case $.THEAD:
        case $.TR: {
            break;
        }
        default: {
            tokenInTable(p, token);
        }
    }
}
function tokenInTable(p, token) {
    var savedFosterParentingState = p.fosterParentingEnabled;
    p.fosterParentingEnabled = true;
    modeInBody(p, token);
    p.fosterParentingEnabled = savedFosterParentingState;
}
function whitespaceCharacterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
    p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
    var i = 0;
    if (p.hasNonWhitespacePendingCharacterToken) {
        for (; i < p.pendingCharacterTokens.length; i++) {
            tokenInTable(p, p.pendingCharacterTokens[i]);
        }
    }
    else {
        for (; i < p.pendingCharacterTokens.length; i++) {
            p._insertCharacters(p.pendingCharacterTokens[i]);
        }
    }
    p.insertionMode = p.originalInsertionMode;
    p._processToken(token);
}
var TABLE_VOID_ELEMENTS = new Set([$.CAPTION, $.COL, $.COLGROUP, $.TBODY, $.TD, $.TFOOT, $.TH, $.THEAD, $.TR]);
function startTagInCaption(p, token) {
    var tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope($.CAPTION)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped($.CAPTION);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = InsertionMode.IN_TABLE;
            startTagInTable(p, token);
        }
    }
    else {
        startTagInBody(p, token);
    }
}
function endTagInCaption(p, token) {
    var tn = token.tagID;
    switch (tn) {
        case $.CAPTION:
        case $.TABLE: {
            if (p.openElements.hasInTableScope($.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped($.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = InsertionMode.IN_TABLE;
                if (tn === $.TABLE) {
                    endTagInTable(p, token);
                }
            }
            break;
        }
        case $.BODY:
        case $.COL:
        case $.COLGROUP:
        case $.HTML:
        case $.TBODY:
        case $.TD:
        case $.TFOOT:
        case $.TH:
        case $.THEAD:
        case $.TR: {
            break;
        }
        default: {
            endTagInBody(p, token);
        }
    }
}
function startTagInColumnGroup(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.COL: {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        default: {
            tokenInColumnGroup(p, token);
        }
    }
}
function endTagInColumnGroup(p, token) {
    switch (token.tagID) {
        case $.COLGROUP: {
            if (p.openElements.currentTagId === $.COLGROUP) {
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
            }
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        case $.COL: {
            break;
        }
        default: {
            tokenInColumnGroup(p, token);
        }
    }
}
function tokenInColumnGroup(p, token) {
    if (p.openElements.currentTagId === $.COLGROUP) {
        p.openElements.pop();
        p.insertionMode = InsertionMode.IN_TABLE;
        p._processToken(token);
    }
}
function startTagInTableBody(p, token) {
    switch (token.tagID) {
        case $.TR: {
            p.openElements.clearBackToTableBodyContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = InsertionMode.IN_ROW;
            break;
        }
        case $.TH:
        case $.TD: {
            p.openElements.clearBackToTableBodyContext();
            p._insertFakeElement(TN.TR, $.TR);
            p.insertionMode = InsertionMode.IN_ROW;
            startTagInRow(p, token);
            break;
        }
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD: {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
                startTagInTable(p, token);
            }
            break;
        }
        default: {
            startTagInTable(p, token);
        }
    }
}
function endTagInTableBody(p, token) {
    var tn = token.tagID;
    switch (token.tagID) {
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD: {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
            }
            break;
        }
        case $.TABLE: {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
                endTagInTable(p, token);
            }
            break;
        }
        case $.BODY:
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.HTML:
        case $.TD:
        case $.TH:
        case $.TR: {
            break;
        }
        default: {
            endTagInTable(p, token);
        }
    }
}
function startTagInRow(p, token) {
    switch (token.tagID) {
        case $.TH:
        case $.TD: {
            p.openElements.clearBackToTableRowContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = InsertionMode.IN_CELL;
            p.activeFormattingElements.insertMarker();
            break;
        }
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD:
        case $.TR: {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                startTagInTableBody(p, token);
            }
            break;
        }
        default: {
            startTagInTable(p, token);
        }
    }
}
function endTagInRow(p, token) {
    switch (token.tagID) {
        case $.TR: {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
            }
            break;
        }
        case $.TABLE: {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                endTagInTableBody(p, token);
            }
            break;
        }
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD: {
            if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                endTagInTableBody(p, token);
            }
            break;
        }
        case $.BODY:
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.HTML:
        case $.TD:
        case $.TH: {
            break;
        }
        default: {
            endTagInTable(p, token);
        }
    }
}
function startTagInCell(p, token) {
    var tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope($.TD) || p.openElements.hasInTableScope($.TH)) {
            p._closeTableCell();
            startTagInRow(p, token);
        }
    }
    else {
        startTagInBody(p, token);
    }
}
function endTagInCell(p, token) {
    var tn = token.tagID;
    switch (tn) {
        case $.TD:
        case $.TH: {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped(tn);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = InsertionMode.IN_ROW;
            }
            break;
        }
        case $.TABLE:
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD:
        case $.TR: {
            if (p.openElements.hasInTableScope(tn)) {
                p._closeTableCell();
                endTagInRow(p, token);
            }
            break;
        }
        case $.BODY:
        case $.CAPTION:
        case $.COL:
        case $.COLGROUP:
        case $.HTML: {
            break;
        }
        default: {
            endTagInBody(p, token);
        }
    }
}
function startTagInSelect(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.OPTION: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            p._insertElement(token, NS.HTML);
            break;
        }
        case $.OPTGROUP: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === $.OPTGROUP) {
                p.openElements.pop();
            }
            p._insertElement(token, NS.HTML);
            break;
        }
        case $.HR: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === $.OPTGROUP) {
                p.openElements.pop();
            }
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.INPUT:
        case $.KEYGEN:
        case $.TEXTAREA:
        case $.SELECT: {
            if (p.openElements.hasInSelectScope($.SELECT)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
                if (token.tagID !== $.SELECT) {
                    p._processStartTag(token);
                }
            }
            break;
        }
        case $.SCRIPT:
        case $.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        default:
    }
}
function endTagInSelect(p, token) {
    switch (token.tagID) {
        case $.OPTGROUP: {
            if (p.openElements.stackTop > 0 &&
                p.openElements.currentTagId === $.OPTION &&
                p.openElements.tagIDs[p.openElements.stackTop - 1] === $.OPTGROUP) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === $.OPTGROUP) {
                p.openElements.pop();
            }
            break;
        }
        case $.OPTION: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            break;
        }
        case $.SELECT: {
            if (p.openElements.hasInSelectScope($.SELECT)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
            }
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default:
    }
}
function startTagInSelectInTable(p, token) {
    var tn = token.tagID;
    if (tn === $.CAPTION ||
        tn === $.TABLE ||
        tn === $.TBODY ||
        tn === $.TFOOT ||
        tn === $.THEAD ||
        tn === $.TR ||
        tn === $.TD ||
        tn === $.TH) {
        p.openElements.popUntilTagNamePopped($.SELECT);
        p._resetInsertionMode();
        p._processStartTag(token);
    }
    else {
        startTagInSelect(p, token);
    }
}
function endTagInSelectInTable(p, token) {
    var tn = token.tagID;
    if (tn === $.CAPTION ||
        tn === $.TABLE ||
        tn === $.TBODY ||
        tn === $.TFOOT ||
        tn === $.THEAD ||
        tn === $.TR ||
        tn === $.TD ||
        tn === $.TH) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
            p.onEndTag(token);
        }
    }
    else {
        endTagInSelect(p, token);
    }
}
function startTagInTemplate(p, token) {
    switch (token.tagID) {
        case $.BASE:
        case $.BASEFONT:
        case $.BGSOUND:
        case $.LINK:
        case $.META:
        case $.NOFRAMES:
        case $.SCRIPT:
        case $.STYLE:
        case $.TEMPLATE:
        case $.TITLE: {
            startTagInHead(p, token);
            break;
        }
        case $.CAPTION:
        case $.COLGROUP:
        case $.TBODY:
        case $.TFOOT:
        case $.THEAD: {
            p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
            p.insertionMode = InsertionMode.IN_TABLE;
            startTagInTable(p, token);
            break;
        }
        case $.COL: {
            p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
            p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
            startTagInColumnGroup(p, token);
            break;
        }
        case $.TR: {
            p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
            p.insertionMode = InsertionMode.IN_TABLE_BODY;
            startTagInTableBody(p, token);
            break;
        }
        case $.TD:
        case $.TH: {
            p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
            p.insertionMode = InsertionMode.IN_ROW;
            startTagInRow(p, token);
            break;
        }
        default: {
            p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
            p.insertionMode = InsertionMode.IN_BODY;
            startTagInBody(p, token);
        }
    }
}
function endTagInTemplate(p, token) {
    if (token.tagID === $.TEMPLATE) {
        templateEndTagInHead(p, token);
    }
}
function eofInTemplate(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p._resetInsertionMode();
        p.onEof(token);
    }
    else {
        stopParsing(p, token);
    }
}
function startTagAfterBody(p, token) {
    if (token.tagID === $.HTML) {
        startTagInBody(p, token);
    }
    else {
        tokenAfterBody(p, token);
    }
}
function endTagAfterBody(p, token) {
    if (token.tagID === $.HTML) {
        if (!p.fragmentContext) {
            p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
        }
        if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === $.HTML) {
            p._setEndLocation(p.openElements.items[0], token);
            var bodyElement = p.openElements.items[1];
            if (bodyElement && !p.treeAdapter.getNodeSourceCodeLocation(bodyElement)?.endTag) {
                p._setEndLocation(bodyElement, token);
            }
        }
    }
    else {
        tokenAfterBody(p, token);
    }
}
function tokenAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
function startTagInFrameset(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.FRAMESET: {
            p._insertElement(token, NS.HTML);
            break;
        }
        case $.FRAME: {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
    }
}
function endTagInFrameset(p, token) {
    if (token.tagID === $.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
        p.openElements.pop();
        if (!p.fragmentContext && p.openElements.currentTagId !== $.FRAMESET) {
            p.insertionMode = InsertionMode.AFTER_FRAMESET;
        }
    }
}
function startTagAfterFrameset(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
    }
}
function endTagAfterFrameset(p, token) {
    if (token.tagID === $.HTML) {
        p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
    }
}
function startTagAfterAfterBody(p, token) {
    if (token.tagID === $.HTML) {
        startTagInBody(p, token);
    }
    else {
        tokenAfterAfterBody(p, token);
    }
}
function tokenAfterAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
function startTagAfterAfterFrameset(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
    }
}
function nullCharacterInForeignContent(p, token) {
    token.chars = unicode.REPLACEMENT_CHARACTER;
    p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
    p._insertCharacters(token);
    p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
    while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML &&
        p.openElements.currentTagId !== undefined &&
        !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) {
        p.openElements.pop();
    }
}
function startTagInForeignContent(p, token) {
    if (foreignContent.causesExit(token)) {
        popUntilHtmlOrIntegrationPoint(p);
        p._startTagOutsideForeignContent(token);
    }
    else {
        var current = p._getAdjustedCurrentElement();
        var currentNs = p.treeAdapter.getNamespaceURI(current);
        if (currentNs === NS.MATHML) {
            foreignContent.adjustTokenMathMLAttrs(token);
        }
        else if (currentNs === NS.SVG) {
            foreignContent.adjustTokenSVGTagName(token);
            foreignContent.adjustTokenSVGAttrs(token);
        }
        foreignContent.adjustTokenXMLAttrs(token);
        if (token.selfClosing) {
            p._appendElement(token, currentNs);
        }
        else {
            p._insertElement(token, currentNs);
        }
        token.ackSelfClosing = true;
    }
}
function endTagInForeignContent(p, token) {
    if (token.tagID === $.P || token.tagID === $.BR) {
        popUntilHtmlOrIntegrationPoint(p);
        p._endTagOutsideForeignContent(token);
        return;
    }
    for (var i = p.openElements.stackTop; i > 0; i--) {
        var element = p.openElements.items[i];
        if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
            p._endTagOutsideForeignContent(token);
            break;
        }
        var tagName = p.treeAdapter.getTagName(element);
        if (tagName.toLowerCase() === token.tagName) {
            token.tagName = tagName;
            p.openElements.shortenToLength(i);
            break;
        }
    }
}
