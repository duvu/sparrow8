const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('entry')
        .setDescription('Set entry for ticker')
        .addStringOption(ticker => ticker.setName('ticker').setRequired(true).setDescription('The ticker'))
        .addNumberOption(entry => entry.setName('entry').setRequired(true).setDescription('The entry.')),

    async execute(interaction) {
        let ticker = interaction.options.getString('ticker').toUpperCase();
        let entry = interaction.options.getNumber('entry');

        const role = interaction.member.roles.cache.find(r => r.name === "Captain");
        const user = await interaction.guild.members.fetch(interaction.user.id);
        console.log('User', interaction.user.tag);
        if (role) {
            // 1. update entry
            const opts = {
                body: `{\"manualEntry\": \"${entry}\", \"manualEntryBy\": \"${interaction.user.tag}\"}`,
                method: "PATCH",
                headers: {"content-type": "application/json"}
            };

            const catResult = await request(`https://app.x51.vn/api/me/watchlist/manual-entry/x8bot/${ticker}`, opts);
            let tickerInfos = '';
            for await (const data of catResult.body) {
                tickerInfos += data.toString();
            }
            console.log(tickerInfos);

            const msg = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Ticker: ${ticker} - Entry: ${entry}`)
                .setDescription(`Updated by ${user}`)
                .setTimestamp(new Date());
            return interaction.reply({embeds: [msg], ephemeral: true})
        } else {
            const msg = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Ticker: ${ticker} Entry: ${entry}`)
                .setDescription('You don\' have permission to do this.');
            return interaction.reply({embeds: [msg], ephemeral: true})
        }
    }
};
