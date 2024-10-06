const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");


const maxAmountOfTickets = 2
const usersTickets = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {

            if (interaction.customId === "ticket-setup") {

                const tickets = usersTickets.get(interaction.user.id)

                if (tickets >= maxAmountOfTickets) {
                    return interaction.reply({content: "You have reached the maximum amount of tickets!", ephemeral: true})
                }

                usersTickets.set(interaction.user.id, tickets + 1)

                await interaction.reply({content: "Creating a ticket...", ephemeral: true});

                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
                    type: 0,
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        }
                    ]
                })

                const embed = new EmbedBuilder()
                    .setTitle("Please wait for support")
                    .setDescription("We will respond to your ticket as soon as possible")
                    .addFields(
                        { name: "Ticket ID", value: `#${ticketChannel.name}` },
                    )
                    .setTimestamp()
                    
                await ticketChannel.send({embeds: [embed]})

            }
        }
    }
}