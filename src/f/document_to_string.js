

export default (
    (document, unclosed) => {
        var 
            i = 0,
            l = document.length,
            v = ""
        ;
        for(;i<l;i++){
            v += document[i].outer_html(unclosed);
        };
        return v;
    }
);
