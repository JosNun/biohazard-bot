const Discord = require('discord.js');
const auth = require('./auth.json');
const github = require('./github.js');
const tba = require('./tba.js');
const fs = require('fs');

let statuses;

fs.readFile('statuses.txt', 'utf8', (err, data) => {
  let lines = data.split('\n');
  lines = lines.filter((line, i) => {
    if (!(line[0] === '#' || line[0] === '')) {
      return true;
    }
  });
  statuses = lines.map((str, i) => {
    let obj = {};
    let parts = str.split('-');
    switch (parts[0]) {
      case 'p':
        obj.prefix = 'PLAYING';
        break;
      case 's':
        obj.prefix = 'STREAMING';
        break;
      case 'l':
        obj.prefix = 'LISTENING';
        break;
      case 'w':
        obj.prefix = 'WATCHING';
        break;
    }
    obj.activity = parts[1];
    return obj;
  });
  console.log(statuses);
});

// Create an instance of a Discord client
let bot = new Discord.Client();

/**
 *
 * @param {object[]} stat - an array of statuses
 * @param {string} stat.prefix - type of activity (p)laying, (w)atching, (l)istening, or (s)treaming
 * @param {string} stat.activity - what the bot is doing
 */
bot.setRandomStatus = function(stat) {
  let stats = stat || statuses;
  let status = stats[Math.floor(Math.random() * stats.length)];

  bot.user.setActivity(status.activity, {type: status.prefix});
};

bot.on('ready', () => {
  console.info('Connected');
  console.info('Logged in as: ');
  console.info(bot.user.username + ' - (' + bot.user.id + ')');
  bot.setRandomStatus();
});

// Create an event listener for messages
bot.on('message', (message) => {
  if (message.content.startsWith('!bb ')) {
    let args = message.content.substring(4).split(' ');
    let cmd = args[0];

    switch (cmd) {
      case 'test':
        console.log('setting status...');
        bot.setRandomStatus();
        break;
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
        }
        break;
      case 'help':
      case '?':
        message.channel.send(
          'Current commands include: `!bb help`, `!bb ping`,' +
            ' and `!bb feature [Your feature request here]`'
        );
        break;
      case 'tba':
        if (!args[1]) args[1] = '';
        // If the first argument is a number...
        if (!isNaN(parseInt(args[1]))) {
          if (args[2]) {
            switch (args[2]) {
              case events:
                break;
              default:
                console.log(`Nothing to do for \`${args[2]}\``);
            }
          } else {
            tba.getTeamInfo(args[1], (data) => {
              let embed = new Discord.RichEmbed();
              embed
                .setTitle('Team Stats')
                .setColor('#4cd626')
                .setThumbnail(
                  'https://frcdesigns.files.wordpress.com/2017/06/android_launcher_icon_blue_512.png'
                );

              Object.keys(data).forEach((key) => {
                if (!data[key]) return;
                embed.addField(key, data[key]);
              });
              message.channel.send(embed);
            });
          }
        } else {
          switch (args[1].toLowerCase()) {
            case 'team':
              tba.getTeamInfo(args[2], (data) => {
                let embed = new Discord.RichEmbed();
                embed
                  .setTitle('Team Stats')
                  .setColor('#4cd626')
                  .setThumbnail(
                    'https://frcdesigns.files.wordpress.com/2017/06/android_launcher_icon_blue_512.png'
                  );

                Object.keys(data).forEach((key) => {
                  if (!data[key]) return;
                  embed.addField(key, data[key]);
                });
                message.channel.send(embed);
              });
              break;
            case 'help':
            default:
              message.channel.send('Valid arguments are `team` and `help`.');
          }
        }
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

setInterval(() => {
  bot.setRandomStatus();
}, 1 * 60 * 60 * 1000);
