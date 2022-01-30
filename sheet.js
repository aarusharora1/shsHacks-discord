const { google } = require("googleapis");
const fs = require("fs");
const { spreadsheetId } = require("./config.json");

async function fetch() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./shshacks-discord-sheets-cc4120d7a6c4.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Read rows from spreadsheet
  const getFirstName = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet2!A2:A",
  });
  const getLastName = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet2!B2:B",
  });
  const getDiscord = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet2!C2:C",
  });
  var fName = getFirstName.data.values;
  var lName = getLastName.data.values;
  var discordUsername = getDiscord.data.values;
  updateJSON(fName, lName, discordUsername);
}

function updateJSON(firstName, lastName, discordUsername) {
  const usernames = new Object();

  //loops through usernames pulled from spreadsheet
  //creates objects containing firstName and lastName
  //adds objects to usernames.json under a key containing the discord username
  for (var i = 0; i < firstName.length; i++) {
    let current = {
      firstName: firstName[i][0],
      lastName: lastName[i][0],
    };
    usernames[discordUsername[i][0]] = current;
  }

  //writes updated usernames to usernames.json file
  fs.writeFile("./usernames.json", JSON.stringify(usernames), (err) => {
    console.log("ERROR IN FILE WRITE!" + err);
  });
}

module.exports = { fetch };
