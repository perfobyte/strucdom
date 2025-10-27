import {NS, TAG_ID as _} from '../../../../html/i.js'

export default (
    (MATHML, MI, MO, MN, MS, MTEXT) =>

    (tn, ns) => {
        return (
            (ns === MATHML)
            &&
            (
                (tn === MI)
                ||
                (tn === MO)
                ||
                (tn === MN)
                ||
                (tn === MS)
                ||
                (tn === MTEXT)
            )
        );
    }
)(NS.MATHML, _.MI, _.MO, _.MN, _.MS, _.MTEXT)