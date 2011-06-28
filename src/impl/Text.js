defineLazyProperty(impl, "Text", function() {
    function Text(doc, data) {
        this.ownerDocument = doc;
        this._data = data;
    }
    
    var nodeValue = attribute(function() { return this._data; },
                              function(v) { 
                                  this._data = v;
                                  if (this.root)
                                      this.root.mutateValue(this);
                              });
    
    Text.prototype = Object.create(impl.CharacterData.prototype, {
        nodeType: constant(TEXT_NODE),
        nodeName: constant("#text"),
        // These three attributes are all the same.
        // The data attribute has a [TreatNullAs=EmptyString] but we'll
        // implement that at the interface level
        nodeValue: nodeValue,
        textContent: nodeValue,
        data: nodeValue,

        splitText: constant(function splitText(offset) {
            if (offset > this._data.length) IndexSizeError();

            let newdata = this._data.substring(offset),
                newnode = this.ownerDocument.createTextNode(newdata);
            this._data = this.data.substring(0, offset);

            let parent = this.parentNode;
            if (parent !== null)
                parent.insertBefore(newnode, this.nextSibling);

            return newnode;
        }),

        // XXX
        // wholeText and replaceWholeText() are not implemented yet because
        // the DOMCore specification is considering removing or altering them.
        wholeText: attribute(nyi),
        replaceWholeText: constant(nyi),
   
        // Utility methods

        clone: constant(function clone() {
            return new impl.Text(this.ownerDocument, this._data);
        }),

        isEqual: constant(function isEqual(n) {
            return this._data === n._data;
        }),
     
    });

    return Text;
});