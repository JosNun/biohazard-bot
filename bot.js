let Discord = require('discord.js');
let auth = require('./auth.json');
let github = require('./github-interface.js');

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
          github.newFeature(message.content.slice(12), message.author.username);
          message.channel.send('_TODO: Reply with link to request_');
        }
        break;
      case 'help':
      case '?':
        message.channel.send(
          'Current commands include: `!bb help`, `!bb ping`, and `!bb feature [Your feature request here]`'
        );
    }
  }
});

bot.on('guildMemberAdd', (member) => {
  let channel = member.guild.channels.find('name', 'bot-testing');
  if (!channel) return;
  channel.send(
    'Welcome to the Biohazard Discord server, ${member}! Set your nickname to something people will recognize!'
  );
});

bot.login(auth.discordToken);
