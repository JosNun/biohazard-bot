const thebluealliance = require('bluealliance');
const https = require('https');
const auth = require('./auth.json');

let authHeader = {
  'X-TBA-Auth-Key': auth.tbaToken,
};

exports.getTeamInfo = function(number, callback) {
  let options = {
    hostname: 'www.thebluealliance.com',
    path: `/api/v3/team/frc${number}`,
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
        callback(rawData);
      });
    })
    .on('error', (e) => {
      console.log(`uh oh, something broke: ${e}`);
    });
};
