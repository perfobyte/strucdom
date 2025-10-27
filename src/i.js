export * from './common/i.js';

import { Parser } from './parser/index.js';
export { defaultTreeAdapter } from './tree-adapters/default.js';
export { Parser } from './parser/index.js';
export { serialize, serializeOuter } from './serializer/index.js';
export { ERR as ErrorCodes } from './common/ERR.js';
export * as foreignContent from './common/foreign_content/i.js';
export * as html from './common/html/i.js';
export * as Token from './common/token.js';
export { Tokenizer, TokenizerMode } from './tokenizer/index.js';



export function parse(html, options) {
    return Parser.parse(html, options);
}

export function parseFragment(fragmentContext, html, options) {
    if (typeof fragmentContext === 'string') {
        options = html;
        html = fragmentContext;
        fragmentContext = null;
    }
    var parser = Parser.getFragmentParser(fragmentContext, options);
    parser.tokenizer.write(html, true);
    return parser.getFragment();
}
