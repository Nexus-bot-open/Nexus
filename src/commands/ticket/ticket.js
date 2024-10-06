const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js'); 
const {ms} = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('ticket feature')

        .addSubcommand(subcommand => subcommand 
            .setName('setup')
            .setDescription('setup a ticket')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to create the ticket in')
                .setRequired(true)),

            )

        .addSubcommand(subcommand => subcommand
            .setName('close')
            .setDescription('close a ticket')
        )

        .addSubcommand(subcommand => subcommand
            .setName('add-user')
            .setDescription('add a user to a ticket')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to add to the ticket')
                .setRequired(true))
        )

        .addSubcommand(subcommand => subcommand
            .setName('remove-user')
            .setDescription('remove a user from a ticket')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to remove from the ticket')
                .setRequired(true))
        )

        .addSubcommand(subcommand => subcommand
            .setName('add-role')
            .setDescription('add a role to a ticket')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role to add to the ticket')
                .setRequired(true))
        )

        .addSubcommand(subcommand => subcommand
            .setName('remove-role')
            .setDescription('remove a role from a ticket')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role to remove from the ticket')
                .setRequired(true))
        ),


        async execute(interaction) {
            const subcommand = interaction.options.getSubcommand();
            const permission = interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);


            if (!permission) {
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            if (subcommand === 'setup') {
                const channel = interaction.options.getChannel('channel');

                if (!channel.isTextBased()) {
                    return interaction.reply({ content: 'The channel must be a text-based channel.', ephemeral: true });
                }

                const modal = new ModalBuilder()
                    .setCustomId('ticket-setup')
                    .setTitle('Ticket Setup')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('title')
                                .setLabel('Title')
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),

                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('description')
                                .setLabel('Description')
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        ),
                    );

                await interaction.showModal(modal);

                const modalSubmit = await interaction.awaitModalSubmit({
                    filter: m => m.customId === 'ticket-setup' && m.user.id === interaction.user.id,
                    time: ms('10m')
                });
                
                if (modalSubmit) {
                    const title = modalSubmit.fields.getTextInputValue('title');
                    const description = modalSubmit.fields.getTextInputValue('description');

                    const embed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(description)
                        .setColor('Random')

                    const button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('open-ticket')
                            .setLabel('Open A Ticket')
                            .setStyle(ButtonStyle.Success)
                    );
                    
                    await channel.send({ embeds: [embed], components: [button] });

                    await modalSubmit.reply({ content: 'Ticket created!', ephemeral: true });
                }
            }

            else if (subcommand === 'close') {
                const channel = interaction.channel;

                if (channel.startsWith("ticket-")) {
                    await interaction.reply({ content: 'This ticket will be closing in 10 seconds', ephemeral: true });

                    setTimeout(async () => {
                        await channel.delete();
                    }, 10000);
                    return
                }
                else {
                    await interaction.reply({ content: 'This is not a ticket channel', ephemeral: true });
                    return
                }
            }

            else if (subcommand === 'add-user') {
                const user = interaction.options.getUser('user');
                const channel = interaction.channel;

                if (channel.startsWith("ticket-")) {
                    await channel.permissionOverwrites.create(user, { ViewChannel: true, SendMessages: true });
                    
                    await interaction.reply({ content: 'User added to ticket', ephemeral: true });
                    return
                }
                else {
                    await interaction.reply({ content: 'This is not a ticket channel', ephemeral: true });
                    return
                }
            }

            else if (subcommand === 'remove-user') {
                const user = interaction.options.getUser('user');
                const channel = interaction.channel;

                if (channel.startsWith("ticket-")) {
                    await channel.permissionOverwrites.delete(user);
                    
                    await interaction.reply({ content: 'User removed from ticket', ephemeral: true });
                    return
                }
                else {
                    await interaction.reply({ content: 'This is not a ticket channel', ephemeral: true });
                    return
                }
            }

            else if (subcommand === 'add-role') {
                const role = interaction.options.getRole('role');
                const channel = interaction.channel;

                if (channel.startsWith("ticket-")) {
                    await channel.permissionOverwrites.create(role, { ViewChannel: true, SendMessages: true });
                    
                    await interaction.reply({ content: 'Role added to ticket', ephemeral: true });
                    return
                }
                else {
                    await interaction.reply({ content: 'This is not a ticket channel', ephemeral: true });
                    return
                }
            }

            else if (subcommand === 'remove-role') {
                const role = interaction.options.getRole('role');
                const channel = interaction.channel;

                if (channel.startsWith("ticket-")) {
                    await channel.permissionOverwrites.delete(role);
                    
                    await interaction.reply({ content: 'Role removed from ticket', ephemeral: true });
                    return
                }
                else {
                    await interaction.reply({ content: 'This is not a ticket channel', ephemeral: true });
                    return
                }
            }
        }
}