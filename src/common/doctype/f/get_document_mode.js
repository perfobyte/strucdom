import {
    VALID_DOCTYPE_NAME,
    DOCUMENT_MODE,
    
    QUIRKS_MODE_SYSTEM_ID,
    QUIRKS_MODE_PUBLIC_IDS,
    QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES,
    QUIRKS_MODE_PUBLIC_ID_PREFIXES,
    LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
    LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES,
} from '../i.js';


export default (
    (token) => {
        var
            sid = "",
            pid = "",
            prefixes = null
        ;
        return (
            token.name === VALID_DOCTYPE_NAME
            ? (

            ((sid = token.systemId) && sid.toLowerCase() === QUIRKS_MODE_SYSTEM_ID)
            ? DOCUMENT_MODE.QUIRKS
            :
            ((pid = token.publicId) !== null)
            ? (

            QUIRKS_MODE_PUBLIC_IDS.has((pid = pid.toLowerCase()))
            ? DOCUMENT_MODE.QUIRKS
            :
            (hasPrefix(
                pid,
                (
                    prefixes = (
                        (sid === null)
                        ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES
                        : QUIRKS_MODE_PUBLIC_ID_PREFIXES
                    )
                )
            ))
            ? DOCUMENT_MODE.QUIRKS
            :
            has_prefix(pid, (
                prefixes = (
                    (sid === null)
                    ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES
                    : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES
                )
            ))
            ? DOCUMENT_MODE.LIMITED_QUIRKS
            : DOCUMENT_MODE.QUIRKS


            )
            : DOCUMENT_MODE.NO_QUIRKS

            )
            : DOCUMENT_MODE.QUIRKS
        );
    }
);
