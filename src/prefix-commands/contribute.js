const { EmbedBuilder } = require("discord.js"); 

module.exports = {
  run(message, args) {
    try {
      console.log("Contribute command executed");

      const githubLink = "https://github.com/Nexus-bot-open/Nexus"; 
      
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff') 
        .setTitle('How to Contribute')
        .setDescription('Thank you for your interest in contributing to the bot!')
        .addFields(
          { name: 'GitHub Repository', value: githubLink },
          { name: 'We welcome contributions such as:', value: '- Reporting bugs\n- Suggesting features\n- Submitting pull requests\n- Improving documentation\n- Adding Your Own Features' }
        )
        .setFooter({ text: 'Feel free to explore and help us make this bot even better!' });

      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error in contribute command:", error);
      message.reply("Unable to execute that command.");
    }
  },
};
