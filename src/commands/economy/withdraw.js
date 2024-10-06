const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank account.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to withdraw')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const amount = interaction.options.getInteger('amount');

        const userData = await UserEconomy.findOne({ userId });

        if (!userData || userData.bank < amount) {
            return await interaction.reply({ content: 'You do not have enough money in your bank to withdraw that amount.', ephemeral: true });
        }

        userData.bank -= amount; 
        userData.balance += amount; 
        await userData.save();

        const withdrawEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215)) 
            .setTitle('Withdraw Successful')
            .setDescription(`You have withdrawn **$${amount}** from your bank account!`)
            .setTimestamp()
            .setFooter({ text: 'Spend wisely!' });

        await interaction.reply({ embeds: [withdrawEmbed] });
    },
};
