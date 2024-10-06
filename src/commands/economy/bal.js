const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Check your balance.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = await UserEconomy.findOne({ userId });

        const walletBalance = userData ? userData.balance : 0;
        const bankBalance = userData ? userData.bank : 0;

        const balanceEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215)) 
            .setTitle('💰 Your Balance')
            .setDescription(`**Wallet:** 💵 $${walletBalance}\n**Bank:** 🏦 $${bankBalance}`)
            .setTimestamp()
            .setFooter({ text: 'Keep track of your finances!' });

        await interaction.reply({ embeds: [balanceEmbed] });
    },
};
