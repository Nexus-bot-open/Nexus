const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay a user')
        .addUserOption(option => option.setName('user').setDescription('The user to pay').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount to pay').setRequired(true)),
    async execute(interaction) {
        const payerId = interaction.user.id;
        const payee = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const payerData = await UserEconomy.findOne({ userId: payerId });

        if (!payerData || payerData.balance < amount) {
            return interaction.reply({ content: 'You do not have enough balance.', ephemeral: true });
        }

        await UserEconomy.updateOne({ userId: payerId }, { $inc: { balance: -amount } });
        await UserEconomy.updateOne({ userId: payee.id }, { $inc: { balance: amount }, upsert: true });

        const payEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215).toString(16))
            .setTitle('Payment Made')
            .setDescription(`You have paid **$${amount}** to ${payee}.`)
            .setTimestamp();

        await interaction.reply({ embeds: [payEmbed] });
    },
};
