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
          // something doesn't work here
          console.log(message.content.slice(12));
          github.newFeature(message.content.slice(12));
        }
        break;
    }
  }
});

bot.login(auth.discordToken);
