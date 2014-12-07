var _ = require('lodash');
var Client = require('node-rest-client').Client;
var Twit = require('twit'); 
var async = require('async');
var wordFilter = require('wordfilter');

var t = new Twit({
	consumer_key: 			process.BOT_CONSUMER_KEY,
	consumer_secret: 		process.env.BOT_CONSUMER_SECRET,
	access_token: 			process.env.BOT_ACCESS_TOKEN,
	access_token_secret: 	process.env.BOT_ACCESS_TOKEN_SECRET
});

if (!SINCE_ID) {
	var SINCE_ID = 0;
};

run = function () {
	async.waterfall([
		getPublicTweet,
		verifyTweet,
		formatTweet,
		postTweet
	],
	function (err, botData) {
		if (err) {
			console.log("There was an error posting to Twitter: ", err);
		} else {
			console.log("Tweet successful!");
			console.log("Tweet: ", botData.tweetBlock);
		}
		console.log("Base tweet: ", botData.baseTweet);
	});
}

getPublicTweet = function (cb) {
	t.get('search/tweets', {q: '"play 2048"', count: 1, since_id: SINCE_ID}, function (err, data, response) {
		if (!err) {
			var botData = {
				baseTweet: data.statuses[0].text.toLowerCase(),
				tweetID: data.statuses[0].id_str,
				tweetUsername: data.statuses[0].user.screen_name
			};
			SINCE_ID = botData.tweetID;
			cb(null, botData);
		} else {
			console.log("There was an error getting a public Tweet. ABORT!");
			cb(err, botData);
		}
	});
}

// verifyTweet = function (botData, cb) {
// 	var match2048 = botData.baseTweet.match(/2048/);
// 	if(match2048) {
// 		cb(null, botData);
// 	} else {
// 		console.log("It appears 2048 isn't in the text. Must be in the date. ABORT!");
// 		cb(err, botData);
// 	}
// }

formatTweet = function (botData, cb) {
	var tweetUser = "@" + botData.tweetUsername;
	var tweet = tweetUser + "Did you know 2048 is a clone of Threes? http://asherv.com/threes/threemails/";
	botData.tweetBlock = tweet;
	cb(null, botData);
}

postTweet = function (botData, cb) {
	t.post('statuses/update', {status: botData.tweetBlock}, function (err, data, response) {
		cb(err, botData);
	});
}

setInterval(function () {
	try {
		run();
	}
	catch (e) {
		console.log(e);
	}
}, 60000 * 60);