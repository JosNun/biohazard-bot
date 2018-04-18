/**
 * The Blue Alliance module
 * @module tba
 */

const https = require('https');
const auth = require('./auth.json');

let authHeader = {
  'X-TBA-Auth-Key': auth.tbaToken,
};

/**
 * Callback for fetched data
 *
 * @callback fetchedCallback
 * @param {object} - The fetched data
 */

/**
 * Get a teams information from TBA
 * @param {string|Object} options - team number or options object
 * @param {string|number} options.number - The number of the team
 * @param {boolean} [options.simple=true] - Whether to fetch a simple version of the data
 * @param {fetchedCallback} callback - callback that handles the response
 * @return {Error}
 */
module.exports.getTeamInfo = function(options, callback) {
  let path = `/team/frc`;
  if (typeof options === 'string') {
    path += `${options}/simple`;
  } else if (typeof options === 'object') {
    let num = options.number || undefined;
    if (!num) return new Error('Team number is not defined');
    let simple = !options.simple ? '/simple' : '';

    path = `${path}${num}${simple}`;
    console.log(path);
  }
  fetchData(path, callback);
};

/**
 * Fetch data from TBA
 * @param {String} path - where the api request should go. For further info, see https://www.thebluealliance.com/apidocs/v3
 * @param {fetchedCallback} callback - function to be called on completion
 */
function fetchData(path, callback) {
  let options = {
    hostname: 'www.thebluealliance.com',
    path: `/api/v3${path}`,
    headers: authHeader,
  };
  let team = https
    .get(options, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        callback(JSON.parse(rawData));
      });
    })
    .on('error', (e) => {
      console.log(`uh oh, something broke: ${e}`);
    });
}
