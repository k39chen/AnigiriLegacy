Package.describe({
  summary: "Parse XML into JSON"
});

Npm.depends({xml2js: "0.2.6"});

Package.on_use(function (api) {
    api.export('XML2JS'); // `api.export` introduced in Meteor 0.6.5
    api.add_files("xml2js.js", "server");
});