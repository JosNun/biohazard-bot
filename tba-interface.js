const thebluealliance = require('bluealliance');
const auth = require('./auth.json');

let tba = new thebluealliance(auth.tbaToken);

exports.getTeamInfo = async function(command, number) {
  let team = await tba.getTeam(number);
  if (command == 'name') {
    return 'Team ' + number + "'s name is: " + team.nickname;
  }
};
