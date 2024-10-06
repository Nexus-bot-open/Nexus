const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

const ADMIN_ID = '1103502962032132126'; // shadow or me obvi

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moneygive')
        .setDescription('Give money to a user as an admin.')
        .addUserOption(option => option.setName('user').setDescription('The user to give money to').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of money to give').setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== ADMIN_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const recipient = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (recipient.bot) {
            return interaction.reply({ content: 'You cannot give money to bots.', ephemeral: true });
        }

        await UserEconomy.updateOne({ userId: recipient.id }, { $inc: { balance: amount }, upsert: true });

        const moneyGiveEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215).toString(16))
            .setTitle('Money Given')
            .setDescription(`You have given **$${amount}** to ${recipient}.`)
            .setTimestamp();

        await interaction.reply({ embeds: [moneyGiveEmbed] });
    },
};
