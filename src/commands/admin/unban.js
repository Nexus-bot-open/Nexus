const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option => 
            option.setName('user_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the unban')),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

   
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
        }

    
        if (!interaction.guild.members.me.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to unban members.', ephemeral: true });
        }

        try {
            
            await interaction.guild.members.unban(userId, reason);
            await interaction.reply({ content: `User with ID \`${userId}\` has been unbanned for: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while trying to unban the user. Please check the user ID and try again.', ephemeral: true });
        }
    },
};
