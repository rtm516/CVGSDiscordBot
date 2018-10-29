const Discord = require('discord.js');
const sqlite3 = require("sqlite3");
const fs = require("fs");
require('./override-console-log.js');

const client = new Discord.Client();
const db = new sqlite3.Database("data.db");

function mix(source, target) {
   for(var key in source) {
     if (source.hasOwnProperty(key)) {
        target[key] = source[key];
     }
   }

}

const config_keys = require("./config-keys.js");

const config = {
	plugins: {},
	port: 8080,
	calendarID: "ouau6kktqmol6ian5pdhjusmig@group.calendar.google.com",
	calUpdateFreq: 1000 * 60 * 5,
	pluginsFolder: "./plugins/"
}

mix(config_keys, config);

client.on('ready', () => {
	console.log(`# Logged in as ${client.user.tag}`);
	
	//Load plugins
	console.log("# Loading plugins...");
	fs.readdirSync(config.pluginsFolder).forEach(file => {
		config.plugins[file] = require(config.pluginsFolder + file);
		if (config.plugins[file].enabled) {
			console.log("# Loaded '" + file + "'");
		}
	});

	console.log("# Initializing plugins...")
	Object.keys(config.plugins).forEach(pluginID => {
		if (config.plugins[pluginID].enabled) {
			config.plugins[pluginID].run(config, client, db);
		}
	});

	console.log("# Loaded and initialized plugins");
});

client.login(config.botToken);