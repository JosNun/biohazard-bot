const https = require('https');
const cheerio = require('cheerio');
let links;
/**
 * @callback processSite
 * @param {string} - content of the archive page
 */

module.exports.getComics = function(query) {
  if (!links) {
    fetchArchive(parseArchive);
    console.log(links);
  } else {
    console.log(links);
  }
};

/**
 * convert an html string into a cheerio object
 * @param {string} html - an html string to parse
 */
function parseArchive(html) {
  let $ = cheerio.load(html);
  let filter = new RegExp(/\/\d+\//);
  let filteredLinks = $('a').filter((i, el) => {
    return filter.test($(el).attr('href'));
  });

  links = filteredLinks.toArray().map((el) => {
    let link = {};
    link.title = $(el).html();
    link.address = $(el).attr('href');
    return link;
  });
  
}

/**
 * Load the archive of comics from xkcd
 * @param {processSite} cb callback function to be called
 */
function fetchArchive(cb) {
  https.get('https://xkcd.com/archive/', (res) => {
    res.setEncoding('utf8');

    let data = [];
    res.on('data', (d) => data.push(d));
    res.on('end', () => {
      cb(data.join(''));
    });
  });
}
