# Call of the Ancients

This is my entry for Ludum Dare 36.

![preview image](http://i.imgur.com/bp0Pok9.png)

## Deploying yourself

These are the steps you'd have to take to deploy this yourself on Heroku:

1. Create an app in Heroku
2. Get a number in Twilio.  Then, set its programmable voice callback to POST to `YOUR_HEROKU_URL/voice/`.
3. Change the number in the application to whatever your Twilio number is (it's only used in webpages in `/public`, not in the nodejs code)
4. Provision a mLab instance to your Heroku app
5. Deploy to Heroku with the Heroku toolbelt
6. It should just work at this point

## Tools used:

Services:

* Twilio
* Heroku
* mLab
* Youtube

Libraries:

* jQuery
* Twitter Bootstrap
* Lodash
* (see `package.json` for the rest)

Tools:

* c9.io
* Ableton Live for music
* git

[This is the original code that I forked](https://www.twilio.com/docs/howto/walkthrough/automated-survey/node/express) for handling phone calls and project setup.  It's been heavily modified and is meant for automated phone surveys.

## LICENSE

MIT