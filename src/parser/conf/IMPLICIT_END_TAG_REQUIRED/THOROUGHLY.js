import IMPLICIT_END_TAG_REQUIRED from './_.js';
import {TAG_ID as _} from '../../../common/i.js';

export default (
    new Set([
        ...(
            IMPLICIT_END_TAG_REQUIRED
        ),
        _.CAPTION,
        _.COLGROUP,
        _.TBODY,
        _.TD,
        _.TFOOT,
        _.TH,
        _.THEAD,
        _.TR,
    ])
);
