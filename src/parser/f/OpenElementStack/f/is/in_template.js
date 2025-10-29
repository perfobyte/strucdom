

export default (
    function() {
        return (
            (this.currentTagId === this.TAG_ID.TEMPLATE)
            &&
            (((this.current).namespaceURI) === this.NS.HTML)
        );
    }
)