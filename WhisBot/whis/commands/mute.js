const Discord = require('discord.js');
const customisation = require('../customisation.json');
const settings = require('../settings.json')
exports.run = async (client, message, args) => {
  let reason = args.slice(1).join(' ');
  if(!message.mentions.users.first())return message.reply("Please mention someone to mute them")
  let user = message.mentions.users.first();
  let muteRole = client.guilds.cache.get(message.guild.id).roles.cache.find(val => val.name === 'Muted');
  if(message.mentions.users.first().id === "242263403001937920") return message.reply('You can\'t mute them')
  if(message.author.id === message.mentions.users.first()) return message.reply("You can't mute yourself:facepalm:");
  if (!muteRole) {
    try {
        muteRole = await message.guild.roles.create({ data: {
            name:"Muted",
            color: "#000000",
            permissions:[]
        }});

        message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                MANAGE_MESSAGES: false,
                READ_MESSAGES: true,
                ADD_REACTIONS: true
            });
        });
    } catch(e) {
        console.log(e.stack);
    }
  }
  if (reason.length < 1) reason = 'No reason Supplied';
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);

  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply(':x: I do not have the correct permissions.').catch(console.error);
  if (message.guild.member(user).roles.cache.has(muteRole.id)) {
    if(message.content.includes("wh.mute")) return message.reply("that user has already been muted")
    message.guild.member(user).roles.remove(muteRole).then(() => {
      const embed = new Discord.MessageEmbed()
      .setColor(0x00FFFF)
      .setTimestamp()
      .addField('Action:', 'Unmute')
      .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
      .addField('Reason', reason)
      let logchannel = message.guild.channels.cache.find(x => x.name = 'logs');
      if  (!logchannel){
      message.channel.send({embed})
      }else{
        client.channels.cache.get(logchannel.id).send({embed});
        message.channel.send({embed})
      } 
      if(user.bot) return;
      message.mentions.users.first().send({embed}).catch(e =>{
        if(e) return 
      });
    });
  } else {
    if(message.content.includes("wh.unmute")) return message.reply("that user has not been muted **yet**")
    message.guild.member(user).roles.add(muteRole).then(() => {
      const embed = new Discord.MessageEmbed()
      .setColor(0x00FFFF)
      .setTimestamp()
      .addField('Action:', 'Mute')
      .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
      .addField('Reason', reason)
      .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);
      let logchannel = message.guild.channels.cache.find(x => x.name = 'logs');
      if  (!logchannel){
      message.channel.send({embed})
      }else{
        client.channels.cache.get(logchannel.id).send({embed});
        message.channel.send({embed})
      } 
      if(user.bot) return;
      message.mentions.users.first().send({embed}).catch(e =>{
        if(e) return 
      });
    });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['unmute'],
  permLevel: 2
};

exports.help = {
  name: 'mute',
  description: 'mutes or unmutes a mentioned user',
  usage: 'un/mute [mention] [reason]'
};
