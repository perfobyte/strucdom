

export default (
    function(token, parent) {
        var
            commentNode = this.create_comment_node(token.data)
        ;
        return (
            this.append_child(parent, commentNode),
            
            (this.options.sourceCodeLocationInfo)
            &&
            (commentNode.sourceCodeLocation = token.location),

            this
        );
    }
);
