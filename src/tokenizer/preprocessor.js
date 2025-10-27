import { CODE_POINTS as $, getSurrogatePairCodePoint, isControlCodePoint, isSurrogate, isSurrogatePair, isUndefinedCodePoint, } from '../common/unicode.ts';
import { ERR } from '../common/ERR.js';
var DEFAULT_BUFFER_WATERLINE = 1 << 16;
export class Preprocessor {
    constructor(handler) {
        this.handler = handler;
        this.html = '';
        this.pos = -1;
        this.lastGapPos = -2;
        this.gapStack = [];
        this.skipNextNewLine = false;
        this.lastChunkWritten = false;
        this.endOfChunkHit = false;
        this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
        this.isEol = false;
        this.lineStartPos = 0;
        this.droppedBufferSize = 0;
        this.line = 1;
        this.lastErrOffset = -1;
    }
    get col() {
        return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
    }
    get offset() {
        return this.droppedBufferSize + this.pos;
    }
    getError(code, cpOffset) {
        var { line, col, offset } = this;
        var startCol = col + cpOffset;
        var startOffset = offset + cpOffset;
        return {
            code,
            startLine: line,
            endLine: line,
            startCol,
            endCol: startCol,
            startOffset,
            endOffset: startOffset,
        };
    }
    _err(code) {
        if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
            this.lastErrOffset = this.offset;
            this.handler.onParseError(this.getError(code, 0));
        }
    }
    _addGap() {
        this.gapStack.push(this.lastGapPos);
        this.lastGapPos = this.pos;
    }
    _processSurrogate(cp) {
        if (this.pos !== this.html.length - 1) {
            var nextCp = this.html.charCodeAt(this.pos + 1);
            if (isSurrogatePair(nextCp)) {
                this.pos++;
                this._addGap();
                return getSurrogatePairCodePoint(cp, nextCp);
            }
        }
        else if (!this.lastChunkWritten) {
            this.endOfChunkHit = true;
            return $.EOF;
        }
        this._err(ERR.surrogateInInputStream);
        return cp;
    }
    willDropParsedChunk() {
        return this.pos > this.bufferWaterline;
    }
    dropParsedChunk() {
        if (this.willDropParsedChunk()) {
            this.html = this.html.substring(this.pos);
            this.lineStartPos -= this.pos;
            this.droppedBufferSize += this.pos;
            this.pos = 0;
            this.lastGapPos = -2;
            this.gapStack.length = 0;
        }
    }
    write(chunk, isLastChunk) {
        if (this.html.length > 0) {
            this.html += chunk;
        }
        else {
            this.html = chunk;
        }
        this.endOfChunkHit = false;
        this.lastChunkWritten = isLastChunk;
    }
    insertHtmlAtCurrentPos(chunk) {
        this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
        this.endOfChunkHit = false;
    }
    startsWith(pattern, caseSensitive) {
        if (this.pos + pattern.length > this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return false;
        }
        if (caseSensitive) {
            return this.html.startsWith(pattern, this.pos);
        }
        for (var i = 0; i < pattern.length; i++) {
            var cp = this.html.charCodeAt(this.pos + i) | 0x20;
            if (cp !== pattern.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    }
    peek(offset) {
        var pos = this.pos + offset;
        if (pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return $.EOF;
        }
        var code = this.html.charCodeAt(pos);
        return code === $.CARRIAGE_RETURN ? $.LINE_FEED : code;
    }
    advance() {
        this.pos++;
        if (this.isEol) {
            this.isEol = false;
            this.line++;
            this.lineStartPos = this.pos;
        }
        if (this.pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return $.EOF;
        }
        var cp = this.html.charCodeAt(this.pos);
        if (cp === $.CARRIAGE_RETURN) {
            this.isEol = true;
            this.skipNextNewLine = true;
            return $.LINE_FEED;
        }
        if (cp === $.LINE_FEED) {
            this.isEol = true;
            if (this.skipNextNewLine) {
                this.line--;
                this.skipNextNewLine = false;
                this._addGap();
                return this.advance();
            }
        }
        this.skipNextNewLine = false;
        if (isSurrogate(cp)) {
            cp = this._processSurrogate(cp);
        }
        var isCommonValidRange = this.handler.onParseError === null ||
            (cp > 0x1f && cp < 0x7f) ||
            cp === $.LINE_FEED ||
            cp === $.CARRIAGE_RETURN ||
            (cp > 0x9f && cp < 64976);
        if (!isCommonValidRange) {
            this._checkForProblematicCharacters(cp);
        }
        return cp;
    }
    _checkForProblematicCharacters(cp) {
        if (isControlCodePoint(cp)) {
            this._err(ERR.controlCharacterInInputStream);
        }
        else if (isUndefinedCodePoint(cp)) {
            this._err(ERR.noncharacterInInputStream);
        }
    }
    retreat(count) {
        this.pos -= count;
        while (this.pos < this.lastGapPos) {
            this.lastGapPos = this.gapStack.pop();
            this.pos--;
        }
        this.isEol = false;
    }
}
