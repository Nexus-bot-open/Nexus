const { Events, ActivityType, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("path"); 
require("dotenv").config();

const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        
        
        const activities = [
            { name: `${client.guilds.cache.size} servers!`, type: ActivityType.Watching },
            { name: "Nexus ", type: ActivityType.Playing }
        ];
        let currentIndex = 0;

        setInterval(() => {
            const { name, type } = activities[currentIndex];
            client.user.setPresence({
                activities: [{ name, type }],
                status: "idle"
            });
            currentIndex = (currentIndex + 1) % activities.length;
        }, 10 * 1000); 

        
        const commands = [];
        const commandPath = path.join(__dirname, "../commands");

        const commandFiles = fs.readdirSync(commandPath, { withFileTypes: true });
        for (const dir of commandFiles) {
            if (dir.isDirectory()) {
                const subDirFiles = fs.readdirSync(path.join(commandPath, dir.name)).filter(file => file.endsWith('.js'));
                for (const file of subDirFiles) {
                    const command = require(path.join(commandPath, dir.name, file)); 
                    if (command.data && typeof command.data.toJSON === "function") {
                        commands.push(command.data.toJSON());
                    } else {
                        console.error(`[ERROR] >>> Invalid data structure in command file: ${file}`);
                    }
                }
            }
        }

        const rest = new REST({ version: "10" }).setToken(token);
        try {
            console.log(`[CLIENT] >>> Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });
            console.log(`[CLIENT] >>> Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(`[ERROR] >>> Error occurred during the refreshing/registration of application commands:`, error);
        }
    },
};
