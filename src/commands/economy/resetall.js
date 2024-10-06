const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

const ADMIN_ID = '1103502962032132126'; // shadow or me obvi

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetall') 
        .setDescription('Reset the balance and bank of all users'),
    async execute(interaction) {
        if (interaction.user.id !== ADMIN_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            
            await UserEconomy.updateMany({}, { $set: { balance: 0, bank: 0 } });

            const resetEmbed = new EmbedBuilder()
                .setColor(Math.floor(Math.random() * 16777215).toString(16))
                .setTitle('Reset Money')
                .setDescription('The balance and bank of all users have been reset to **$0**.')
                .setTimestamp();

            await interaction.reply({ embeds: [resetEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while resetting balances and banks.', ephemeral: true });
        }
    },
};
