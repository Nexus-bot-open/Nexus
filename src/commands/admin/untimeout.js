const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove a timeout from a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to untimeout')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has('TIMEOUT_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to untimeout members.', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({ content: 'The user is not in this server.', ephemeral: true });
        }

        try {
            await member.timeout(null);
            await user.send('Your timeout has been removed.');
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('User Untimed Out')
                .addFields(
                    { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
                    { name: 'Status', value: 'The timeout has been removed.', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Untimed out by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while trying to untimeout the user.', ephemeral: true });
        }
    },
};
