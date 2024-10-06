const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(guild) {
        try {
            const logChannelId = process.env.LEAVE_LOG; 
            const logChannel = await guild.client.channels.fetch(logChannelId);

           
            const leaveLogEmbed = new EmbedBuilder()
                .setColor(0xFF0000) 
                .setTitle("Nexus has left a server!")
                .setDescription(`I was either kicked from or left **${guild.name}**\n\n**Owner:** <@${guild.ownerId}>\n**Guild ID:** \`${guild.id}\`\n**Member Count:** \`${guild.memberCount}\`\n**Created On:** ${guild.createdAt.toDateString()}`)
                .setTimestamp();

            if (logChannel) {
                await logChannel.send({ embeds: [leaveLogEmbed] });
            } else {
                console.log(`Nexus left server: ${guild.name} (ID: ${guild.id}), but the log channel was not found.`);
            }
        } catch (error) {
            console.error("Error in guildDelete event:", error);
        }
    }
};
