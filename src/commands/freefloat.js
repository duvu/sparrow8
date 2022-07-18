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
        let fullBody = '';
        for await (const data of catResult.body) {
            fullBody += data.toString();
        }
        fullBody = JSON.parse(fullBody)[0];
        return interaction.reply(`free-float of ${ticker}: ${fullBody.freeTransferRate}`);
    }
};
