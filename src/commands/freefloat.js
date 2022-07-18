const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freefloat')
        .setDescription('Getting free-float.')
        .addStringOption(option => option.setName('ticker').setDescription('The ticker to search for free-float')),

    async execute(interaction) {
        const ticker = interaction.options.getString('ticker').toUpperCase();

        const opts = {
            body: `{\"tickers\": [ \"${ticker}\" ]}`,
            method: "POST",
            headers: {"content-type": "application/json"}
        };

        const catResult = await request('https://app.x51.vn/api/ext/data-by-tickers', opts);
        let tickerInfos = '';
        for await (const data of catResult.body) {
            tickerInfos += data.toString();
        }
        tickerInfos = JSON.parse(tickerInfos)[0];

        const msgInfos = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Ticker Information: ${ticker}`)
            .setDescription(`Free-float: ${tickerInfos.freeTransferRate}\n`)
            .addField("FA", `PE: ${tickerInfos.pe}, PB: ${tickerInfos.pb}`)
            .setTimestamp();

        return interaction.reply({ embeds: [msgInfos], components: [], ephemeral: false});
    }
};
