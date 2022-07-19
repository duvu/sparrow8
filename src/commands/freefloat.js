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
        console.log(tickerInfos);
        tickerInfos = JSON.parse(tickerInfos)[0];
        const taSignalText = tickerInfos.tcbsBuySellSignal ? tickerInfos.tcbsBuySellSignal['vi'] : '';
        const foreignText = tickerInfos.foreignTransaction ? tickerInfos.foreignTransaction['vi'] : '';
        const exchangeText = tickerInfos.exchangeName ? tickerInfos.exchangeName['vi'] : '';
        const industryText = tickerInfos.industryName ? tickerInfos.industryName['vi'] : '';

        const msgInfos = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Thông tin cổ phiếu: ${ticker} (${industryText} : ${exchangeText})`)
            .setDescription(`Free-float: ${tickerInfos.freeTransferRate}\n`)
            .addField("Chỉ số tài chính", `PE: ${tickerInfos.pe}, PB: ${tickerInfos.pb}, EPS: ${tickerInfos.eps}, ROE: ${tickerInfos.roe}\n Vốn hóa: ${tickerInfos.marketCap}`)
            .addField('Nhà đầu tư nước ngoài', `${foreignText}`)
            .addField('Tín hiệu kĩ thuật', `${taSignalText}`)
            .setTimestamp();

        return interaction.reply({ embeds: [msgInfos], components: [], ephemeral: false});
    }
};
