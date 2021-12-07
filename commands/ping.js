const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = require('../config.json')

module.exports = client => {

    client.on('message', async message => {
        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if(command === `!ping`) {
            message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. \nAPI Latency is ${Math.round(client.ws.ping)}ms`)
        }
    })

}