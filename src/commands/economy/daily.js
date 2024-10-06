const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward!'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = await UserEconomy.findOne({ userId }) || new UserEconomy({ userId });

        const now = new Date();

        
        if (userData.dailyClaimed && (now - userData.dailyClaimed) < 24 * 60 * 60 * 1000) {
         
            const remainingTime = 24 * 60 * 60 * 1000 - (now - userData.dailyClaimed);
            const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

            return interaction.reply({ 
                content: `You can only claim your daily reward once every 24 hours! Please wait ${remainingHours} hour(s) and ${remainingMinutes} minute(s) before claiming again.`, 
                ephemeral: true 
            });
        }

       
        const reward = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;

        
        userData.balance += reward;
        userData.dailyClaimed = now;
        await userData.save();

        
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('🎉 Daily Reward Claimed!')
            .setDescription(`You have received $${reward}!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
