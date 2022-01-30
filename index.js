const fs = require("fs");
const { Client, Intents } = require("discord.js");
const { token, verifiedRole } = require("./config.json");
const { fetch } = require("./sheet");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

async function verify(message) {
  const author = message.member;
  const authorUsername =
    message.author.username + `#` + message.author.discriminator;

  if (author.roles.cache.has(verifiedRole)) {
    message.channel.send("you are already verified!");
    return;
  }
  //console.log("dsfj");
  fetch();
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  const discordIDs = JSON.parse(fs.readFileSync("./usernames.json"));

  if (discordIDs.hasOwnProperty(authorUsername)) {
    console.log(discordIDs[authorUsername].firstName);
    const newNickname =
      discordIDs[authorUsername].firstName +
      ` ` +
      discordIDs[authorUsername].lastName;
    author.setNickname(newNickname);
    author.roles.add(verifiedRole).catch((err) => {
      message.channel.send(
        "We encountered an error while adding your 'verified' role...Here is an error code: " +
          err
      );
    });
  }

  if (author.roles.cache.has(verifiedRole)) {
    message.channel.send("verified successfully");
  } else {
    message.channel.send(
      "We encountered an issue with your verification. Please try again in a few minutes to allow for the verified user list to update."
    );
  }
}

client.once("ready", () => {
  console.log("i am ready!");
});
const prefix = "%";
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(/ + /);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "verify":
      verify(message);
      break;
    default:
      message.channel.send("ERROR: Unknown Command");
  }
});

client.login(token);
