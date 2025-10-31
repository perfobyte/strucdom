

export default (
    function(unclosed) {
        var 
            i = 0,
            childs = this.children,
            l = childs.length,
            v = ""
        ;
        for(;i<l;i++){
            v += childs[i].outer_html(unclosed);
        };
        return v;
    }
);
