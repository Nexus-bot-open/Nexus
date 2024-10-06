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
            const remainingTime = 30 * 24 * 60 * 60 * 1000 - (now - userData.monthlyClaimed);
            const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            return interaction.reply({
                content: `You can only claim your monthly reward once every month! Please wait ${remainingDays} day(s) and ${remainingHours} hour(s) before claiming again.`,
                ephemeral: true
            });
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
