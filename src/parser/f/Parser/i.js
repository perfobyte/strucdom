import * as f from './f/i.js';

function Parser(
    options,
    document,
    fragmentContext,
    scriptHandler,
) {
    var
        InsertionMode = this.InsertionMode,
        INITIAL = InsertionMode.INITIAL
    ;
    this.fragmentContext = (fragmentContext ||= null);
    this.scriptHandler = (scriptHandler ||= null);

    this.insertionMode =
    this.originalInsertionMode = INITIAL;

    this.currentToken =
    this.headElement =
    this.formElement = null;
    
    this.tmplInsertionModeStack = [];
    this.pendingCharacterTokens = [];

    this.framesetOk = true;

    this.stopped =
    this.currentNotInHTML =
    this.hasNonWhitespacePendingCharacterToken =
    this.skipNextNewLine =
    this.fosterParentingEnabled =
        false
    ;

    (
        this.onParseError =
            (
                this.options = options
            )
            .onParseError
    )
    && (
        options.sourceCodeLocationInfo = true
    );

    this.document = (document ??= this.create_document());
    this.tokenizer = new (this.Tokenizer)(options, this);

    this.activeFormattingElements = new (this.FormattingElementList)();
    
    this.set_context_modes(
        (fragmentContext ?? document),
        (
            this.fragmentContextID = (
                fragmentContext
                ? this.get_tag_id(fragmentContext.tagName)
                : this.TAG_ID.UNKNOWN
            )
        )
    );
    this.openElements = new (this.OpenElementStack)(document, this);

    this.on_parse_error = console.error;
    
    this.on_pop =
    this.on_push = null;
};

Parser.prototype = f;

export default Parser;
