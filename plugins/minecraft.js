const Discord = require("discord.js");
const Gamedig = require("gamedig");
const modern_rcon = require("modern-rcon");
const rcon = new modern_rcon("192.168.1.202", "*REMOVED*");
const { exec } = require('child_process');

module.exports = {
    enabled: false,
    run: function(config, client, db) {
        client.on('message', msg => {
            if (msg.content.startsWith("!whitelist ")) {
                if (!msg.member.hasPermission("MANAGE_GUILD")) { return; }

                var username = msg.content.substr("!whitelist ".length, msg.content.length);

                var embed = new Discord.RichEmbed();
                embed.setColor(0x00FF00);
                embed.setDescription("Adding username '" + username + "' to the whitelist");

                rcon.connect().then(() => {
                    rcon.send("whitelist add " + username);
                    rcon.send("whitelist reload");
                }).then(() => {
                    rcon.disconnect();
                });
                
                msg.channel.send(embed);
            }else if (msg.content.startsWith("!whitelistdel ")) {
                if (!msg.member.hasPermission("MANAGE_GUILD")) { return; }

                var username = msg.content.substr("!whitelistdel ".length, msg.content.length);

                var embed = new Discord.RichEmbed();
                embed.setColor(0x00FF00);
                embed.setDescription("Removing username '" + username + "' to the whitelist");

                rcon.connect().then(() => {
                    rcon.send("whitelist remove " + username);
                    rcon.send("whitelist reload");
                }).then(() => {
                    rcon.disconnect();
                });
                
                msg.channel.send(embed);
            }else if (msg.content === "!ftbinfo") {
                Gamedig.query({type: 'minecraft', host: '81.174.164.211'}, function(error, state) {
                    var embed = new Discord.RichEmbed();
                    var online = true;

                    if(error) {
                        embed.setColor(0xFF0000);
                        online = false;
                    }else{
                        embed.setColor(0x00FF00);
                    }

                    embed.setTitle("FTB server:");
                    
                    embed.addField("Status:", (online ? "Online" : "Offline"), true);
                    embed.addField("Players:", (state && state.raw.numplayers || 0) + "/" + (state && state.maxplayers || 0), true);
                    embed.addField("IP:", "81.174.164.211:25565", true);
                    embed.addField("Livemap:", "http://81.174.164.211:8123/", true);
                    embed.addField("FAQ:", "https://goo.gl/2Ct3rT", true);

                    msg.channel.send(embed);
                });
            }else if (msg.content === "!ftbstart") {
                if (!msg.member.hasPermission("MANAGE_GUILD")) { return; }

                exec('~/FTBInfinity.sh start', (err, stdout, stderr) => {
                    var embed = new Discord.RichEmbed();

                    if(stdout.indexOf("already running") > -1) {
                        embed.setColor(0xFF0000);

                        embed.setTitle("Server already running");
                        msg.channel.send(embed);

                        return;
                    }

                    if (err) {
                        embed.setColor(0xFF0000);

                        embed.setTitle("Failed to start server");
                        msg.channel.send(embed);

                        return;
                    }

    
                    embed.setColor(0x00FF00);

                    embed.setTitle("Sent server start command");

                    
                    msg.channel.send(embed);
                });
            }
        });
    }
}