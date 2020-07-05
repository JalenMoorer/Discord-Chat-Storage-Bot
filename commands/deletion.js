// if (command === 'delete' && typeof value !== 'undefined') {
//     if (Object.exists(data, value)) {
//         delete data[value];
//         msg.reply(`Group ${value} was removed`);
//         redisSetHandler('data', data);
//     }
//     else {
//         msg.reply(`Group ${value} was not found`);
//     }
// }

const { redisSetHandler } = require('../models/redis');

function deletion(data, value, msg) {
	if (Object.exists(data, value)) {
		delete data[value];
		msg.reply(`Group ${value} was removed`);
		redisSetHandler('data', data);
	}
	else {
		msg.reply(`Group ${value} was not found`);
	}
}

module.exports = deletion;