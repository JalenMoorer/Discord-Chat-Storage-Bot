// if (command === 'help') {
//     msg.channel.send({ embed: helpEmbed });
// }

const embed = require('../embed/json/help.json');

function help(msg) { msg.channel.send({ embed }); }

module.exports = help;