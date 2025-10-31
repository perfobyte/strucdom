import {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,
} from '../conf/i.js';

// 0 success;
// 1 tag is not opened;

export default (
    (v,document, i,l, unclosed, space, quotes, Node, Array) => {
        var
            result_code = 0,
            j = 0,
            q = 0,
            index = 0,
            from = i,
            IN = TEXT_NODE,

            attr_with_value = false,
            is_end_tag = false,
            is_tag_end = false,
            is_unclosed = false,

            current_parent = document,
            current_childs = document.children,

            node = null,

            c = "",
            tag_name = "",
            value = "",
            quote = "",
            second_c = ""
        ;

        document.specified = false;

        a: while(i<l) {
            
            c = v[i];

            if (IN === TEXT_NODE) {

                if (c === "<") {

                    (i > from)
                    &&
                    (
                        current_childs.push(new Node(
                            TEXT_NODE,
                            "#text",
                            
                            null,
                            current_parent,
                            document,

                            v.substring(from,i),
                            false,
                        ))
                    );

                    if (
                        ((second_c = v[i+1]) === '!') &&
                        (v[i+2] === '-') &&
                        (v[i+3] === '-')
                    ) {
                        from = (i += 4);
                        
                        while (
                            (i < l)
                            &&
                            (
                                !(
                                    (v[i] === "-") &&
                                    (v[i+1] === "-") &&
                                    (v[i+2] === ">")
                                )
                            )
                        ) {
                            i++;
                        };

                        current_childs.push(new Node(
                            COMMENT_NODE,
                            "#comment",
                            
                            null,
                            current_parent,
                            document,

                            v.substring(from,i),
                            false,
                        ));

                        from = (i += 3);
                    }
                    else if (
                        second_c === "/"
                    ) {
                        from = (i += 2);
                        while ((i<l)&&(v[i]!==">")) {i++;};

                        if (
                            current_parent
                            &&
                            (
                                current_parent
                                .name === (
                                    tag_name = (
                                        v
                                        .substring(from, i)
                                        .trim()
                                        .toLowerCase()
                                    )
                                )
                            )
                        ) {
                            
                            current_childs = (
                                (
                                    current_parent =
                                        current_parent
                                        .parent
                                )
                                .children
                            );
                        }
                        else {
                            result_code = 1;
                            break a;
                        }

                        from = (++i);
                    }
                    else {
                        from = ++i;
                        
                        while (i < l) {
                            c = v[i];
                            if ((c === ">") || (c === "/") || space.includes(c)) {
                                break;
                            };
                            i++;
                        }
                        tag_name = v.substring(from, i).toLowerCase();
                        
                        is_tag_end = (v[i] === ">");
                        is_end_tag = (v[i] === "/" && v[i+1] === ">");
                        
                        node = new Node(
                            ELEMENT_NODE,
                            tag_name,
                            
                            (new Array()),
                            current_parent,
                            document,

                            "",
                            false,
                        );
                        current_childs.push(node);

                        is_unclosed = unclosed.includes(tag_name);
                        
                        current_childs = (current_parent = node).children;
                        IN = ELEMENT_NODE;
                    }
                }
                else {
                    // text:
                    i++;
                }
            }
            
            else {
                // in element:
                
                while ((i < l) && space.includes(v[i])) i++;

                is_end_tag = ((c = v[i]) === '/') && (v[i+1] === ">");
                is_tag_end = (c === ">");
                
                if (
                    is_end_tag
                    ||
                    is_tag_end
                ) {
                    is_unclosed
                    &&
                    (
                        (current_childs = ((current_parent = current_parent.parent).children)),
                        (is_unclosed = false)
                    );
                    
                    from = (i += (is_end_tag ? 2: 1));
                    IN = TEXT_NODE;
                }
                else {
                    from = i;
                    
                    while (i < l) {

                        if (
                            ((c = v[i]) === "=") ||
                            (c === ">") ||
                            (c === "/") ||
                            space.includes(c)
                        ) {
                            break
                        };
                        i++;
                    }
                    j = i;
                    attr_with_value = (v[i] === "=");

                    if (attr_with_value) {
                        i++;
                        while ((i < l) && space.includes(v[i])) i++;

                        if (
                            (
                                index =
                                    quotes
                                    .indexOf(
                                        c = v[i]
                                    )
                            ) === -1
                        ) {
                            q = i++;

                            is_end_tag =
                            is_tag_end =
                                false
                            ;

                            while (
                                (is_tag_end = ((c = v[i]) === ">")),
                                (is_end_tag = (c === '/') && (v[i+1] === ">")),

                                (!is_tag_end)
                                &&
                                (!is_end_tag)
                                &&
                                (i < l)
                                &&
                                ((!(space.includes(c))))
                            ) {
                                i++;
                            };

                            value = v.substring(q,i);
                        }
                        else {
                            q = ++i;
                            quote = quotes[index];

                            while ((i < l) && (v[i] !== quote)) i++;
                            value = v.substring(q,i);

                            if ((i < l) && (v[i] === quote)) i++;
                            while ((i < l) && space.includes(v[i])) i++;

                            is_tag_end = ((c = v[i]) === ">");
                            is_end_tag = (c === "/" && v[i+1] === ">");
                        }

                        current_childs.push(
                            new Node(
                                ATTRIBUTE_NODE,
                                v.substring(from,j).toLowerCase(),
                                
                                null,
                                current_parent,
                                document,
        
                                value,
                                false,
                            )
                        );

                        if (
                            is_end_tag
                            ||
                            is_tag_end
                        ) {
                            if (is_end_tag) {
                                current_childs = (current_parent = current_parent.parent).children;
                            } else if (is_unclosed) {
                                current_childs = (current_parent = current_parent.parent).children;
                                is_unclosed = false;
                            }
                            from = (i += (is_end_tag ? 2 : 1));
                            IN = TEXT_NODE;
                            continue;
                        }
                    }
                    else if (
                        is_end_tag
                        ||
                        is_tag_end
                    ) {
                        is_unclosed
                        &&
                        (
                            (current_childs = ((current_parent = current_parent.parent).children)),
                            (is_unclosed = false)
                        );
                        
                        from = (i += (is_end_tag ? 2: 1));
                        IN = TEXT_NODE;
                    }
                    else {
                        current_childs.push(
                            new Node(
                                ATTRIBUTE_NODE,
                                v.substring(from, j).toLowerCase(),
                                null,
                                current_parent,
                                document,
                                "",
                                false,
                            )
                        );
                    }
                };
            }
        };

        ((IN === TEXT_NODE) && (i > from))
        &&
        (
            current_childs.push(new Node(
                TEXT_NODE,
                "#text",
                null,
                current_parent,
                document,
                v.substring(from, i),
                false
            ))
        );
          
        return result_code;
    }
);
