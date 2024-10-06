// src/index.js
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const commandPath = path.join(__dirname, "commands");
const eventsPath = path.join(__dirname, "events");
const token = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration
    ]
});

client.commands = new Collection();


const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    const execute = (...args) => event.execute(...args, client);
    if (event.once) {
        client.once(event.name, execute);
    } else {
        client.on(event.name, execute);
    }
}


const commandFiles = fs.readdirSync(commandPath, { withFileTypes: true });
for (const dir of commandFiles) {
    if (dir.isDirectory()) {
        const subDirFiles = fs.readdirSync(path.join(commandPath, dir.name)).filter(file => file.endsWith('.js'));
        for (const file of subDirFiles) {
            const command = require(path.join(commandPath, dir.name, file)); 
            if (command.data && command.data.name) {
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`); 
            } else {
                console.error(`[ERROR] >>> Invalid data structure in command file: ${file}`);
            }
        }
    }
}

client.login(token).then(() => {
    console.log("Nexus Online");
}).catch(console.error);
