/* eslint-disable indent */
const axios = require('axios');
const morphEmbed = require('../embed/json/morph.json');

const state = {
    counter: 0,
    isReacting: false,
};
let editMorph = [];

async function morph(value, msg) {
    console.log('Previous', editMorph);
	//console.log(value);
	if(!value) {
		msg.reply('Please enter Japanese text');
	}
	else {
        editMorph.length = 0;
        state.counter = 0;
        state.isReacting = false;
        const japaneseObject = await mecabFetch(value);

        //console.log('Japanese Object', japaneseObject);
        japaneseObject.forEach((object, i) => {
            const newMorphEmbed = { color: morphEmbed.color, footer: { ...morphEmbed.footer } };
            newMorphEmbed.fields = morphEmbed.fields.map(a => ({ ...a }));
            //console.log(object, i);
            const { grammarObject } = object;
            newMorphEmbed.title = object.word;
            newMorphEmbed.fields[0].value = `${grammarObject.partOfSpeech}  
            ${grammarObject.firstPartofSpeech}    
            ${grammarObject.secondPartofSpeech}
            ${grammarObject.thirdPartofSpeech}`;
            newMorphEmbed.fields[1].value = grammarObject.conjugatedForm;
            newMorphEmbed.fields[2].value = grammarObject.additionalConjugatedForm;
            newMorphEmbed.fields[3].value = grammarObject.baseForm;
            newMorphEmbed.fields[4].value = grammarObject.reading;
            newMorphEmbed.fields[5].value = grammarObject.reading;
            newMorphEmbed.url = `https://jisho.org/search/${object.word}`;
            newMorphEmbed.footer.text = `Word ${i + 1} out of ${japaneseObject.length}`;
            editMorph.push(newMorphEmbed);
        });
        console.log('NEW');

        const emojis = ['⬅️', '➡️'];

       msg.channel.send({ embed: editMorph[0] }).then(async (sentEmbed) => {
           const embedId = sentEmbed.id;
            await sentEmbed.react(emojis[0]);
            await sentEmbed.react(emojis[1]);
            const filter = (reaction, user) => {
                console.log('fired');
                console.log(reaction.emoji.name, user.id, msg.author.id);
                console.log(emojis.includes(reaction.emoji.name));
                emojis.includes(reaction.emoji.name) && user.id !== msg.author.id;
            };

            const newFilter = (reaction) => reaction.emoji.name === emojis[0] || reaction.emoji.name === emojis[1];

            const collector = sentEmbed.createReactionCollector(newFilter, { dispose: true });
            collector.on('collect', r => editEmbed(sentEmbed, r.emoji.name, emojis));
            collector.on('remove', r => editEmbed(sentEmbed, r.emoji.name, emojis));
        });
    }
}

async function mecabFetch(sentence) {
	const route = `http://localhost:4000/api/v1/morph?sentence=${sentence}`;
    try {
        const response = await axios.get(encodeURI(route));
        const { data } = response;
        if (data.length > 30) {
			data.length = 30;
        }
        console.log('Request done');
        return data;
    }
    catch (Error) {
        console.error(Error);
    }
}

function editEmbed(msg, reaction, emojis) {
    const { isReacting } = state;
    console.log('counter', state.counter);
    if (!isReacting) {
        state.isReacting = true;
        return;
    }
    if (reaction === emojis[1]) {
        if (state.counter < editMorph.length - 1) {
            state.counter++;
            console.log('cuck', reaction, state.counter);
            msg.edit({ embed: editMorph[state.counter] });
        }
    }
    if (reaction === emojis[0]) {
        if (state.counter > 0) {
            state.counter--;
            console.log('duck', reaction, state.counter);
            msg.edit({ embed: editMorph[state.counter] });
        }
    }
}

module.exports = morph;