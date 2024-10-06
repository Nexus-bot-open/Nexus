const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild) {
        try {
           
            const fetchedGuild = await guild.client.guilds.fetch(guild.id);

            const logChannelId = process.env.JOIN_LOG; 
            const logChannel = await guild.client.channels.fetch(logChannelId);

            const joinEmbed = new EmbedBuilder()
                .setColor(0x800080) 
                .setTitle("Thanks for inviting Me!")
                .setDescription(`> Run \`/help\` for help and further information`)
                .setTimestamp();

            if (fetchedGuild.systemChannel) {
                await fetchedGuild.systemChannel.send({ embeds: [joinEmbed] });
            }

            const joinLogEmbed = new EmbedBuilder()
                .setColor(0x800080) 
                .setTitle("Nexus joined a new server!")
                .setDescription(`> **Guild Name:** \`${fetchedGuild.name}\`\n> **Guild ID:** \`${fetchedGuild.id}\`\n> **Member Count:** \`${fetchedGuild.memberCount}\`\n> **Owner:** <@${fetchedGuild.ownerId}>\n> **Created On:** ${fetchedGuild.createdAt.toDateString()}`)
                .setTimestamp();

            if (logChannel) {
                await logChannel.send({ embeds: [joinLogEmbed] });
            }
        } catch (error) {
            console.error("Error in guildCreate event:", error);
        }
    }
};
