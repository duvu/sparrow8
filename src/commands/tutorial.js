const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { webhookId, webhookToken } = require('../../config.json');
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Start the tutorial of the bot!')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
    async execute(interaction) {

        const italicNotes = italic('You will not receive any rewards for replaying the tutorial.');
        const tutorialMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('You have already completed the tutorial')
            .setDescription('You have already completed the tutorial at least one before, would you like to replay through it again?\n' + italicNotes)
            .setTimestamp();

        const msgIntro = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Albert Einstein')
            .setDescription('Greetings ' + interaction.user.tag + '\n\nMy name is Albert ...' + italicNotes)
            .setTimestamp();

        const msgAccepted = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Albert Einstein')
            .setDescription('Thanks so much!\n\n Start exploring with your Clockie bot using ```r!expedition!```')
            .setImage('https://i8.ae/QpVMA')
            .setTimestamp();

        const msgExpedition = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Checking Expedition Status')
            .setDescription('```Expedition status```')

        const msgVisitAcademy = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Visit Academy')
            .setDescription('```Visit Academy contents```')

        const msgStartExpedition = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Start Expedition')
            .setDescription('```Start Expedition Contents```')

        const msgEventsTimeEnd = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Event TimeEnd')
            .setDescription('```Event TimeEnd```')

        const btnReplay = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('replay_tutorial')
                    .setLabel('Replay Tutorial')
                    .setStyle('PRIMARY'),
            );

        const btnAcceptDecline = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle('PRIMARY'),
            ).addComponents(
                new MessageButton()
                    .setCustomId('decline')
                    .setLabel('Decline')
                    .setStyle('PRIMARY'),
            );

        const btnExpedition = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('r_expedition').setLabel('r!expedition').setStyle('PRIMARY')
        );

        const btnVisitAcademy = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('visit_academy').setLabel('Visit Academy').setStyle('PRIMARY')
        );

        const btnExpeditionInventoryArtifact = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('start_expedition')
                    .setLabel('Start Expedition')
                    .setStyle('PRIMARY'),
            ).addComponents(
                new MessageButton()
                    .setCustomId('clockie_inventory')
                    .setLabel('Clockie Inventory')
                    .setStyle('PRIMARY'),
            ).addComponents(
                new MessageButton()
                    .setCustomId('artifacts')
                    .setLabel('Artifacts')
                    .setStyle('PRIMARY'),
            );

        const btnExit = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('exit').setLabel('Exit').setStyle('DANGER')
        );

        const menuSelect = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Time End',
                            description: '',
                            value: 'time_end',
                        },
                        {
                            label: 'The syphon COMING SOON',
                            description: '',
                            value: 'the_syphon_coming_soon',
                        },
                        {
                            label: 'Paradox Forge COMING SOON',
                            description: '',
                            value: 'paradox_forge_coming_soon',
                        },
                        {
                            label: 'Planet Burner COMING SOON',
                            description: '',
                            value: 'planet_burner_coming_soon',
                        },
                    ]),
            );


        // -- button
        const boldTutMess = bold('Tutorial [' + interaction.user.tag + ']');
        const btnFilter = i => i.customId === 'replay_tutorial';
        const collector = interaction.channel.createMessageComponentCollector({ btnFilter, time: 15000 });
        collector.on('collect', async i => {
            if (i.customId === 'replay_tutorial') {
                await i.update({ content: boldTutMess, embeds: [msgIntro], components: [btnAcceptDecline] });
            } else if (i.customId === 'accept') {
                await i.update({ content: boldTutMess, embeds: [msgAccepted], components: [btnExpedition] });
            } else if (i.customId === 'r_expedition') {
                await i.update({content: boldTutMess, embeds: [msgExpedition], components: [btnVisitAcademy]});
            } else if (i.customId === 'visit_academy') {
                await i.update({content: boldTutMess, embeds: [msgVisitAcademy], components: [btnExpeditionInventoryArtifact]});
            } else if (i.customId === 'start_expedition') {
                await i.update({content: boldTutMess, embeds: [msgStartExpedition], components: [menuSelect, btnExit]});
            } else if (i.customId === 'select') {
                if (i.values[0] === 'time_end') {
                    await i.update({ content: 'TimeEnd was selected!', components: [] });

                    const time_end_selected = {
                        content: 'User xyz has began its adventure into Time\' End',
                        avatarURL: 'https://i8.ae/OuCQM',
                        embeds: [msgEventsTimeEnd],
                    };
                    await webhookClient.send(time_end_selected);

                    const user = interaction.options.getUser('target');
                    if (user) {
                        user.send('TimeEnd was selected!!!');
                    } else {
                        interaction.user.send('TimeEnd was selected!!!')
                    }

                }
            } else {
                console.log(i.values)
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));


        await interaction.reply({ embeds: [tutorialMessage], components: [btnReplay], ephemeral: true});
    },
};
