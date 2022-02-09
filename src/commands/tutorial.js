const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDefaultPermission(true)
        .setDescription('Start the tutorial of the bot!'),
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

            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));


        await interaction.reply({ embeds: [tutorialMessage], components: [btnReplay], ephemeral: true});
    },
};
