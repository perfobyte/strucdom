export default (
    (p, token) => {
        var
            openElements = p.openElements,
            items = openElements.items,

            target = 0,

            htmlElement = null,
            htmlLocation = null,
            bodyElement = null,
            bodyLocation = null
        ;

        p.stopped = true;

        if (token.location) {
            i = openElements.stackTop;
            target = p.fragmentContext ? 0 : 2;
            
            for (; i >= target; i--) {
                p.set_end_location(items[i], token);
            }

            if (!(p.fragmentContext) && (openElements.stackTop) >= 0) {

                (htmlLocation = (htmlElement = items[0]).sourceCodeLocation)
                &&
                (!(htmlLocation.endTag))
                &&
                (
                    p.set_end_location(htmlElement, token),
                    
                    (openElements.stackTop >= 1)
                    &&
                    (bodyLocation = (bodyElement = items[1]).sourceCodeLocation)
                    &&
                    (!(bodyLocation.endTag))
                    &&
                    p.set_end_location(bodyElement, token)
                );
            }
        };
        return undefined;
    }
);
