const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's latency."),
  async execute(interaction) {
    const startTime = Date.now();
    const embed1 = new EmbedBuilder()
      .setColor("Yellow")
      .setAuthor({ name: "Nexus Ping"  })
      .setDescription("Calculating Ping...");

    await interaction.reply({ embeds: [embed1] });

    const endTime = Date.now();
    const ping = endTime - startTime;

    const embed2 = new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: "Nexus Ping" })
      .setDescription(
        `**Ping:** \`${interaction.client.ws.ping}ms\`\n**Response Time:** \`${ping}ms\``
      );

    return await interaction.editReply({ embeds: [embed2] });
  },
};
