exports.run = async (message, args) => {

    if (!args.length) {
        return message.reply('`!say`Says what you say!\n\n !say <context>');
    }

    const fixedMessage = args.join(' ').replace(/@/g, '');
    if (!fixedMessage) return message.reply('Pings aren\'t allowed for this command.');


    message.channel.send(fixedMessage);


    message.delete().catch(console.error);
};
