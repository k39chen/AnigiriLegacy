var Future = Npm.require("fibers/future");
var parseStringAsync = Npm.require("xml2js").parseString;

XML2JS = {
    // Parses a XML document
    //
    // @param xml {String} XML document, represented as a string
    // @param options {Object} (optional) See https://npmjs.org/package/xml2js
    // @returns {Object} The same document, represented as a Javascript Object
    parse: function (xml, options) {
        var future = new Future;
        // Construct a callback that will cause 'future.wait()' below to
        // either throw or return a value appropriately
        var cb = future.resolver();
        parseStringAsync(xml, options || {}, cb);
        return future.wait();
    }
};