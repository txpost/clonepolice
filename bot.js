var Twit = require('twit'); 
var async = require('async');

// authentication for the Twitter API
var t = new Twit({
	consumer_key: 			process.env.BOT_CONSUMER_KEY,
	consumer_secret: 		process.env.BOT_CONSUMER_SECRET,
	access_token: 			process.env.BOT_ACCESS_TOKEN,
	access_token_secret: 	process.env.BOT_ACCESS_TOKEN_SECRET
});


// get today's date for query
getDate = function () {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	};
	if (mm < 10) {
		mm = '0' + mm;
	};
	today = yyyy + "-" + mm + "-" + dd;
	return today;
}



// get the most recent tweet that matches our query
getPublicTweet = function (cb) {
	var date = getDate();

	// "play 2048" since:2014-12-07 -from:GadgetInformer
	var query = '"play 2048" since:' + date + ' -from:GadgetInformer -from:BuzzzChomp';

	t.get('search/tweets', {q: query, count: 1}, function (err, data, response) {
		if (!err) {
			var botData = {
				baseTweet: data.statuses[0].text.toLowerCase(),
				tweetID: data.statuses[0].id_str,
				tweetUsername: data.statuses[0].user.screen_name
			};
			cb(null, botData);
		} else {
			console.log("There was an error getting a public Tweet. ABORT!");
			cb(err, botData);
		}
	});
}


// make sure '2048' is in the tweet rather than the date
verifyTweet = function (botData, cb) {
	var match2048 = botData.baseTweet.match(/2048/);
	if(match2048) {
		cb(null, botData);
	} else {
		console.log("It appears 2048 isn't in the text. Must be in the date. ABORT!");
		cb(err, botData);
	}
}


// compose the tweet
formatTweet = function (botData, cb) {
	var tweetUser = "@" + botData.tweetUsername;
	var tweet = "Hey " + tweetUser + "! Did you know 2048 is a clone of Threes? http://asherv.com/threes/threemails/";
	botData.tweetBlock = tweet;
	cb(null, botData);
}


// post the tweet
postTweet = function (botData, cb) {
	t.post('statuses/update', {status: botData.tweetBlock}, function (err, data, response) {
		cb(err, botData);
	});
}


// run each function in sequence
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


// run every three hours
setInterval(function () {
	try {
		run();
	}
	catch (e) {
		console.log(e);
	}
}, 60000 * 60 * 3);