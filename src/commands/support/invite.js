const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get an invite link for the bot!'),
    async execute(interaction) {
        const clientId = process.env.CLIENTID; 
        const permissions = 8; 

        const inviteURL = `https://discord.com/oauth2/authorize?client_id=1290104052109279272`;

     
        const row = new ActionRowBuilder() 
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(ButtonStyle.Link) 
                    .setURL(inviteURL) 
            );

        await interaction.reply({
            content: 'Click the button below to invite me to your server:',
            components: [row],
        });
    },
};
