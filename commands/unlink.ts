import { Client, Message, MessageEmbed } from "discord.js";
import db from "quick.db";

export const help = {
  name: "unlink",
  guildOnly: false,
  enabled: true,
  category: "System",
  description: "Recieve help",
  usage: "info",
  BotDeveloperOnly: true,
};
export async function run(client: Client, message: Message, args: any) {
  let groupid = args[0];

  if (groupid && db.get(groupid)) {
    let group = db.get(groupid);
    let groupOwner = db.get(group.Key).keyOwner;
    db.delete(group.Key);
    db.delete(groupid);
    const successEmbed = new MessageEmbed()
      .setTitle("Group Successfully Unlinked")
      .addField("Group Owner", `<@${groupOwner}>`, true)
      .addField("Group ID", `${groupid}`, true)
      .setColor("GREEN");
    message.reply({ embeds: [successEmbed] });
  } else {
    message.reply("Group not linked");
  }
}
