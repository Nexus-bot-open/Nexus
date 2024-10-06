const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit money into your bank account.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to deposit')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const amount = interaction.options.getInteger('amount');

        const userData = await UserEconomy.findOne({ userId });

        if (!userData || userData.balance < amount) {
            return await interaction.reply({ content: 'You do not have enough money in your wallet to deposit that amount.', ephemeral: true });
        }

        userData.balance -= amount; 
        userData.bank += amount; 
        await userData.save();

        const depositEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215)) 
            .setTitle('Deposit Successful')
            .setDescription(`You have deposited **$${amount}** into your bank account!`)
            .setTimestamp()
            .setFooter({ text: 'Keep saving!' });

        await interaction.reply({ embeds: [depositEmbed] });
    },
};
