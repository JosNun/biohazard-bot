const Discord = require('discord.js');
const auth = require('./auth.json');
const github = require('./github.js');
const tba = require('./tba.js');
const fs = require('fs');
const {VM} = require('vm2');

let statuses;

fs.readFile('statuses.txt', 'utf8', (err, data) => {
  let strings = data.split('\n');
  let lines = strings.filter(
    (line) => !(line.startsWith('#') || line.startsWith('\n'))
  );
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
        message.channel.send('Pong!').catch(console.error);
        break;
      case 'feature':
        if (!args[1] == '') {
          github
            .newFeature(message.content.slice(12), message.author.username)
            .then(({data}) => {
              message.channel.send(
                `Your feature request has been created, and is accessible here: ${
                  data.html_url
                }`
              );
            })
            .catch(console.error);
        }
        break;
      case 'help':
      case '?':
        message.channel
          .send(
            'Current commands include: `!bb help`, `!bb ping`,' +
              ' and `!bb feature [Your feature request here]. Also, try !math.`'
          )
          .catch(console.error);
        message.delete(5000).catch(console.error);
        break;
      case 'tba':
        if (!args[1]) args[1] = ''; // if there isn't any args to tba, make it an empty string to prevent crashes resulting from undefined (at some point, we should have it respond with how to use the tba command)
        // If the first argument is a number, and therefore a team...
        if (!isNaN(parseInt(args[1]))) {
          if (args[2]) {
            switch (args[2]) {
              case 'events':
                break;
              default:
                console.log(`Nothing to do for \`${args[2]}\``);
            }
          } else {
            tba.getTeamInfo(args[1], (data) => {
              if (!data['Errors']) {
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
                message.channel.send(embed).catch(console.error);
              } else {
                let embed = new Discord.RichEmbed();
                embed
                  .setTitle('Uh Oh')
                  .setColor('#f44')
                  .addField(
                    'Something broke :(',
                    JSON.stringify(data, null, 2)
                  );

                message.channel.send(embed).catch(console.error);
              }
            });
          }
        } else {
          switch (args[1].toLowerCase()) {
            case 'team':
              tba.getTeamInfo(args[2], (data) => {
                if (!data['Errors']) {
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
                  message.channel.send(embed).catch(console.error);
                } else {
                  let embed = new Discord.RichEmbed();
                  embed
                    .setTitle('Uh Oh')
                    .setColor('#f44')
                    .addField(
                      'Something broke :(',
                      JSON.stringify(data, null, 2)
                    );

                  message.channel.send(embed).catch(console.error);
                }
              });
              break;
            case 'help':
            default:
              message.channel
                .send('Valid arguments are `team` and `help`.')
                .catch(console.error);
          }
        }
    }
  } else if (message.content.startsWith('!math')) {
    if (message.content.length < 6) {
      message.channel
        .send(
          'Try shooting me a javascript expression, and I\'ll spit out the result. Try "!math \'314159\'.split(\'\').reduce((acc, el) => { return acc + parseInt(el) }, 0);"'
        )
        .catch(console.error);
      return;
    }

    let query = message.content.substring(6);
    let result = '';

    try {
      result = new VM({
        timeout: 1000,
        sandbox: {},
      }).run(query);
    } catch (err) {
      console.error('Failed to execute script.', err);
    }

    console.log(`Result: ${result}`);

    if (result && typeof result !== 'object') {
      message.channel.send(result).catch(console.error);
    } else {
      message.channel
        .send('There\'s an error in your script :/')
        .catch(console.error);
    }
  }
});

bot.on('guildMemberAdd', (member) => {
  let channel = member.guild.channels.find('name', 'bot-testing');
  if (!channel) return;
  channel
    .send(
      `Welcome to the Biohazard Discord server, ${member}! Set your nickname to something people will recognize!`
    )
    .catch(console.error);
});

bot.login(auth.discordDevToken).catch(console.error);

setInterval(() => {
  bot.setRandomStatus();
}, 1 * 60 * 60 * 1000);
