const Discord = require('discord.js');
const { giveawayers, prefix } = require('../config.json')
const fs = require('fs')

const ms = require('ms');
const { error } = require('console');

const client = new Discord.Client({


});



var giveawaytimeout;

module.exports = (client) => {

    client.on('message', async message => {
        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        if (command === `${prefix}create`) {
            if(!message.member.roles.cache.find(r => r.id === giveawayers)) return;



            var winners;
            let prize;

            let time


            const filter = msg => msg.author.id == message.author.id;


            const options = {
                maxMatches: 1,
                idle: 60000

            };
            // prize name


            var questions = [
                "What is the prize of the giveaway?",
                "How long should the giveaway last?",
                "How many winners should the giveaway draw?",

            ];
            let counter = 0
            message.channel.send(questions[counter++]).catch(e => console.log(e))
            let collector = new Discord.MessageCollector(message.channel, filter, options);
            let answers = [

            ];
            collector.on('collect', m => {
                
                let questionIndex = 0
                if (counter <= questions.length) {
                    m.channel.send(questions[counter++])
                    // if (counter == 1) {
                    //     if (isNaN(value)) return message.channel.send("Please provide a number!")
                    // } else if (counter == 2) {
                    //     if (isNaN(value)) return message.channel.send("Please provide a number!")
                    // } else {
                        answers.push(m.content)
                        
                   
                        if(counter == 4) {
                            collector.stop()
                        }    
                 
                    
                }

               




            })
            collector.on('end', async (collected) => {

                    
                message.channel.send('Making a giveaway...')
                console.log(answers);
                console.log("collection ended!");

                counter = 0;
              
                // prize = answers[0];
                // time = answers[1];
                // winners = answers[2]
                var duration = ms(answers[1])

              

           
                try {
                    const embed = new Discord.MessageEmbed()
                    .setTitle(answers[0])
                    .setDescription(`Winners: ${answers[2]}\n Time: ${answers[1]}\n Hosted By: ${message.author}`)
                    .setTimestamp()
                    .setFooter('Giveaway')

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
                            "prize": answers[0],
                            "duration": answers[1],
                            "Winners": answers[2],
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

                                for (let i = 0; i < parseInt(answers[2]); i++) {
                                    var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                                    if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {
                                        const index = winnerArray.indexOf(giveaways[link.id].entries[winnerIndex])
                                        winnerArray.splice(index, 1)
                                        var winnerIndex = Math.floor(Math.random() * giveaways[link.id].entries.length)
                                        winnerArray.push(giveaways[link.id].entries[winnerIndex])
                                        if (winnerArray.includes(giveaways[link.id].entries[winnerIndex])) {

                                            return message.channel.send(`Not enough entries to draw ${answers[2]} winner(s)!`)
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
                                                .setDescription("You have won ``" + `${answers[0]}` + "``!")
                                                .setTimestamp();
                                            wonuser.send(winembed).catch(e => console.log(e))
                                        } catch (err) {

                                        }

                                    })

                                    message.channel.send(`${winner.join(', ')} has won ${answers[0]}!`)
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



                                answers = []


                            })
                        }, duration)










                        if (err) {
                            console.log(err);
                            return message.channel.send("Unable to store giveaway, if this problem presist please contact Boatshed or bangjo#9578. ")

                        }


                    })






                })
            })









        }
    })
}
