const Discord = require('discord.js');
const { promisify } = require('util');
const redis = require('redis');
const translateText = require('./translate.js');
const { prefix, token, textChannelIds } = require('./config.json');
const helpEmbed = require('./help.json');

const client = new Discord.Client();
const redisClient = redis.createClient();

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const file = new Discord.MessageAttachment('screenshot.png');

Object.prototype.exists = function(obj, key) {
	return typeof obj[key] !== 'undefined';
};

function getEmbeddedGroup(data, group) {
	const groupTitle = group.toString();
	const embed = new Discord.MessageEmbed()
		.setTitle(groupTitle)
		.setColor(0x00AE86)
		.setDescription(`Information regarding the group ${groupTitle}`)
		.setTimestamp();
	data[group].forEach((item, i) => embed.addField(`# ${i + 1}`, item));
	return embed;
}

function getEmbeddedAllGroups(data) {
	const embed = new Discord.MessageEmbed()
		.setTitle('Kano Reminder Groups')
		.setColor(0x00AE86)
		.setDescription('Here are all the items that are currently stored within Kano')
		.setTimestamp();
	Object.keys(data).forEach((item, i) => embed.addField(`# ${i + 1}`, item));
	return embed;
}

async function redisGetHandler(key) {
	const res = await getAsync(key);
	return res;
}

async function redisSetHandler(key, value) {
	if (typeof value !== 'string') {
		value = JSON.stringify(value);
	}
	const res = await setAsync(key, value);
	return res;
}

client.on('ready', () => {
	client.user.setPresence({
		activity: { name: 'Ask Kano | kano' },
		status: 'Playing',
	});
});

redisClient.on('connect', function() {
	console.log('You are now connected');
});

client.on('message', async msg => {
	const args = msg.content.split(' ');
	const chatPrefix = args[0];
	const command = args[1];
	let value = args[2];

	if (chatPrefix !== prefix) {
		return;
	}

	let data = await redisGetHandler('data');
	data = JSON.parse(data);

	if (command === 'create' && typeof value !== 'undefined') {
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

	if (command === 'add' && typeof value !== 'undefined') {
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

	if (command === 'list') {
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

	if (command === 'pop' && typeof value !== 'undefined') {
		if(Object.exists(data, value)) {
			data[value].pop();
			msg.reply(`Last entry of ${value} was removed`);
			redisSetHandler('data', data);
		}
	}

	if (command === 'clear' && typeof value !== 'undefined') {
		if (Object.exists(data, value)) {
			data[value].length = 0;
			msg.reply(`Group ${value} was cleared of all it's entries`);
			redisSetHandler('data', data);
		}
		else {
			msg.channel.send(`Group ${value} was not found`);
		}
	}

	if (command === 'delete' && typeof value !== 'undefined') {
		if (Object.exists(data, value)) {
			delete data[value];
			msg.reply(`Group ${value} was removed`);
			redisSetHandler('data', data);
		}
		else {
			msg.reply(`Group ${value} was not found`);
		}
	}

	if (command === 'remove' && typeof value !== 'undefined') {
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

	if (command === 'help') {
		msg.channel.send({ embed: helpEmbed });
	}

	if ((command === 'e!j' || command === 'j!e') && typeof value !== 'undefined') {
		value = args.slice(2).join(' ');
		translateText(command, value, msg, file);
	}

	if (command === 'notification' && typeof value !== 'undefined') {
		if (value === 'enable') {
			await redisSetHandler('streamNotification', 'true');
			msg.reply('Notfications enabled');
		}
		if (value === 'disable') {
			await redisSetHandler('streamNotification', 'false');
			msg.reply('Notfications disabled');
		}
	}
});


client.on('voiceStateUpdate', async (oldState, newState) => {
	const isStreaming = await redisGetHandler('streamNotification');
	if (isStreaming === 'false') {
		return false;
	}
	const user = oldState.member.user;
	const game = oldState.member.presence.activities;
	const voiceChannelId = oldState.channelID;
	if (!oldState.streaming && newState.streaming) {
		// Find voice channel ID that matches from config to get text channel ID
		const textChannelId = textChannelIds.find(item => item.voiceId === voiceChannelId);
		client.channels.fetch(textChannelId.id).then(channel => {
			if (game.length !== 0) {
				const activity = game[0];
				channel.send(`@here ${user.username} is currently ${activity.type.toLowerCase()} ${activity.name}`);
			}
			else {
				channel.send(`@here ${user.username} is currently sharing their screen`);
			}
		});
	}
});

client.login(token);
// TODO
// Loop through items that contains a hyperlink expression and posts them (or every item);
// Add character limit for each item on the list
// Refactor Code