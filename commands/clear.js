// if (command === 'clear' && typeof value !== 'undefined') {
//     if (Object.exists(data, value)) {
//         data[value].length = 0;
//         msg.reply(`Group ${value} was cleared of all it's entries`);
//         redisSetHandler('data', data);
//     }
//     else {
//         msg.channel.send(`Group ${value} was not found`);
//     }
// }

const { redisSetHandler } = require('../models/redis');

function clear(data, value, msg) {
	if (Object.exists(data, value)) {
		data[value].length = 0;
		msg.reply(`Group ${value} was cleared of all it's entries`);
		redisSetHandler('data', data);
	}
	else {
		msg.channel.send(`Group ${value} was not found`);
	}
}

module.exports = clear;