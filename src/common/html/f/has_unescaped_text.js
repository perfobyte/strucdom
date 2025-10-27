import {UNESCAPED_TEXT, TAG_NAMES} from "../conf/i.js";

export default (
    (UNESCAPED_TEXT, NOSCRIPT) => {
        
        return (tn, scriptingEnabled) => {
            return (
                UNESCAPED_TEXT.has(tn)
                ||
                (scriptingEnabled && (tn === NOSCRIPT))
            );
        }
    }
)(UNESCAPED_TEXT, TAG_NAMES.NOSCRIPT);