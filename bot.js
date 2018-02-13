let Discord = require('discord.io');
let auth = require('./auth.json');
// Initialize Discord Bot
let bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});
bot.on('ready', function(evt) {
  console.info('Connected');
  console.info('Logged in as: ');
  console.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', (user, userID, channelID, message, evt) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 4) == '!bb ') {
    let args = message.substring(4).split(' ');
    let cmd = args[0];

    switch (cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!',
        });
        break;
      // Just add any case commands if you want to..
    }
  }
});
