const { redisSetHandler } = require('../models/redis');

function pop(data, value, msg) {
	if (Object.exists(data, value)) {
		data[value].pop();
		msg.reply(`Last entry of ${value} was removed`);
		redisSetHandler('data', data);
	}
}

module.exports = pop;