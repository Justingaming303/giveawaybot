const Discord = require('discord.js');
const fs = require('fs')

const client = new Discord.Client();




module.exports = (client) => {

    client.on("messageReactionAdd", async (reaction, user) => {
        fs.readFile('giveaways.json', 'utf-8', (err, data) => {
            
            var giveaways = JSON.parse(data)
            if(user.id === client.user.id) return;
            if(!giveaways.messageIDs.includes(reaction.message.id)) return;
            try{
                const embed = new Discord.MessageEmbed()
                .setTitle(`🎉You have entered the giveaway for ${giveaways[reaction.message.id].prize}!🎉`)
                .setTimestamp()
                user.send(embed)
              
               
            } catch (err) {
                return console.log(err);;

            }

            
           giveaways[reaction.message.id].entries.push(user.id)
           
            fs.writeFile('giveaways.json', JSON.stringify(giveaways, null, 4) , (err) =>{
                
                someoneentered()
               
                if(err) {
                    message.channel.send("Error code 000x0005, if this problem presist please contact Boatshed or bangjo#9578.")
                   
                }

            })

            function someoneentered() {
                console.log("Someone entered!!")
            }
        })
        


    })

    client.on('messageReactionRemove', async (reaction, user) => {
        fs.readFile('giveaways.json', 'utf-8', (err, data) => {

            var giveaways = JSON.parse(data)
            if(user.id === client.user.id) return;
            if(!giveaways.messageIDs.includes(reaction.message.id)) return;
            
            const index = giveaways[reaction.message.id].entries.indexOf(user.id)
           giveaways[reaction.message.id].entries.splice(index, 1)
            console.log(giveaways[reaction.message.id].entries + 'ww') ;
      
            try{
                const embed = new Discord.MessageEmbed()
                .setTitle(`😢You have left the giveaway for ${giveaways[reaction.message.id].prize}!😢`)
                .setTimestamp()

              
                user.send(embed)
            } catch (err) {
                return console.log(err);;

            }
            fs.writeFile('giveaways.json', JSON.stringify(giveaways, null, 4) , (err) =>{

          
                if(err) {
                    message.channel.send("Error code 000x0005, if this problem presist please contact Boatshed or bangjo#9578.")
                   
                }

            })
        })

    })

    



}