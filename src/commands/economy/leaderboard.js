const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top 10 users with the most money!'),
    async execute(interaction) {
        try {
            const topUsers = await UserEconomy.find({})
                .sort({ balance: -1 })
                .limit(10)
                .lean();

            let leaderboard = '';
            topUsers.forEach((user, index) => {
                leaderboard += `**#${index + 1}** <@${user.userId}> - $${user.balance}\n`;
            });

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(Math.floor(Math.random() * 16777215).toString(16)) 
                .setTitle('🏆 Global Leaderboard')
                .setDescription(leaderboard || 'No users found.')
                .setTimestamp()
                .setFooter({ text: 'Keep working hard to climb the ranks!' });

            await interaction.reply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            await interaction.reply({ content: 'There was an error fetching the leaderboard. Please try again later.', ephemeral: true });
        }
    },
};
