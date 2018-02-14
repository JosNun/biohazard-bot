const thebluealliance = require('bluealliance');
const auth = require('./auth.json');

let tba = new thebluealliance(auth.tbaToken);

getTeamInfo = async function(command, number) {
  let team = await tba.getTeam(number);
  if (command == 'name') {
    console.log(team.nickname); //Why does this log "Biohazard" to the console
    return 'Team ' + number + "'s name is: " + team.nickname; //But this doesnt
  }
};

console.log(getTeamInfo('name', '4050'));
