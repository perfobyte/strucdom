import { DOCUMENT_MODE } from '../../../common/i.js';

export default (
    (mode) => () => {
        return {
            nodeName: '#document',
            mode,
            childNodes: [],
        }
    }
)(
    DOCUMENT_MODE.NO_QUIRKS
);