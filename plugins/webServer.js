const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const request = require("request");
const fs = require("fs");

module.exports = {
    enabled: true,
    run: function(config, client, db) {
        const app = express()
        app.use(bodyParser.json());

        app.get('/add', (req, res) => {
            res.end("<html><head><meta http-equiv='refresh' content='0;URL=\"https://discordapp.com/oauth2/authorize?&client_id=" + config.botID + "&scope=bot&permissions=0\"' /></head></html>");
        });

        app.post('/hook', (req, res) => {            
            bodyJSON = req.body;
            var authorImage = "";

            request({url: "https://www.reddit.com/user/" + bodyJSON.author + "/about.json"}, function (redditError, redditRes, redditBody) {
                if (redditError) {
                    authorImage = "https://i.imgur.com/Z1DQVmy.png";
                }else{
                    try {
                        authorImage = JSON.parse(redditBody).data.icon_img.split("?")[0];
                    }
                    catch (ex) {
                        authorImage = "https://i.imgur.com/Z1DQVmy.png";
                    }
                }

                var embed = new Discord.RichEmbed();
                embed.setColor(0xFF4500);
                embed.setThumbnail(bodyJSON.image);
                embed.setTitle(bodyJSON.title);
                embed.setAuthor(bodyJSON.author + " via r/" + bodyJSON.subreddit, authorImage, "https://www.reddit.com/user/" + bodyJSON.author);
                embed.setDescription(bodyJSON.post);
                embed.setURL(bodyJSON.content);

                client.channels.get(bodyJSON.channelID).send(embed);
            });

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Received');
        });

        app.listen(config.port, () => console.log(`Web server listening on port ${config.port}`))

        client.on('message', msg => {
            if (msg.content == "!cid") {
                msg.channel.send(msg.channel.id);
            }
        });
    }
}