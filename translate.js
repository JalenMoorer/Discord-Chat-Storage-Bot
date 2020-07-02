const puppeteer = require('puppeteer');
const { GOOGLE_ENGLISH_URL, GOOGLE_JAPANESE_URL } = require('./constants');
const translateEmbed = require('./translate.json');


async function browserScreenshot(url) {

	// 1. Launch the browser
	const browser = await puppeteer.launch({          
		 defaultViewport: {
			width: 1024,
			height: 768,
			isLandscape: true
		}}
	);
	// 2. Open a new page
	const page = await browser.newPage();

	// 3. Navigate to URL
	await page.goto(url);
	// 4. Take screenshot
	await page.screenshot({ path: 'screenshot.png' });
	await browser.close();
	console.log('Should log before browser image finishes');
}

async function translateText(command, query, msg, file) {
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
	translateEmbed.description = `${languages[startingLanguage]} text **${query}** translated into ${languages[targetLanguage]}`;
	translateEmbed.url = encodeURI(`${isEnglish && GOOGLE_ENGLISH_URL || GOOGLE_JAPANESE_URL}${query}`);

	await browserScreenshot(translateEmbed.url);
	console.log(translateEmbed);


	msg.channel.send({ files: [file], embed: translateEmbed });
}

module.exports = translateText;