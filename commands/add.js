const { redisSetHandler } = require('../models/redis');

function add(args, data, value, msg) {
	if (!Object.exists(data, value) || args.length < 4) {
		msg.channel.send(`Group ${value} was not found or value was not provided`);
		return;
	}
	else {
		const group = value;
		value = args.slice(3).join(' ');
		data[group].push(value);
		msg.reply(`${value} was added to the list`);
		redisSetHandler('data', data);
	}
}

module.exports = add;