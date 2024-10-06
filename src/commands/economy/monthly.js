const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('monthly')
        .setDescription('Claim your monthly reward!'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = await UserEconomy.findOne({ userId }) || new UserEconomy({ userId });

        const now = new Date();

        
        if (userData.monthlyClaimed && now - userData.monthlyClaimed < 30 * 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'You can only claim your monthly reward once every month!', ephemeral: true });
        }

        
        const reward = Math.floor(Math.random() * (75000 - 20000 + 1)) + 20000;

       
        userData.balance += reward;
        userData.monthlyClaimed = now;
        await userData.save();

        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🎉 Monthly Reward Claimed!')
            .setDescription(`You have received $${reward}!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
