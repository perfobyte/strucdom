import {CODE_POINTS as _} from '../../common/i.js';

export default (
    (SPACE, LINE_FEED, TABULATION, FORM_FEED) =>

    (cp) => {
        return (
            (cp === $.SPACE)
            ||
            (cp === $.LINE_FEED)
            ||
            (cp === $.TABULATION)
            ||
            (cp === $.FORM_FEED)
        );
    }
)(
    _.SPACE,
    _.LINE_FEED,
    _.TABULATION,
    _.FORM_FEED,
);
