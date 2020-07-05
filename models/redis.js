const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient();

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);


module.exports.redisGetHandler = async function redisGetHandler(key) {
	const res = await getAsync(key);
	return res;
};

module.exports.redisSetHandler = async function redisSetHandler(key, value) {
	if (typeof value !== 'string') {
		value = JSON.stringify(value);
	}
	const res = await setAsync(key, value);
	return res;
};