var fs = require('fs');
var path = require('path');
var marked = require('marked');
var cheerio = require('cheerio');

// Load markdown for the given filename
module.exports = function(filename) {
    var p = path.join(__dirname, filename+'.md');
    if (fs.existsSync(p)) {
        var mdsrc = fs.readFileSync(p, 'utf-8');
        var html = marked(mdsrc);
        var $ = cheerio.load(html);

        // return page info
        return {
            html: html,
            title: $('h1').first().text()
        };
    }
};