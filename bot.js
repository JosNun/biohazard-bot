const Discord = require('discord.js');
const auth = require('./auth.json');
const github = require('./github-interface.js');
const tba = require('./tba-interface.js');

// Create an instance of a Discord client
let bot = new Discord.Client();

bot.on('ready', () => {
  console.info('Connected');
  console.info('Logged in as: ');
  console.info(bot.user.username + ' - (' + bot.user.id + ')');
});

// Create an event listener for messages
bot.on('message', (message) => {
  if (message.content.substring(0, 4) == '!bb ') {
    let args = message.content.substring(4).split(' ');
    let cmd = args[0];

    switch (cmd) {
      case 'ping':
        message.channel.send('Pong!');
        break;
      case 'feature':
        if (!args[1] == '') {
          let issue = github
            .newFeature(message.content.slice(12), message.author.username)
            .then(({data}) => {
              message.channel.send(
                `Your feature request has been created, and is accessible here: ${
                  data.html_url
                }`
              );
            });
          console.dir(issue);
        }
        break;
      case 'help':
      case '?':
        message.channel.send(
          'Current commands include: `!bb help`, `!bb ping`, and `!bb feature [Your feature request here]`'
        );
        break;
      case 'tba':
        if (args[1] == 'team') {
          tba.getTeamInfo(args[2], (data) => {
            let teamData = JSON.parse(data);
            let embed = new Discord.RichEmbed();
            embed.setTitle('Team Stats');
            embed.setColor('#4cd626');

            Object.keys(teamData).forEach((key) => {
              if (!teamData[key]) return;
              embed.addField(key, teamData[key]);
            });
            let teamName = teamData.nickname;
            message.channel.send(embed);
          });
        }
        break;
    }
  }
});

bot.on('guildMemberAdd', (member) => {
  let channel = member.guild.channels.find('name', 'bot-testing');
  if (!channel) return;
  channel.send(
    `Welcome to the Biohazard Discord server, ${member}! Set your nickname to something people will recognize!`
  );
});

bot.login(auth.discordDevToken);
