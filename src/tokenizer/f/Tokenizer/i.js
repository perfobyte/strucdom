import * as f from './f/i.js';

function Tokenizer(options, handler) {
    this.options = options;
    this.handler = handler;
    this.paused = false;
    this.inLoop = false;
    this.inForeignNode = false;
    this.lastStartTagName = '';
    this.active = false;
    this.state = State.DATA;
    this.returnState = State.DATA;
    this.entityStartPos = 0;
    this.consumedAfterSnapshot = -1;
    this.currentCharacterToken = null;
    this.currentToken = null;
    this.currentAttr = { name: '', value: '' };
    this.preprocessor = new Preprocessor(handler);
    this.currentLocation = this.getCurrentLocation(-1);
    this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) => {
        this.preprocessor.pos = this.entityStartPos + consumed - 1;
        this._flushCodePointConsumedAsCharacterReference(cp);
    }, handler.onParseError
        ? {
            missingSemicolonAfterCharacterReference: () => {
                this._err(ERR.missingSemicolonAfterCharacterReference, 1);
            },
            absenceOfDigitsInNumericCharacterReference: (consumed) => {
                this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
            },
            validateNumericCharacterReference: (code) => {
                var error = getErrorForNumericCharacterReference(code);
                if (error)
                    this._err(error, 1);
            },
        }
        : undefined);
}

Tokenizer.prototype = f;
export default Tokenizer;
