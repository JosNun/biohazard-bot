let Discord = require('discord.js');
let auth = require('./auth.json');

// Create an instance of a Discord client
let bot = new Discord.Client();

// The ready event is vital, it means that your bot will only start reacting
// to information from Discord _after_ ready is emitted
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
        if (!args[1] === '') {
          console.log(message.content.slice(12));
          // should probably seperate github logic out into another file
        }
        break;
    }
  }
});

bot.login(auth.token);
