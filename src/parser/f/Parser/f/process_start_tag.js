
export default (
    function(token) {
        return (
            this.should_process_start_tag_token_in_foreign_content(token)
            ? this.start_tag_in_foreign_content(this, token)
            : this.start_tag_outside_foreign_content(token),

            this
        );
    }
);
