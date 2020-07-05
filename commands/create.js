// if (command === 'create' && typeof value !== 'undefined') {
//     if (Object.exists(data, value)) {
//         msg.channel.send('Group already exists in the list');
//         return;
//     }
//     else {
//         data[value] = [];
//         msg.reply(`${value} group was added`);
//         redisSetHandler('data', data);
//     }
// }

const { redisSetHandler } = require('../models/redis.js');

function create(data, value, msg) {
	if (Object.exists(data, value)) {
		msg.channel.send('Group already exists in the list');
		return;
	}
	else {
		data[value] = [];
		msg.reply(`${value} group was added`);
		redisSetHandler('data', data);
	}
}

module.exports = create;