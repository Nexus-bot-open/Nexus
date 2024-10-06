const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserEconomy = require('../../models/UserEconomy');

const jobs = [
    'cashier',
    'waiter',
    'developer',
    'graphic designer',
    'delivery driver',
    'teacher',
    'data analyst',
    'researcher',
    'mechanic',
    'artist',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Earn money by working a random job!'),
    async execute(interaction) {
        const userId = interaction.user.id;

        const earnedAmount = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

        
        await UserEconomy.updateOne(
            { userId },
            { $inc: { balance: earnedAmount } },
            { upsert: true } 
        );

        
        const workEmbed = new EmbedBuilder()
            .setColor(0x007BFF) 
            .setTitle('Work Results')
            .setDescription(`You worked as a **${randomJob}** and earned **$${earnedAmount}**!`)
            .setTimestamp()
            .setFooter({ text: 'Keep working hard!' });

        await interaction.reply({ embeds: [workEmbed] });
    },
};
