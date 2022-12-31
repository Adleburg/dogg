import chalk from "chalk";
import { Client, Collection, Message } from "discord.js";

export default async (
  Client: Client,
  message: Message,
  commandsList: Collection<string, any>
) => {
  const prefix = ">";
  var BotDevelopers = ["605483919839854622", "891719496123940935", "680599221849817125"];
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(" ");
  const commandName = args[0].toLowerCase();
  args.shift();
  const cmd = commandsList.get(commandName);
  if (cmd) {
    if (cmd.help.enabled === false) return;
    if (cmd && !message.guild && cmd.help.guildOnly === true)
      return message.channel.send({
        content:
          "This command is unavailable via private message. Please run this command in a guild.",
      });

    if (
      cmd.help.BotDeveloperOnly === true &&
      !BotDevelopers.includes(message.author.id)
    )
      return message.reply({ content: "You are not bot staff" });
    await cmd.run(Client, message, args);
    console.log(
      chalk.blue(`[${message.author.tag}] has ran ${commandName} at ${Date()}`)
    );
  }
};
