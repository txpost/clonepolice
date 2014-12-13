# Clone Police

Clone Police is a twitter bot that patrols for tweets that "play 2048" and let's the user know that 2048 is a clone of [Threes](http://t.co/dspX6iSTnC).

## Join the Clone Police

[Agent Copycat](https://twitter.com/clonepolice) is the founding member of the Clone Police. You can get in on the fun too!

You'll need to create a Twitter account for your bot, create a Twitter app, get some api_keys, and edit your query to whatever you want to patrol for. If you need help, [this](http://ursooperduper.github.io/2014/10/27/twitter-bot-with-node-js-part-1.html) is an excellent tutorial.

Agent Copycat uses the query `var query = '"play 2048" since:' + date + ' -from:GadgetInformer';`, where `date` is today's date.

Now get out there and give those creators the credit they deserve!