const http = require('http');

module.exports = {
    enabled: false,
    run: function(config, client, db) {
        const server = http.createServer((request, response) => {
            response.end("<html><head><meta http-equiv='refresh' content='0;URL=\"https://discordapp.com/oauth2/authorize?&client_id=" + botID + "&scope=bot&permissions=0\"' /></head></html>");
        });
        
        server.listen(config.port, (err) => {
            if (err) {
                return console.log('Failed to start bot authentication redirect server: ', err);
            }
        
            console.log(`Bot authentication redirect server is listening on ${config.port}`);
        });
    }
}