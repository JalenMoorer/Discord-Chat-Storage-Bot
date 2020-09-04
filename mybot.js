const Discord = require('discord.js');
const redis = require('redis');
const { prefix, token, textChannelIds } = require('./config.json');

const client = new Discord.Client();
const redisClient = redis.createClient();

const file = new Discord.MessageAttachment('screenshot.png');

const add = require('./commands/add');
const clear = require('./commands/clear');
const create = require('./commands/create');
const deletion = require('./commands/deletion');
const help = require('./commands/help');
const list = require('./commands/list');
const notification = require('./commands/notification');
const pop = require('./commands/pop');
const remove = require('./commands/remove');
const translate = require('./commands/translate');
const morph = require('./commands/morph');

const { redisGetHandler } = require('./models/redis');

Object.prototype.exists = function(obj, key) {
	return typeof obj[key] !== 'undefined';
};

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
	const value = args[2];

	if (chatPrefix !== prefix) {
		return;
	}

	let data = await redisGetHandler('data');
	data = JSON.parse(data);

	switch(command) {
	case 'create':
		create(data, value, msg);
		break;
	case 'add':
		add(args, data, value, msg);
		break;
	case 'list':
		list(data, value, msg);
		break;
	case 'pop':
		pop(data, value, msg);
		break;
	case 'clear':
		clear(data, value, msg);
		break;
	case 'delete':
		deletion(data, value, msg);
		break;
	case 'remove':
		remove(args, data, value, msg);
		break;
	case 'help':
		help(msg);
		break;
	case 'e!j':
	case 'j!e':
		translate(command, value, msg, file);
		break;
	case 'notification':
		notification(value, msg);
		break;
	case 'morph':
		morph(value, msg);
		break;
	default:
		break;
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
		const activity = game[0] || '';
		client.channels.fetch(textChannelId.id).then(channel => {
			if (game.length !== 0 && activity.name !== 'Custom Status') {
				channel.send(`@here ${user.username} is currently ${activity.type.toLowerCase()} ${activity.name}`);
			}
			else {
				channel.send(`@here ${user.username} is currently sharing their screen`);
			}
		});
	}
});

client.login(token);