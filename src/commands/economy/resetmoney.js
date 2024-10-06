const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

const ADMIN_ID = '1103502962032132126'; // shadow or me obvi

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetmoney')
        .setDescription('Reset the balance of a user')
        .addUserOption(option => option.setName('user').setDescription('The user whose balance will be reset').setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== ADMIN_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');

        if (targetUser.bot) {
            return interaction.reply({ content: 'You cannot reset the balance of bots.', ephemeral: true });
        }

        await UserEconomy.updateOne({ userId: targetUser.id }, { balance: 0 }, { upsert: true });

        const resetEmbed = new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 16777215).toString(16))
            .setTitle('Balance Reset')
            .setDescription(`The balance of ${targetUser} has been reset to **$0**.`)
            .setTimestamp();

        await interaction.reply({ embeds: [resetEmbed] });
    },
};
