require("dotenv").config();

const token = process.env.SLACK_BOT_TOKEN;
if (!token)
	throw new Error(
		"Need a slack bot token in env variable called SLACK_BOT_TOKEN",
	);
const appToken = process.env.SLACK_APP_TOKEN;
if (!appToken)
	throw new Error(
		"Need a slack bot app token in env variable called SLACK_APP_TOKEN",
	);
const signingSecret = process.env.SLACK_SIGNING_SECRET;
if (!signingSecret)
	throw new Error(
		"Need a slack signing secrete in env variable called SLACK_SIGNING_SECRET",
	);

const jokes = require("./jokes.json");

const { App } = require("@slack/bolt");
const app = new App({
	token,
	appToken,
	signingSecret,
	socketMode: true,
	scopes: ["chat:write"],
});

const url = "https://slackjokebot.edaz.codes/slaskjokebot/commands/joke";

function getRandomJoke() {
	return jokes[Math.floor(Math.random() * jokes.length)];
}

app.command("/joke", async (e) => {
	await e.ack();
	// console.log(e);
	const joke = getRandomJoke();
	await e.respond({
		text: `<@${e.body.user_id}> ${joke}`,
		response_type: "in_channel",
	});
});

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000);

	console.log("⚡️ Bolt app is running!");
})();
