const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specified duration with a reason')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the timeout'))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('Duration of timeout (e.g., 1w2d3h)')),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const duration = interaction.options.getString('duration');

        if (!interaction.member.permissions.has('TIMEOUT_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has('TIMEOUT_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to timeout members.', ephemeral: true });
        }

        const time = parseDuration(duration);
        if (!time) {
            return interaction.reply({ content: 'Invalid time format. Please use w,d,h (weeks, days, hours).', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(user.id);
        if (!member) {
            return interaction.reply({ content: 'The user is not in this server.', ephemeral: true });
        }

        try {
            await member.timeout(time, reason);
            await user.send(`You have been timed out for **${duration}** with reason: **${reason}**.`);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Timed Out')
                .addFields(
                    { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Duration', value: duration, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Timeout by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while trying to timeout the user.', ephemeral: true });
        }
    },
};

function parseDuration(duration) {
    const regex = /(?:(\d+)w)?(?:(\d+)d)?(?:(\d+)h)?/;
    const matches = duration.match(regex);
    
    if (!matches) return null;

    const weeks = matches[1] ? parseInt(matches[1]) * 604800000 : 0;
    const days = matches[2] ? parseInt(matches[2]) * 86400000 : 0;
    const hours = matches[3] ? parseInt(matches[3]) * 3600000 : 0;

    return weeks + days + hours;
}
