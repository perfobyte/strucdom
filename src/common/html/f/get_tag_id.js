import {TAG_NAME_TO_ID, TAG_ID} from '../conf/i.js';

export default (
    (UNKNOWN) => (tagName) => {
        return (
            TAG_NAME_TO_ID.get(tagName)
            ??
            UNKNOWN
        );
    }
)(TAG_ID.UNKNOWN);
