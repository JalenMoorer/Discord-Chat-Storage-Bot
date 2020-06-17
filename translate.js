const { GOOGLE_ENGLISH_URL, GOOGLE_JAPANESE_URL } = require('./constants');
const translateEmbed = require('./translate.json');


function translateText(command, query, msg) {
	const isEnglish = command === 'e!j';
	const languages = {
		sl: 'en',
		tl: 'ja',
		ja: 'Japanese',
		en: 'English',
	};

	const startingLanguage = isEnglish && languages.sl || languages.tl;
	const targetLanguage = isEnglish && languages.tl || languages.sl;

	translateEmbed.title = `Kano ${languages[startingLanguage]} to ${languages[targetLanguage]}`;	translateEmbed.url = encodeURI(`${isEnglish && GOOGLE_ENGLISH_URL || GOOGLE_JAPANESE_URL}${query}`);
	translateEmbed.description = `${languages[startingLanguage]} text **${query}** translated into ${languages[targetLanguage]}`;	translateEmbed.url = encodeURI(`${isEnglish && GOOGLE_ENGLISH_URL || GOOGLE_JAPANESE_URL}${query}`);

	msg.channel.send({ embed: translateEmbed });
}

module.exports = translateText;