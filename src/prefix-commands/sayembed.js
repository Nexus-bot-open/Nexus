const { EmbedBuilder } = require('discord.js'); 

exports.run = async (message, args) => {
    
    if (!args.length) {
        return message.reply('`!sayembed` embed version of say!\n\n !sayembed <context>');
    }

    const fixedMessage = args.join(' ').replace(/@/g, '');
    if (!fixedMessage) return message.reply('Pings aren\'t allowed for this command.');

    const embed = new EmbedBuilder() 
        .setColor('#800000') 
        .setDescription(fixedMessage) 
        .setTimestamp();

  
    message.channel.send({ embeds: [embed] });

 
    message.delete().catch(console.error);
};
