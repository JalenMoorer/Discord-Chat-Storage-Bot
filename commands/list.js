// if (command === 'list') {
//     if (Object.keys(data).length === 0) {
//         msg.channel.send('No items in the list to send');
//         return;
//     }
//     if (typeof value !== 'undefined') {
//         if (Object.exists(data, value)) {
//             const embed = getEmbeddedGroup(data, value);
//             msg.channel.send({ embed });
//         }
//         else {
//             msg.channel.send(`Group ${value} was not found on the list`);
//             return;
//         }
//     }
//     else {
//         const embed = getEmbeddedAllGroups(data);
//         msg.channel.send({ embed });
//     }
// }

const { getEmbeddedGroup, getEmbeddedAllGroups } = require('../embed/embed');


function list(data, value, msg) {
	if (Object.keys(data).length === 0) {
		msg.channel.send('No items in the list to send');
		return;
	}
	if (typeof value !== 'undefined') {
		if (Object.exists(data, value)) {
			const embed = getEmbeddedGroup(data, value);
			msg.channel.send({ embed });
		}
		else {
			msg.channel.send(`Group ${value} was not found on the list`);
			return;
		}
	}
	else {
		const embed = getEmbeddedAllGroups(data);
		msg.channel.send({ embed });
	}
}

module.exports = list;