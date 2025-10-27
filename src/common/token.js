export var
    TokenType = {
        CHARACTER: 0,
        NULL_CHARACTER: 1,
        WHITESPACE_CHARACTER: 2,
        START_TAG: 3,
        END_TAG: 4,
        COMMENT: 5,
        DOCTYPE: 6,
        EOF: 7,
        HIBERNATION: 8,
        
        0: "CHARACTER",
        1: "NULL_CHARACTER",
        2: "WHITESPACE_CHARACTER",
        3: "START_TAG",
        4: "END_TAG",
        5: "COMMENT",
        6: "DOCTYPE",
        7: "EOF",
        8: "HIBERNATION",
    },
    
    getTokenAttr = (token, attrName) => {
        for (var i = token.attrs.length - 1; i >= 0; i--) {
            if (token.attrs[i].name === attrName) {
                return token.attrs[i].value;
            }
        }
        return null;
    }
;