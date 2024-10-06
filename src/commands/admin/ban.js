const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the ban')),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

    
        if (!interaction.guild.members.me.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to ban members.', ephemeral: true });
        }

       
        if (!interaction.guild.members.cache.get(user.id)) {
            return interaction.reply({ content: 'The user is not in this server.', ephemeral: true });
        }

        try {
            
            await interaction.guild.members.ban(user, { reason });
            await interaction.reply({ content: `${user.tag} has been banned for: **${reason}**` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while trying to ban the user.', ephemeral: true });
        }
    },
};
