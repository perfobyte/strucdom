import {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    COMMENT_NODE,
} from '../conf/i.js';

// 0 success;
// 1 tag is not opened;



export default (
    (v,d, i,l, unclosed, space, quotes, empty_attr_value, Node, Array) => {
        var
            result_code = 0,
            c = "",
            tag_name = "",

            value = "",

            from = i,

            j = 0,
            q = 0,
            quote = "",

            IN = TEXT_NODE,
            current_parent = null,
            current_childs = d,

            is_unclosed = false,

            node = null,

            index = 0,
            in_quote = false,

            second_c = ""
        ;
        a: while(i<l) {
            
            c = v[i];

            if (IN === TEXT_NODE) {
                if (c === "<") {
                    console.log(v.substring(i));


                    (i>from) && (
                        current_childs.push(new Node(
                            TEXT_NODE,
                            "#text",
                            
                            null,
                            current_parent,
                            d,

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
                            d,

                            v.substring(from,i),
                            false,
                        ));

                        from = (i += 3);
                    }
                    else if (second_c === "/") {
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
                            
                            current_childs =
                                (current_parent = current_parent.parent)
                                ? current_parent.children
                                : d
                            ;
                        }
                        else {
                            current_childs =
                                (
                                    current_parent =
                                        current_parent
                                        ? current_parent.parent
                                        : null
                                )
                                ? current_parent.children
                                : d
                            ;
                            // result_code = 1;
                            // break a;
                        }

                        from = (++i);
                        IN = TEXT_NODE;
                        continue;
                    }
                    else {
                        i++;

                        while ((i<l)&&(space.includes(v[i]))) {i++;}

                        from = i;

                        while (
                            (i < l)
                            &&
                            (!(space.includes(c = v[i])))
                            &&
                            (c !== ">")
                            &&
                            (c !== "/")
                        ) {
                            i++;
                        };


                        current_parent = new Node(
                            (ELEMENT_NODE),
                            (tag_name = v.substring(from,i).toLowerCase()),
                            
                            (new Array()),
                            current_parent,
                            d,

                            "",
                            false,
                        );
                        current_childs.push(current_parent);
                        current_childs = current_parent.children;

                        is_unclosed = unclosed.includes(tag_name);

                        IN = ELEMENT_NODE;
                    }
                }
                else {
                    i++;
                }
            }
            // (IN === ELEMENT_NODE)
            else {
                if (in_quote) {
                    if (c === quote) {in_quote = false};
                    i++;
                    continue;
                }
                if (!in_quote && quotes.includes(c)) {
                    quote = c;
                    in_quote = true;
                    i++;
                    continue;
                }

                while ((i<l)&&(space.includes(v[i]))) {i++;}
                c = v[i];

                if (
                    (c === '/') &&
                    (v[i+1] === ">")
                ) {
                    
                    current_childs =
                        (current_parent = current_parent.parent)
                        ? current_parent.children
                        : d
                    ;
                    

                    from = (i += 2);
                    IN = TEXT_NODE;
                }

                else if (
                    (c === ">")
                ) {
                    if (is_unclosed) {
                        
                        current_childs =
                            (current_parent = current_parent.parent)
                            ? current_parent.children
                            : d
                        ;
                    }

                    from = ++i;
                    IN = TEXT_NODE;
                }
                else {
                    
                    from = i;
                    while (
                        (i<l)
                        &&
                        ((!space.includes(c = v[i])))
                        &&
                        (c !== "=")
                        &&
                        (c !== ">")
                        &&
                        (c !== "/")
                    ) {i++;}
                    j = i;

                    while ((i<l)&&(space.includes(v[i]))) {i++;}

                    if ((c = v[i]) === "=") {
                        i++;
                        while ((i<l)&&(space.includes(v[i]))) {i++;}
                        
                        if ((c=v[i]) === ">") {
                            value = empty_attr_value;
                            
                            i++;
                            IN = TEXT_NODE;
                        }
                        else {
                            if (
                                (index = quotes.indexOf(c)) === -1
                            ) {
                                q = i;
                                while (
                                    (i<l)
                                    &&
                                    (!space.includes(c = v[i]))
                                    &&
                                    (c !== ">")
                                    &&
                                    (c !== "/")
                                ) {i++;}
                                
                            }
                            else {
                                quote = quotes[index];

                                q = ++i;
                                while ((i<l)&&(v[i]!==quote)) {i++;}
                            }
                            value = v.substring(q,i);
                            i++;
                        }
                    }
                    else {
                        if (c === ">") {
                            i++;
                            IN = TEXT_NODE;
                        }
                        value = empty_attr_value;
                    }
                    
                    (j > from)
                    &&
                    current_childs.push(
                        new Node(
                            ATTRIBUTE_NODE,
                            v.substring(from,j).toLowerCase(),
                            
                            null,
                            current_parent,
                            d,
    
                            value,
                            false,
                        )
                    );
                };
            }

            if (i === from) {
                i++;
            }
        };
        return result_code;
    }
);
