const embed = require('../embed/json/help.json');

function help(msg) { msg.channel.send({ embed }); }

module.exports = help;