import { Tokenizer, TokenizerMode } from '../tokenizer/index.ts';
import { OpenElementStack } from './open-element-stack.ts';
import { FormattingElementList, EntryType } from './formatting-element-list.ts';
import { defaultTreeAdapter } from '../tree_adapters/#deprecated.js';
import * as doctype from '../common/doctype.ts';
import * as foreignContent from '../common/foreign_content/i.js';
import { ERR } from '../common/ERR.js';
import * as unicode from '../common/unicode.ts';
import { TAG_ID as $, TAG_NAMES as TN, NS, ATTRS, SPECIAL_ELEMENTS, DOCUMENT_MODE, NUMBERED_HEADERS, getTagID, } from '../common/html/i.js';
import { TokenType, getTokenAttr, } from '../common/token.ts';





function doctypeInInitialMode(p, token) {
    p.set_document_type(token);
    var mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : doctype.getDocumentMode(token);
    if (!doctype.isConforming(token)) {
        p.err(token, ERR.nonConformingDoctype);
    }
    p.treeAdapter.setDocumentMode(p.document, mode);
    p.insertionMode = InsertionMode.BEFORE_HTML;
}
function token_in_initial_mode(p, token) {
    p.err(token, ERR.missingDoctype, true);
    p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
    p.insertionMode = InsertionMode.BEFORE_HTML;
    p.process_token(token);
}
function startTagBeforeHtml(p, token) {
    if (token.tagID === $.HTML) {
        p.insert_element(token, NS.HTML);
        p.insertionMode = InsertionMode.BEFORE_HEAD;
    }
    else {
        token_before_html(p, token);
    }
}
function endTagBeforeHtml(p, token) {
    var tn = token.tagID;
    if (tn === $.HTML || tn === $.HEAD || tn === $.BODY || tn === $.BR) {
        token_before_html(p, token);
    }
}
function token_before_html(p, token) {
    p.insert_fake_root_element();
    p.insertionMode = InsertionMode.BEFORE_HEAD;
    p.process_token(token);
}
function startTagBeforeHead(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.HEAD: {
            p.insert_element(token, NS.HTML);
            p.headElement = p.openElements.current;
            p.insertionMode = InsertionMode.IN_HEAD;
            break;
        }
        default: {
            token_before_head(p, token);
        }
    }
}
function endTagBeforeHead(p, token) {
    var tn = token.tagID;
    if (tn === $.HEAD || tn === $.BODY || tn === $.HTML || tn === $.BR) {
        token_before_head(p, token);
    }
    else {
        p.err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function token_before_head(p, token) {
    p.insert_fake_element(TN.HEAD, $.HEAD);
    p.headElement = p.openElements.current;
    p.insertionMode = InsertionMode.IN_HEAD;
    p.process_token(token);
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
            p.append_element(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.TITLE: {
            p.switch_to_text_parsing(token, TokenizerMode.RCDATA);
            break;
        }
        case $.NOSCRIPT: {
            if (p.options.scriptingEnabled) {
                p.switch_to_text_parsing(token, TokenizerMode.RAWTEXT);
            }
            else {
                p.insert_element(token, NS.HTML);
                p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
            }
            break;
        }
        case $.NOFRAMES:
        case $.STYLE: {
            p.switch_to_text_parsing(token, TokenizerMode.RAWTEXT);
            break;
        }
        case $.SCRIPT: {
            p.switch_to_text_parsing(token, TokenizerMode.SCRIPT_DATA);
            break;
        }
        case $.TEMPLATE: {
            p.insert_template(token);
            p.activeFormattingElements.insertMarker();
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_TEMPLATE;
            p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
            break;
        }
        case $.HEAD: {
            p.err(token, ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            token_in_head(p, token);
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
            token_in_head(p, token);
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default: {
            p.err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function templateEndTagInHead(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.generateImpliedEndTagsThoroughly();
        if (p.openElements.currentTagId !== $.TEMPLATE) {
            p.err(token, ERR.closingOfElementWithOpenChildElements);
        }
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p.reset_insertion_mode();
    }
    else {
        p.err(token, ERR.endTagWithoutMatchingOpenElement);
    }
}
function token_in_head(p, token) {
    p.openElements.pop();
    p.insertionMode = InsertionMode.AFTER_HEAD;
    p.process_token(token);
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
            p.err(token, ERR.nestedNoscriptInHead);
            break;
        }
        default: {
            token_in_head_no_script(p, token);
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
            token_in_head_no_script(p, token);
            break;
        }
        default: {
            p.err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function token_in_head_no_script(p, token) {
    var errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
    p.err(token, errCode);
    p.openElements.pop();
    p.insertionMode = InsertionMode.IN_HEAD;
    p.process_token(token);
}
function startTagAfterHead(p, token) {
    switch (token.tagID) {
        case $.HTML: {
            startTagInBody(p, token);
            break;
        }
        case $.BODY: {
            p.insert_element(token, NS.HTML);
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_BODY;
            break;
        }
        case $.FRAMESET: {
            p.insert_element(token, NS.HTML);
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
            p.err(token, ERR.abandonedHeadElementChild);
            p.openElements.push(p.headElement, $.HEAD);
            startTagInHead(p, token);
            p.openElements.remove(p.headElement);
            break;
        }
        case $.HEAD: {
            p.err(token, ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            token_after_head(p, token);
        }
    }
}
function endTagAfterHead(p, token) {
    switch (token.tagID) {
        case $.BODY:
        case $.HTML:
        case $.BR: {
            token_after_head(p, token);
            break;
        }
        case $.TEMPLATE: {
            templateEndTagInHead(p, token);
            break;
        }
        default: {
            p.err(token, ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function token_after_head(p, token) {
    p.insert_fake_element(TN.BODY, $.BODY);
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
            whitespace_character_in_body(p, token);
            break;
        }
        case TokenType.COMMENT: {
            append_comment(p, token);
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
            eof_in_body(p, token);
            break;
        }
        default:
    }
}
function whitespace_character_in_body(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_characters(token);
}
function characterInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_characters(token);
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
        p.insert_element(token, NS.HTML);
        p.insertionMode = InsertionMode.IN_FRAMESET;
    }
}
function addressStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.insert_element(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    if (p.openElements.currentTagId !== undefined && NUMBERED_HEADERS.has(p.openElements.currentTagId)) {
        p.openElements.pop();
    }
    p.insert_element(token, NS.HTML);
}
function preStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.insert_element(token, NS.HTML);
    p.skipNextNewLine = true;
    p.framesetOk = false;
}
function formStartTagInBody(p, token) {
    var inTemplate = p.openElements.tmplCount > 0;
    if (!p.formElement || inTemplate) {
        if (p.openElements.hasInButtonScope($.P)) {
            p.close_p_element();
        }
        p.insert_element(token, NS.HTML);
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
            p.is_special_element(p.openElements.items[i], elementId)) {
            break;
        }
    }
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.insert_element(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.insert_element(token, NS.HTML);
    p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.BUTTON)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped($.BUTTON);
    }
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
    p.framesetOk = false;
}
function aStartTagInBody(p, token) {
    var activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TN.A);
    if (activeElementEntry) {
        call_adoption_agency(p, token);
        p.openElements.remove(activeElementEntry.element);
        p.activeFormattingElements.removeEntry(activeElementEntry);
    }
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    if (p.openElements.hasInScope($.NOBR)) {
        call_adoption_agency(p, token);
        p.reconstruct_active_formatting_elements();
    }
    p.insert_element(token, NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
    p.activeFormattingElements.insertMarker();
    p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
    if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.insert_element(token, NS.HTML);
    p.framesetOk = false;
    p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.append_element(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function isHiddenInput(token) {
    var inputType = getTokenAttr(token, ATTRS.TYPE);
    return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.append_element(token, NS.HTML);
    if (!isHiddenInput(token)) {
        p.framesetOk = false;
    }
    token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
    p.append_element(token, NS.HTML);
    token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.append_element(token, NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
    token.tagName = TN.IMG;
    token.tagID = $.IMG;
    areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
    p.insert_element(token, NS.HTML);
    p.skipNextNewLine = true;
    p.tokenizer.state = TokenizerMode.RCDATA;
    p.originalInsertionMode = p.insertionMode;
    p.framesetOk = false;
    p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope($.P)) {
        p.close_p_element();
    }
    p.reconstruct_active_formatting_elements();
    p.framesetOk = false;
    p.switch_to_text_parsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
    p.framesetOk = false;
    p.switch_to_text_parsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
    p.switch_to_text_parsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
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
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY)) {
        p.openElements.generateImpliedEndTags();
    }
    p.insert_element(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
    if (p.openElements.hasInScope($.RUBY)) {
        p.openElements.generateImpliedEndTagsWithExclusion($.RTC);
    }
    p.insert_element(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    foreignContent.adjustTokenMathMLAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p.append_element(token, NS.MATHML);
    }
    else {
        p.insert_element(token, NS.MATHML);
    }
    token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    foreignContent.adjustTokenSVGAttrs(token);
    foreignContent.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p.append_element(token, NS.SVG);
    }
    else {
        p.insert_element(token, NS.SVG);
    }
    token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
    p.reconstruct_active_formatting_elements();
    p.insert_element(token, NS.HTML);
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
                p.set_end_location(bodyElement, token);
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
        p.insert_fake_element(TN.P, $.P);
    }
    p.close_p_element();
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
    p.reconstruct_active_formatting_elements();
    p.insert_fake_element(TN.BR, $.BR);
    p.openElements.pop();
    p.framesetOk = false;
}
function generic_end_tag_in_body(p, token) {
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
        if (p.is_special_element(element, elementId)) {
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
            call_adoption_agency(p, token);
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
            generic_end_tag_in_body(p, token);
        }
    }
}
function eof_in_body(p, token) {
    if (p.tmplInsertionModeStack.length > 0) {
        eof_in_template(p, token);
    }
    else {
        stop_parsing(p, token);
    }
}
function endTagInText(p, token) {
    if (token.tagID === $.SCRIPT) {
        p.scriptHandler?.(p.openElements.current);
    }
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
}
function eof_in_text(p, token) {
    p.err(token, ERR.eofInElementThatCanContainOnlyText);
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
    p.on_eof(token);
}
function character_in_table(p, token) {
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
                whitespace_character_in_table_text(p, token);
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
    p.insert_element(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.insert_element(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.insert_fake_element(TN.COLGROUP, $.COLGROUP);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
    startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.insert_element(token, NS.HTML);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.insert_fake_element(TN.TBODY, $.TBODY);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
    startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
    if (p.openElements.hasInTableScope($.TABLE)) {
        p.openElements.popUntilTagNamePopped($.TABLE);
        p.reset_insertion_mode();
        p.process_start_tag(token);
    }
}
function inputStartTagInTable(p, token) {
    if (isHiddenInput(token)) {
        p.append_element(token, NS.HTML);
    }
    else {
        tokenInTable(p, token);
    }
    token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
    if (!p.formElement && p.openElements.tmplCount === 0) {
        p.insert_element(token, NS.HTML);
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
                p.reset_insertion_mode();
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
function whitespace_character_in_table_text(p, token) {
    p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
    p.hasNonWhitespacePendingCharacterToken = true;
}
function token_in_table_text(p, token) {
    var i = 0;
    if (p.hasNonWhitespacePendingCharacterToken) {
        for (; i < p.pendingCharacterTokens.length; i++) {
            tokenInTable(p, p.pendingCharacterTokens[i]);
        }
    }
    else {
        for (; i < p.pendingCharacterTokens.length; i++) {
            p.insert_characters(p.pendingCharacterTokens[i]);
        }
    }
    p.insertionMode = p.originalInsertionMode;
    p.process_token(token);
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
            p.append_element(token, NS.HTML);
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
        p.process_token(token);
    }
}
function startTagInTableBody(p, token) {
    switch (token.tagID) {
        case $.TR: {
            p.openElements.clearBackToTableBodyContext();
            p.insert_element(token, NS.HTML);
            p.insertionMode = InsertionMode.IN_ROW;
            break;
        }
        case $.TH:
        case $.TD: {
            p.openElements.clearBackToTableBodyContext();
            p.insert_fake_element(TN.TR, $.TR);
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
            p.insert_element(token, NS.HTML);
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
            p.close_table_cell();
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
                p.close_table_cell();
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
            p.insert_element(token, NS.HTML);
            break;
        }
        case $.OPTGROUP: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === $.OPTGROUP) {
                p.openElements.pop();
            }
            p.insert_element(token, NS.HTML);
            break;
        }
        case $.HR: {
            if (p.openElements.currentTagId === $.OPTION) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === $.OPTGROUP) {
                p.openElements.pop();
            }
            p.append_element(token, NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case $.INPUT:
        case $.KEYGEN:
        case $.TEXTAREA:
        case $.SELECT: {
            if (p.openElements.hasInSelectScope($.SELECT)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p.reset_insertion_mode();
                if (token.tagID !== $.SELECT) {
                    p.process_start_tag(token);
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
                p.reset_insertion_mode();
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
        p.reset_insertion_mode();
        p.process_start_tag(token);
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
            p.reset_insertion_mode();
            p.on_end_tag(token);
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
function eof_in_template(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.popUntilTagNamePopped($.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p.reset_insertion_mode();
        p.on_eof(token);
    }
    else {
        stop_parsing(p, token);
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
            p.set_end_location(p.openElements.items[0], token);
            var bodyElement = p.openElements.items[1];
            if (bodyElement && !p.treeAdapter.getNodeSourceCodeLocation(bodyElement)?.endTag) {
                p.set_end_location(bodyElement, token);
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
            p.insert_element(token, NS.HTML);
            break;
        }
        case $.FRAME: {
            p.append_element(token, NS.HTML);
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
    p.insert_characters(token);
}
function characterInForeignContent(p, token) {
    p.insert_characters(token);
    p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
    while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML &&
        p.openElements.currentTagId !== undefined &&
        !p.is_integration_point(p.openElements.currentTagId, p.openElements.current)) {
        p.openElements.pop();
    }
}
function startTagInForeignContent(p, token) {
    if (foreignContent.causesExit(token)) {
        popUntilHtmlOrIntegrationPoint(p);
        p.start_tag_outside_foreign_content(token);
    }
    else {
        var current = p.get_adjusted_current_element();
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
            p.append_element(token, currentNs);
        }
        else {
            p.insert_element(token, currentNs);
        }
        token.ackSelfClosing = true;
    }
}
function endTagInForeignContent(p, token) {
    if (token.tagID === $.P || token.tagID === $.BR) {
        popUntilHtmlOrIntegrationPoint(p);
        p.end_tag_outside_foreign_content(token);
        return;
    }
    for (var i = p.openElements.stackTop; i > 0; i--) {
        var element = p.openElements.items[i];
        if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
            p.end_tag_outside_foreign_content(token);
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
