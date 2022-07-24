const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('en5')
        .setDescription('Search for tickers that need to update entry'),

    async execute(interaction) {
        const role = interaction.member.roles.cache.find(r => r.name === "Captain");
        const user = await interaction.guild.members.fetch(interaction.user.id);
        console.log('User', interaction.user.tag);
        if (role) {
            const opts = {
                method: "GET",
                headers: {"content-type": "application/json"}
            };

            const result = await request(`https://app.x51.vn/api/me/query5x8bot`, opts);
            let contentBody = '';
            for await (const data of result.body) {
                contentBody += data.toString();
            }
            console.log(contentBody);
            contentBody = JSON.parse(contentBody);
            msgs = [];
            if (contentBody.length > 0) {
                for (let info of contentBody) {
                    const msg = new MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(`Ticker: ${info.ticker} - Entry: ${info.manual_entry}`)
                        .setDescription(`Updated by ${info.manual_entry_by} - Entry Age: ${info.entry_age} days`)
                        .setTimestamp(new Date());
                    msgs.push(msg);
                }
            } else {
                const msg = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`All tickers are updated!`)
                    .setDescription('All tickers are updated!');
                msgs.push(msg)
            }
            return interaction.reply({embeds: msgs, ephemeral: false})
        } else {
            const msg = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`You don\'t have permission to do this.`)
                .setDescription('You don\'t have permission to do this.');
            return interaction.reply({embeds: [msg], ephemeral: false})
        }
    }
};
