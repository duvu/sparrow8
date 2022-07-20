const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken } = require('../../config.json');
const { request } = require('undici');

const index = new WebhookClient({ id: webhookId, token: webhookToken });
//https://discord.com/api/webhooks/934672704055951410/ixzZ0bhoKS6te-5ktoNYE4_rSq9lYk9QBj4_bD5CpH_kFGFtMQzRfjlAYHiMh1MJpURV

function strip(html){
    return html.replace(/(<([^>]+)>)/gi, "");
}

async function loadB3T() {
    const {
        statusCode,
        headers,
        trailers,
        body
    } = await request('https://app.x51.vn/api/me/b3tx8')

    let dataResp = '';
    for await (const data of body) {
        dataResp += data.toString();
    }

    const dataJson = JSON.parse(dataResp);

    if (dataJson.length > 0) {
        for (const b3t of dataJson) {
            const content = strip(b3t.content).substring( 0, str.indexOf( "———–" ) );
            if (content.length > 4096) {
                for (let i = 0; i < content.length; i+=4096) {
                    const b3tCt = content.slice(i, i+4096);
                    const embed = new MessageEmbed()
                        .setTitle(b3t.title)
                        .setDescription(b3tCt)
                        .setAuthor(b3t.source)
                        .setURL(b3t.link)
                        .setTimestamp(b3t.date)
                        .setColor('#0099ff');

                    if (i < content.length - 4096) {
                        embed.setFooter({text: 'Còn tiếp ...'});
                    }

                    await index.send({
                        // content: b3t.content,
                        username: 'B3T',
                        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                        embeds: [embed],
                    });
                }
            } else {
                const embed = new MessageEmbed()
                    .setTitle(b3t.title)
                    .setDescription(content)
                    .setAuthor(b3t.source)
                    .setURL(b3t.link)
                    .setTimestamp(b3t.date)
                    .setColor('#0099ff');

                await index.send({
                    // content: b3t.content,
                    username: 'X8.B3t',
                    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                    embeds: [embed],
                });
            }

        }
    }
}

setInterval(() => {
    loadB3T().then(r => console.log(r));
}, 600000); // 10 minutes = 10 * 60 * 1000
