const fs = require('fs');
const Discord = require('discord.js')
const client = new Discord.Client();
const { prefix } = require('../config.json')


module.exports = (client) => {



    client.on('message',  (message) => {


        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if (command === `${prefix}glist`) {
            fs.readFile('giveaways.json', 'utf8', (err, data) => {
                let activeGiveaways = []
                const giveaways = JSON.parse(data);
                giveaways.messageIDs.forEach(ID => {
                var index = giveaways.messageIDs.indexOf(ID)
                var name = giveaways[ID].prize
                var giveaway = `${index + 1}) **${name}**`
                console.log(giveaway);
                activeGiveaways.push(giveaway)


                })

                const embed = new Discord.MessageEmbed()

                .setTitle(`${message.guild.name}'s Active Giveaways`)
                .setDescription(activeGiveaways.join('\n') || 'No Current Giveaways')
                .setTimestamp()
                message.channel.send(embed)




            })
        }






    })



}