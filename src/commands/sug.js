const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sug')
        .setDescription('Suggestions'),

    async execute(interaction) {
        const role = interaction.member.roles.cache.find(r => r.name === "Captain");
        const user = await interaction.guild.members.fetch(interaction.user.id);

        let page = 0;
        let infos = await this.getJson(page);
        if (infos) {
            infos = infos.rows;
        }

        // btn
        const filter = i => i.customId === 'next' || i.customId === 'prev';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000});
        collector.on('collect', async i => {
            if (i.customId === 'next') {
                page++;
            } else if (i.customId === 'prev') {
                if (page > 0) {
                    page--;
                }
            }
            console.log(`Page :${page}`);
            let infos = await this.getJson(page);
            if (infos) {
                infos = infos.rows;
            }
            if (infos.length > 0) {
                await this.suggest(i, infos, 'update');
            } else {
                await this.noSuggestion(i, 'update');
            }
        });
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));

        if (infos.length > 0) {
            await this.suggest(interaction, infos, 'reply');
        } else {
            await this.noSuggestion(interaction);
        }
    },

    async suggest(interaction, infos, replyOrUpdate = 'reply') {
        const msgs = [];
        for (const info of infos) {
            let title = '';
            if (info.target) {
                title = `Ticker: ${info.symbol} - Price: ${info.price} - Entry: ${info.manualEntry} - Target: ${info.target}`;
            } else {
                title = `Ticker: ${info.symbol} - Price: ${info.price} - Entry: ${info.manualEntry}`
            }

            const msg = new MessageEmbed()
                .setColor("#0099ff")
                .setURL(info.reportLink)
                .setTitle(title)
                .setFooter({text: `Updated by ${info.manualEntryBy} - Entry Age: ${info.entryAge} days`});

            if (info.notes) {
                msg.setDescription(`${info.notes}`)
            }
            msgs.push(msg);
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prev')
                    .setLabel('... Prev')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('Next ...')
                    .setStyle('PRIMARY')
            );

        if (replyOrUpdate === 'reply') {
            return interaction.reply({embeds: msgs, components: [row], ephemeral: false});
        } else {
            return interaction.update({embeds: msgs, components: [row], ephemeral: false})
        }
    },

    async noSuggestion(interaction, replyOrUpdate='reply') {
        const msg = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle('We don\'t have any suggestion for you!')
            .setDescription('We don\'t have any suggestion for you!')
            .setTimestamp(new Date());
        if (replyOrUpdate === 'reply') {
            return interaction.reply({embeds: [msg], components: [], ephemeral: true});
        } else {
            return interaction.update({embeds: [msg], components: [], ephemeral: true});
        }
    },


    async getJson(page) {
        const opts = {
            method: "GET",
            headers: {"content-type": "application/json"}
        };
        const result  = await request(`https://app.x51.vn/api/me/watchlist/x8bot?page=${page}`, opts);
        let infos = '';
        for await (const data of result.body) {
            infos += data.toString();
        }
        try {
            return JSON.parse(infos);
        } catch (e) {
            return undefined;
        }
    }
};
