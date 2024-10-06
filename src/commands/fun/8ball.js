const { SlashCommandBuilder } = require('discord.js');

const responses = [
    'Yes.',
    'No.',
    'Maybe.',
    'Definitely.',
    'I wouldn’t count on it.',
    'Absolutely!',
    'Ask again later.',
    'Very likely.',
    'Don’t count on it.',
    'It is certain.',
    'Outlook not so good.',
    'Yes, in due time.',
    'You may rely on it.',
    'As I see it, yes.',
    'My sources say no.',
    'Yes, definitely!',
    'Cannot predict now.'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question!'),

    async execute(interaction) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply(randomResponse);
    },
};
