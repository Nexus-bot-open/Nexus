const path = require("path");
const fs = require("fs");

const prefix = "n!";

module.exports = {
  name: "messageCreate",
  execute(message) {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();


    const commandPath = path.join(__dirname, "..", "prefix-commands", `${commandName}.js`);


    if (!fs.existsSync(commandPath)) return;


    const command = require(commandPath);
    
    try {
      
      if (typeof command.run === "function") {
        command.run(message, args);
      } else {
        console.error(`Command ${commandName} does not have a run method.`);
      }
    } catch (error) {
      console.error(error);
      message.reply("Unable to execute that command.");
    }
  }
};
