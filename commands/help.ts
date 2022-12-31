import { Client, Message } from "discord.js";

export async function run(client: Client, message: Message, args: string[]) {
  return message.reply({ content: "In Development" });
}

export const help = {
  name: "help",
  guildOnly: false,
  enabled: true,
  category: "System",
  description: "Recieve help",
  usage: "help",
  BotDeveloperOnly: false,
};
