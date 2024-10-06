const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

const COOLDOWN_TIME = 300000; 
const ROB_CHANCE = 0.25;
const PERCENT_TO_STEAL = 0.05;

const adminUserId = '1103502962032132126'; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to rob another user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to rob')
                .setRequired(true)),
    async execute(interaction) {
        const userId = interaction.user.id;
        const targetUser = interaction.options.getUser('target');
        const targetId = targetUser.id;

        
        if (targetId === adminUserId) {
            return await interaction.reply({ content: 'You cannot rob an admin!', ephemeral: true });
        }

        
        const lastRobbed = await UserEconomy.findOne({ userId });
        const now = Date.now();

        if (lastRobbed && lastRobbed.lastRobbed && now - lastRobbed.lastRobbed < COOLDOWN_TIME) {
            const remainingTime = Math.ceil((COOLDOWN_TIME - (now - lastRobbed.lastRobbed)) / 1000);
            return await interaction.reply({ content: `You can only rob every 5 minutes. Please wait ${remainingTime} seconds.`, ephemeral: true });
        }

      
        const targetData = await UserEconomy.findOne({ userId: targetId });

        if (!targetData || targetData.balance <= 0) {
            return await interaction.reply({ content: `${targetUser.username} has no money to rob!`, ephemeral: true });
        }

        
        const success = Math.random() < ROB_CHANCE;

        if (success) {
            const amountStolen = Math.floor(targetData.balance * PERCENT_TO_STEAL);
            if (amountStolen > 0) {
                
                targetData.balance -= amountStolen;
                await targetData.save();

            
                await UserEconomy.updateOne(
                    { userId },
                    { $inc: { balance: amountStolen }, lastRobbed: now },
                    { upsert: true } 
                );

                const robEmbed = new EmbedBuilder()
                    .setColor(0xFF0000) 
                    .setTitle('Robbery Successful!')
                    .setDescription(`You successfully robbed **$${amountStolen}** from ${targetUser.username}!`)
                    .setTimestamp()
                    .setFooter({ text: 'Watch your back!' });

                await interaction.reply({ embeds: [robEmbed] });
            } else {
                await interaction.reply({ content: `${targetUser.username} had no money to steal!`, ephemeral: true });
            }
        } else {
            const robEmbed = new EmbedBuilder()
                .setColor(0x00FF00) 
                .setTitle('Robbery Failed!')
                .setDescription(`You tried to rob ${targetUser.username}, but you failed!`)
                .setTimestamp()
                .setFooter({ text: 'Better luck next time!' });

            await interaction.reply({ embeds: [robEmbed] });
        }
    },
};
