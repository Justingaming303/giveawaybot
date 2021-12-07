const Discord = require('discord.js');
const { giveawayers, prefix } = require('../config.json')
const fs = require('fs')

const ms = require('ms');
const { stringify } = require('querystring');
const client = new Discord.Client({


});



var giveawaytimeout;

module.exports = (client) => {

    client.on('message', async message => {
        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);
        var winners;
        if (command === `${prefix}start`) {
            if(!message.member.roles.cache.find(r => r.id === giveawayers)) return;
            var msg = message.content;


            const prize = msg.split('^')[1]
            if (!prize) return message.reply('Please provide a prize. ``!start `prize` `winners` `time` ``')
            winners = parseInt(msg.split('^')[2])
            if (isNaN(winners)) return message.reply('Winners must be a number! ``!start `prize` `winners` `time` ``.')
            if (!winners) return message.reply('Please provide how many winners there should be. ``!start `prize` `winners` `time` ``')
            const time = msg.split('^')[3]

            if (!time) return message.reply('Provide a time. ``!start `prize` `winners` `time` ``')

            const duration = ms(time)
            const embed = new Discord.MessageEmbed()
                .setTitle(prize)
                .setDescription(`Winners: ${winners}\n Time: ${time}\n Hosted By: ${message.author}`)
                .setTimestamp()
                .setFooter('Giveaway')

            console.log(prize, time, duration, winners)
            try {
                var link = await message.channel.send(embed)
                link.react('🎉')
            } catch (err) {
                return message.channel.send("Couldnt send messages to the channel!")
            }







           // message.channel.send(`@everyone`)
            fs.readFile('giveaways.json', 'utf-8', async (err, data) => {
                try {
                    var giveaway = JSON.parse(data)

                    giveaway.giveaways++
                    var number = giveaway.giveaways



                    giveaway[link.id] = {
                        "ID": number.toString(),
                        "prize": prize,
                        "duration": duration,
                        "Winners": winners,
                        "messageID": link.id,
                        "entries": [],
                        "ended": false
                    }

                    giveaway.messageIDs.push(link.id)









                } catch (err) {
                    console.log(err)
                    return message.channel.send("Unable to create giveaway, if this problem presist please contact Boatshed or bangjo#9578.")
                }

                fs.writeFile('giveaways.json', JSON.stringify(giveaway, null, 4), (err) => {


                    console.log("giveaway stored!")
                    giveawaytimeout = setTimeout(() => {

                        fs.readFile('giveaways.json', 'utf-8', async (err, data) => {
                            let giveaways = JSON.parse(data)
                            console.log(link.id);
                            console.log(giveaways[link.id])
                            console.log("giveaway done")
                            var gi = giveaways.messageIDs.indexOf(args[0])
                            giveaways.messageIDs.splice(gi)
                            giveaways[link.id].ended = true
                            var winner = []
                            var winnerArray = []
                            exports.winner = winner

                            for (let i = 0; i < winners; i++) {
                                var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                                if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {
                                    const index = winnerArray.indexOf(giveaways[link.id].entries[winnerIndex])
                                    winnerArray.splice(index, 1)
                                    var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                                    winnerArray.push(giveaways[link.id].entries[winnerIndex])
                                    if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {

                                        return message.channel.send(`Not enough entries to draw ${winners} winner(s)!`)
                                    }

                                }
                                winnerArray.push(giveaways[link.id].entries[winnerIndex])

                            }
                            fs.writeFile('giveaways.json', JSON.stringify(giveaways, null, 4), (err) => {




                            })

                            try {


                                winnerArray.forEach((w) => {

                                    var wonuser = message.guild.members.cache.get(w)
                                    winner.push(wonuser)
                                    try {
                                        const winembed = new Discord.MessageEmbed()
                                            .setTitle('🎉Congratulations!🎉')
                                            .setDescription("You have won ``" + `${prize}` + "``!")
                                            .setTimestamp();
                                        wonuser.send(winembed).catch(e => console.log(e))
                                    } catch (err) {

                                    }

                                })

                                message.channel.send(`${winner.join(', ')} has won ${prize}!`)
                                const newembed = new Discord.MessageEmbed()
                                    .setTitle(giveaway[link.id].prize + ' | ENDED')
                                    .setDescription(`Winners: **${giveaway[link.id].Winners}**\n Time: **ENDED**\n Winners:${winner.join(', ')}\n Hosted By: ${message.author}`)
                                    .setTimestamp()
                                    .setFooter('Giveaway')
                                link.edit(newembed)

                            } catch (err) {
                                const nowinnersembed = new Discord.MessageEmbed()
                                    .setTitle(giveaway[link.id].prize + ' | ENDED')
                                    .setDescription(`Winners: **${giveaway[link.id].Winners}**\n Time: **ENDED**\n Winners:${winner.join(', ')}\n Hosted By: ${message.author}`)
                                    .setTimestamp()
                                    .setFooter('Giveaway')
                                link.edit(nowinnersembed)
                            }





                        })
                    }, duration)










                    if (err) {
                        console.log(err);
                        return message.channel.send("Unable to store giveaway, if this problem presist please contact Boatshed or bangjo#9578. ")

                    }


                })






            })

        }

        if (command === `${prefix}end`) {
            //   if(!message.member.roles.cache.find(r => r.id === giveawayers)) return;
            fs.readFile('giveaways.json', 'utf8', (err, data) => {
                var giveaway = JSON.parse(data);

                console.log("em")
                if (!args[0]) return message.reply('You must include a giveaway message ID.')
                if (giveaway.messageIDs.includes(args[0])) {

                    clearTimeout(giveawaytimeout)

                    var gi = giveaway.messageIDs.indexOf(args[0])
                    giveaway.messageIDs.splice(gi)

                    message.channel.send(`Give away for ${giveaway[args[0]].prize} ended!`)


                    giveaway[args[0]].ended = true

                    fs.writeFile('giveaways.json', JSON.stringify(giveaway, null, 4), async (err) => {


                        var gi = giveaway.messageIDs.indexOf(args[0])
                        giveaway.messageIDs.splice(gi)
                        var link = await message.channel.messages.fetch(args[0])


                        //sww
                        var winner = []
                        var winnerArray = []
                        exports.winner = winner

                        for (let i = 0; i < giveaway[args[0]].Winners; i++) {
                            const index = winnerArray.indexOf(giveaway[link.id].entries[winnerIndex])
                            winnerArray.splice(index, 1)
                            var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                            winnerArray.push(giveaways[link.id].entries[winnerIndex])
                            if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {

                                return message.channel.send(`Not enough entries to draw ${winners} winner(s)!`)
                            }
                        }
                        fs.writeFile('giveaways.json', JSON.stringify(giveaway, null, 4), (err) => {




                        })



                        winnerArray.forEach((w) => {

                            var wonuser = message.guild.members.cache.get(w)
                            winner.push(wonuser)
                            try {
                                const winembed = new Discord.MessageEmbed()
                                    .setTitle('🎉Congratulations!🎉')
                                    .setDescription("You have won ``" + `${giveaway[args[0]].prize}` + "``!")
                                    .setTimestamp();
                                wonuser.send(winembed).catch(e => console.log(e))
                            } catch (err) {
                                message.channel.send(`<@${w}> won! But not in the discord, or has their dms turned off `)
                                console.log(err);
                            }

                        })

                        message.channel.send(`${winner.join(', ')} has won ${giveaway[args[0]].prize}!`)
                        const newembed = new Discord.MessageEmbed()
                            .setTitle(giveaway[args[0]].prize + ' | ENDED')
                            .setDescription(`Winners: **${giveaway[args[0]].Winners}**\n Time: **ENDED**\n Winners:${winner.join(', ')}`)
                            .setTimestamp()
                            .setFooter('Giveaway')
                        link.edit(newembed)








                        fs.writeFile('giveaways.json', JSON.stringify(giveaway, null, 4), err => {





                        })




                    })
                } else {
                    return message.reply('Invalid messageID!')
                }

            })

        }




    })



}