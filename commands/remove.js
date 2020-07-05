// if (command === 'remove' && typeof value !== 'undefined') {
//     if (Object.exists(data, value)) {
//         const index = args[3] - 1;
//         if (typeof data[value][index] !== 'undefined') {
//             const item = data[value].splice(index, 1);
//             msg.reply(`Item ${item} was removed from ${value}`);
//             redisSetHandler('data', data);
//         }
//         else {
//             msg.reply('Index not found in group');
//         }
//     }
//     else {
//         msg.reply(`Group ${value} was not found`);
//     }
// }

const { redisSetHandler } = require('../models/redis');

function remove(args, data, value, msg) {
	if (Object.exists(data, value)) {
		const index = args[3] - 1;
		if (typeof data[value][index] !== 'undefined') {
			const item = data[value].splice(index, 1);
			msg.reply(`Item ${item} was removed from ${value}`);
			redisSetHandler('data', data);
		}
		else {
			msg.reply('Index not found in group');
		}
	}
	else {
		msg.reply(`Group ${value} was not found`);
	}
}

module.exports = remove;