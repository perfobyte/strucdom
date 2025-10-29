

export default (
    function(element, location) {
        return (
            (this.options.sourceCodeLocationInfo)
            &&
            (
                element.sourceCodeLocation = (
                    location
                    &&
                    ({
                        ...location,
                        startTag: location,
                    })
                )
            ),

            this.should_foster_parent_on_insertion()
            ? (
                this.foster_parent_element(element)
            )
            : (
                this.append_child(
                    (
                        (
                            this
                            .openElements
                            .currentTmplContentOrNode
                        )
                        ??
                        (this.document)
                    ),
                    element
                )
            )
        );
    }
);
