const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the help menu with various command categories.'),
    async execute(interaction) {
    
        const helpEmbed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('Choose a category below to see its commands.')
            .setColor('Blue');

       
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('admin')
                    .setLabel('Admin')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('bot-info')
                    .setLabel('Bot Info')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('economy')
                    .setLabel('Economy')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('fun')
                    .setLabel('Fun')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('support')
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Primary)
            );

      
        await interaction.reply({ embeds: [helpEmbed], components: [row], ephemeral: false });

        
        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "You can't interact with this help menu!", ephemeral: true });
            }

            
            let categoryEmbed;
            switch (i.customId) {
                case 'admin':
                    categoryEmbed = new EmbedBuilder()
                        .setTitle('Admin Commands')
                        .setDescription('Here are the available admin commands:')
                        .addFields(
                            { name: '/ban', value: 'Ban a user from the server.' },
                            { name: '/unban', value: 'UnBan a user from the server.' },
                            { name: '/timeout', value: 'Temporarily mute a user.' },
                            { name: '/untimeout', value: 'Removes a users timeout.' },
                        )
                        .setColor('Red');
                    break;
                case 'bot-info':
                    categoryEmbed = new EmbedBuilder()
                        .setTitle('Bot Info Commands')
                        .setDescription('Here are the available bot information commands:')
                        .addFields(
                            { name: '/ping', value: 'Shows the bots ping.' },
                            { name: '/uptime', value: 'Shows how long the bot has been running.' }
                        )
                        .setColor('Purple');
                    break;
                case 'economy':
                    categoryEmbed = new EmbedBuilder()
                        .setTitle('Economy Commands')
                        .setDescription('Here are the available economy commands:')
                        .addFields(
                            { name: '/balance', value: 'Check your balance.' },
                            { name: '/pay', value: 'Transfer currency to another user.' },
                            { name: '/daily', value: 'Collects Your Daily Reward.' },
                            { name: '/weekly', value: 'Collects Your Weekly Balance.' },
                            { name: '/monthly', value: 'Collects Your Monthly Balance.' },
                            { name: '/deposit', value: 'Deposits money into your bank.' },
                            { name: '/withdraw', value: 'Takes money out of your bank.' },
                            { name: '/leaderboard', value: 'Displays top 10 users with the most money.' },
                            { name: '/rob', value: 'Robs another user.' },
                            { name: '/work', value: 'Work random jobs to earn money' },
                            { name: '/blackjack', value: 'Gambling?' },
                        )
                        .setColor('Green');
                    break;
                case 'fun':
                    categoryEmbed = new EmbedBuilder()
                        .setTitle('Fun Commands')
                        .setDescription('Here are the available fun commands:')
                        .addFields(
                            { name: '/8ball', value: 'Sends a 8ball response to your question.' },
                            { name: '/joke', value: 'Tell a random joke.' }
                        )
                        .setColor('Yellow');
                    break;
                case 'support':
                    categoryEmbed = new EmbedBuilder()
                        .setTitle('Support Commands')
                        .setDescription('Here are the available support commands:')
                        .addFields(
                            { name: '/help', value: 'Displays the help menu.' },
                            { name: '/invite', value: 'Invite the bot to your server.' }
                        )
                        .setColor('Blue');
                    break;
                default:
                    break;
            }

           
            await i.update({ embeds: [categoryEmbed], components: [row] });
        });

        
        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('admin')
                        .setLabel('Admin')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('bot-info')
                        .setLabel('Bot Info')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('economy')
                        .setLabel('Economy')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('fun')
                        .setLabel('Fun')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('support')
                        .setLabel('Support')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );

            await interaction.editReply({ components: [disabledRow] });
        });
    },
};
