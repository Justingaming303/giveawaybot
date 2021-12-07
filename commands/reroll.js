const giveawayinfo = require('./start')
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs');
const { giveawayers, prefix } = require('../config.json')


module.exports = (client) => {



    client.on('message', message => {


        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if (command === `${prefix}reroll`) {
            if(!message.member.roles.cache.find(r => r.id === giveawayers)) return;
            fs.readFile('giveaways.json', 'utf-8', (err, data) => {
                var msgID = args[0]
                var giveaway = JSON.parse(data);
                if (!giveaway[msgID]) return message.channel.send("Invalid messageID!")
                if (giveaway[msgID].ended == false) return message.channel.send('Giveaway is still ongoing.');



                var winnerArray = []
                var winner = []
                for (let i = 0; i < giveaway[msgID].Winners; i++) {
                    const index = winnerArray.indexOf(giveaways[link.id].entries[winnerIndex])
                    winnerArray.splice(index, 1)
                    var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                    winnerArray.push(giveaways[link.id].entries[winnerIndex])
                    if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {

                        return message.channel.send(`Not enough entries to draw ${winners} winner(s)!`)
                    }
                }

                winnerArray.forEach((w) => {

                    var wonuser = message.guild.members.cache.get(w)
                    winner.push(wonuser)
                    try {
                        const winembed = new Discord.MessageEmbed()
                            .setTitle('🎉Congratulations!🎉')
                            .setDescription("You have won ``" + `${giveaway[msgID].prize}` + "``!")
                            .setTimestamp();
                        wonuser.send(winembed).catch(e => console.log(e))
                    } catch (err) {
                        message.channel.send(`<@${w}> won! But not in the discord, or has their dms turned off `)
                    }
                    message.channel.send(`Re rolled! New winners are: ${winner.join(' ,')}!`)

                })




            })


        }








    })




}