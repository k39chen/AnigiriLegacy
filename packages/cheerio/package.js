Package.describe({
  summary: "jQuery implementation for the server"
});

Npm.depends({cheerio: "0.12.4"});

Package.on_use(function (api) {
    api.export('Cheerio');
    api.add_files("cheerio.js", "server");
});