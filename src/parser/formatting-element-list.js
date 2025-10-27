
export var
    NOAH_ARK_CAPACITY = 3,
    EntryType = {
        Marker: 0, 0: "Marker",
        Element: 1, 1: "Element",
    },
    MARKER = { type: EntryType.Marker }
;

export class FormattingElementList {
    constructor(treeAdapter) {
        this.treeAdapter = treeAdapter;
        this.entries = [];
        this.bookmark = null;
    }
    _getNoahArkConditionCandidates(newElement, neAttrs) {
        var candidates = [];
        var neAttrsLength = neAttrs.length;
        var neTagName = this.treeAdapter.getTagName(newElement);
        var neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
        for (var i = 0; i < this.entries.length; i++) {
            var entry = this.entries[i];
            if (entry.type === EntryType.Marker) {
                break;
            }
            var { element } = entry;
            if (this.treeAdapter.getTagName(element) === neTagName &&
                this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
                var elementAttrs = this.treeAdapter.getAttrList(element);
                if (elementAttrs.length === neAttrsLength) {
                    candidates.push({ idx: i, attrs: elementAttrs });
                }
            }
        }
        return candidates;
    }
    _ensureNoahArkCondition(newElement) {
        if (this.entries.length < NOAH_ARK_CAPACITY)
            return;
        var neAttrs = this.treeAdapter.getAttrList(newElement);
        var candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
        if (candidates.length < NOAH_ARK_CAPACITY)
            return;
        var neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
        var validCandidates = 0;
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
                validCandidates += 1;
                if (validCandidates >= NOAH_ARK_CAPACITY) {
                    this.entries.splice(candidate.idx, 1);
                }
            }
        }
    }
    insertMarker() {
        this.entries.unshift(MARKER);
    }
    pushElement(element, token) {
        this._ensureNoahArkCondition(element);
        this.entries.unshift({
            type: EntryType.Element,
            element,
            token,
        });
    }
    insertElementAfterBookmark(element, token) {
        var bookmarkIdx = this.entries.indexOf(this.bookmark);
        this.entries.splice(bookmarkIdx, 0, {
            type: EntryType.Element,
            element,
            token,
        });
    }
    removeEntry(entry) {
        var entryIndex = this.entries.indexOf(entry);
        if (entryIndex !== -1) {
            this.entries.splice(entryIndex, 1);
        }
    }
    clearToLastMarker() {
        var markerIdx = this.entries.indexOf(MARKER);
        if (markerIdx === -1) {
            this.entries.length = 0;
        }
        else {
            this.entries.splice(0, markerIdx + 1);
        }
    }
    getElementEntryInScopeWithTagName(tagName) {
        var entry = this.entries.find((entry) => entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
        return entry && entry.type === EntryType.Element ? entry : null;
    }
    getElementEntry(element) {
        return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element);
    }
}
