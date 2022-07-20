const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken } = require('../../config.json');

const { convert } = require('html-to-text');
const { request } = require('undici');

const index = new WebhookClient({ id: webhookId, token: webhookToken });
//https://discord.com/api/webhooks/934672704055951410/ixzZ0bhoKS6te-5ktoNYE4_rSq9lYk9QBj4_bD5CpH_kFGFtMQzRfjlAYHiMh1MJpURV
// https://discord.com/api/webhooks/999197746772856922/xS5fTU-W7BjOKSnWI2qW-vq4uBguIaae39Bl2LG0VbmlUmV_ZreW2SbTxEwIne_J1_RS

async function loadB3T() {
    console.log('...start X8.B3t');
    const {
        statusCode,
        headers,
        trailers,
        body
    } = await request('https://app.x51.vn/api/me/b3tx8');

    let dataResp = '';
    for await (const data of body) {
        dataResp += data.toString();
    }

    const dataJson = JSON.parse(dataResp);

    console.log('X8.B3t', dataJson.length);
    if (dataJson.length > 0) {
        for (const b3t of dataJson) {
            let content = convert(b3t.content);
            if (b3t.source === 'VND') {
                content = content.substring( 0, content.indexOf( "———–" ));
            } else if (b3t.source === 'CSI') {
                content = content.substring(0, content.indexOf("-----------------"))
            }

            if (content.length > 4096) {
                for (let i = 0; i < content.length; i+=4096) {
                    const b3tCt = content.slice(i, i+4096);
                    const shortenLink = encodeURI(b3t.link);
                    const embed = new MessageEmbed()
                        .setTitle(b3t.title)
                        .setDescription(b3tCt)
                        .setAuthor(b3t.source)
                        .setURL(shortenLink)
                        .setTimestamp(b3t.date)
                        .setColor('#0099ff');

                    if (i < content.length - 4096) {
                        embed.setFooter({text: 'Còn tiếp ...'});
                    }

                    await index.send({
                        // content: b3t.content,
                        username: 'X8.B3t',
                        avatarURL: 'https://bit.ly/3yOk5zM',
                        embeds: [embed],
                    });
                }
            } else {
                const shortenLink = encodeURI(b3t.link);
                const embed = new MessageEmbed()
                    .setTitle(b3t.title)
                    .setDescription(content)
                    .setAuthor(b3t.source)
                    .setURL(shortenLink)
                    .setTimestamp(b3t.date)
                    .setColor('#0099ff');

                await index.send({
                    username: 'X8.B3t',
                    avatarURL: 'https://bit.ly/3yOk5zM',
                    embeds: [embed],
                });
            }

        }
    }
}

setInterval(() => {
    loadB3T().then(r => console.log('message sent!'));
}, 600000); // 10 minutes = 10 * 60 * 1000
