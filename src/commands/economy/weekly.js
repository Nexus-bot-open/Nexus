const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly')
        .setDescription('Claim your weekly reward!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = await UserEconomy.findOne({ userId }) || new UserEconomy({ userId });

        const now = new Date();

        
        if (userData.weeklyClaimed && now - userData.weeklyClaimed < 7 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'You can only claim your weekly reward once every week!', ephemeral: true });
        }

       
        const reward = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

       
        userData.balance += reward;
        userData.weeklyClaimed = now;
        await userData.save();

        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🎉 Weekly Reward Claimed!')
            .setDescription(`You have received $${reward}!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
