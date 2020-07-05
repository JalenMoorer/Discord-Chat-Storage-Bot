// if (command === 'notification' && typeof value !== 'undefined') {
//     if (value === 'enable') {
//         await redisSetHandler('streamNotification', 'true');
//         msg.reply('Notfications enabled');
//     }
//     if (value === 'disable') {
//         await redisSetHandler('streamNotification', 'false');
//         msg.reply('Notfications disabled');
//     }
// }

const { redisSetHandler } = require('../models/redis');

async function notification(value, msg) {
	if (value === 'enable') {
		await redisSetHandler('streamNotification', 'true');
		msg.reply('Notfications enabled');
	}
	if (value === 'disable') {
		await redisSetHandler('streamNotification', 'false');
		msg.reply('Notfications disabled');
	}
}

module.exports = notification;