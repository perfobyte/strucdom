
export default (
    function(tid, element, foreignNS) {
        return (
            this.adapter_is_integration_point(
                tid,
                (element.namespaceURI),
                (element.attrs),
                foreignNS
            )
        );
    }
);
