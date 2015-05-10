var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    feed        = require('metalsmith-feed'),
    template    = require('metalsmith-templates'),
    assets      = require('metalsmith-assets'),
    Handlebars  = require('handlebars'),
    fs          = require('fs');


function __genFileIndex(prefix, path) {
    var index = {};
    var files = fs.readdirSync(path);
    for (var i = 0, len = files.length; i < len; i += 1) {
        var name = files[i].substr(0, files[i].lastIndexOf('.'));
        index[name] = prefix + name;
    }
    return index;
}

function parseDate(files, metalsmith, done) {
  for (var file in files) {
    if (files[file].date) {
      var date = new Date(files[file].date);
      files[file].year = date.getFullYear();
      files[file].month = date.getMonth()+1;
      files[file].day = date.getDate();
    }
  }
  done();
}

Handlebars.registerHelper("currPage", function (curr, page) {
    return (curr === page) ? 'active' : '';
});

Handlebars.registerHelper("toDisplay", function (record) {
    if ((record.data.root.news_count !== 0) && (record.data.index >= record.data.root.news_count)) {
        return false;
    }
    return true;
});

Metalsmith(__dirname)
        .metadata({
            sockethub_version: 'v0.3.2',
            site: {
                title: 'Sockethub',
                url: 'http://sockethub.org',
                author: 'Nick Jennings',
                title_brief: 'Sockethub - a polyglot messaging service.',
                description: 'The polyglot solution to the federated social web.',
                keywords: 'federated social web, messaging, protocols, api, open source, facebook, twitter',
            }
        })
        .source('./src/content')
        .use(markdown())
        .use(collections({
            news: {
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(parseDate)
        .use(template({
            engine: 'handlebars',
            directory: './src/templates',
            partials: __genFileIndex('partials/', './src/templates/partials/')
        }))
        .use(feed({
            collection: 'news',
            destination: 'feed.xml'
        }))
        .use(function (files) {
            var data = files['feed.xml'];
            data.contents = new Buffer(data.contents.toString().replace(/(src|href)="\//g, '$1="https://sockethub.org/'));
        })
        .use(assets({
            source: './src/content/res',
            destination: './build/res'
        }))
        .destination('./build')
        .build(function (err) {
            if (err) {
                console.log(err);
            }
        });
