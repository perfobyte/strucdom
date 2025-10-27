export var
    REPLACEMENT_CHARACTER = '\uFFFD',

    CODE_POINTS = {
        EOF: -1,
        -1: "EOF",
        NULL: 0,
        0: "NULL",
        TABULATION: 9,
        9: "TABULATION",
        CARRIAGE_RETURN: 13,
        13: "CARRIAGE_RETURN",
        LINE_FEED: 10,
        10: "LINE_FEED",
        FORM_FEED: 12,
        12: "FORM_FEED",
        SPACE: 32,
        32: "SPACE",
        EXCLAMATION_MARK: 33,
        33: "EXCLAMATION_MARK",
        QUOTATION_MARK: 34,
        34: "QUOTATION_MARK",
        AMPERSAND: 38,
        38: "AMPERSAND",
        APOSTROPHE: 39,
        39: "APOSTROPHE",
        HYPHEN_MINUS: 45,
        45: "HYPHEN_MINUS",
        SOLIDUS: 47,
        47: "SOLIDUS",
        DIGIT_0: 48,
        48: "DIGIT_0",
        DIGIT_9: 57,
        57: "DIGIT_9",
        SEMICOLON: 59,
        59: "SEMICOLON",
        LESS_THAN_SIGN: 60,
        60: "LESS_THAN_SIGN",
        EQUALS_SIGN: 61,
        61: "EQUALS_SIGN",
        GREATER_THAN_SIGN: 62,
        62: "GREATER_THAN_SIGN",
        QUESTION_MARK: 63,
        63: "QUESTION_MARK",
        LATIN_CAPITAL_A: 65,
        65: "LATIN_CAPITAL_A",
        LATIN_CAPITAL_Z: 90,
        90: "LATIN_CAPITAL_Z",
        RIGHT_SQUARE_BRACKET: 93,
        93: "RIGHT_SQUARE_BRACKET",
        GRAVE_ACCENT: 96,
        96: "GRAVE_ACCENT",
        LATIN_SMALL_A: 97,
        97: "LATIN_SMALL_A",
        LATIN_SMALL_Z: 122,
        122: "LATIN_SMALL_Z"
    },

    UNDEFINED_CODE_POINTS = new Set([
        65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214,
        393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894,
        720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574,
        1048575, 1114110, 1114111,
    ]),

    SEQUENCES = {
        DASH_DASH: '--',
        CDATA_START: 'CDATA',
        DOCTYPE: 'doctype',
        SCRIPT: 'script',
        PUBLIC: 'public',
        SYSTEM: 'system',
    },

    isSurrogate = (cp) => {
        return cp >= 55296 && cp <= 57343;
    },

    isSurrogatePair = (cp) => {
        return cp >= 56320 && cp <= 57343;
    },

    getSurrogatePairCodePoint = (cp1, cp2) => {
        return (cp1 - 55296) * 1024 + 9216 + cp2;
    },

    isControlCodePoint = (cp) => {
        return ((cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f) ||
            (cp >= 0x7f && cp <= 0x9f));
    },

    isUndefinedCodePoint = (cp) => {
        return (cp >= 64976 && cp <= 65007) || UNDEFINED_CODE_POINTS.has(cp);
    }
;
