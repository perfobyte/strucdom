import {VALID_DOCTYPE_NAME, VALID_SYSTEM_ID} from '../i.js';

export default (
    (token) => {
        var
            si = token.systemId
        ;
        return (
            (token.name === VALID_DOCTYPE_NAME)
            &&
            (token.publicId === null)
            &&
            ((si === null) || (si === VALID_SYSTEM_ID))
        );
    }
);