const Discord = require('discord.js');

module.exports.getEmbeddedGroup = function getEmbeddedGroup(data, group) {
	const groupTitle = group.toString();
	const embed = new Discord.MessageEmbed()
		.setTitle(groupTitle)
		.setColor(0x00AE86)
		.setDescription(`Information regarding the group ${groupTitle}`)
		.setTimestamp();
	data[group].forEach((item, i) => embed.addField(`# ${i + 1}`, item));
	return embed;
};

module.exports.getEmbeddedAllGroups = function getEmbeddedAllGroups(data) {
	const embed = new Discord.MessageEmbed()
		.setTitle('Kano Reminder Groups')
		.setColor(0x00AE86)
		.setDescription('Here are all the items that are currently stored within Kano')
		.setTimestamp();
	Object.keys(data).forEach((item, i) => embed.addField(`# ${i + 1}`, item));
	return embed;
};