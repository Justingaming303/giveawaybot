const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
const giveawayinfo = require('./commands/start')

const start = require('./commands/start')
const listener = require('./commands/reactionlistener')
const reroll = require('./commands/reroll');
const glist = require('./commands/glist');
const create = require('./commands/create');
const ping = require('./commands/ping');
const prefix = require('./config.json')


client.once('ready', () => {

    console.log(`Property of Justin W.`);

  
    //client.user.setActivity(`statusHere `, { type: 'WATCHING' }).catch(console.error);

});

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(command === `!help`) {
        const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Giveaway Bot Help Page`)
        .setDescription('!start - Starts a giveaway - ``!start <prize> <winners> <time> ``\n\n!glist - Shows a list of active giveaways in the server\n\n!create - Prompts an interactive way to start a giveaway\n\n !reroll - Rerolls a giveaway that has ended - ``!reroll <messageID>``\n\n !ping - Shows the latency of the bot\n\n !help - This page')



   
        message.channel.send(embed)
    }
})






listener(client)
start(client);
reroll(client);
glist(client);
ping(client)
create(client)

client.login(token)