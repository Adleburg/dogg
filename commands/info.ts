import Discord from "discord.js";
import { Message } from "discord.js";
import { Client } from "discord.js";
import roblox from "noblox.js";
import db from "quick.db";

export async function run(client: Client, message: Message, args: any) {
  if (!args[0])
    return message.reply({
      content: "Please supply a groupID to check in the database.",
    });

  const GroupLookup = <roblox.Group>(
    await roblox.getGroup(args[0]).catch((e) => {
      return message.reply({ content: "Group not valid." });
    })
  );

  if (db.has(args[0])) {
    let ApiTraceback = await db.get(db.get(args[0]).Key);
    const InfoEmbedData = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Infomation for ${GroupLookup.name}`)
      .setColor("BLURPLE")
      .addField(
        "API KEY: ",
        "Sensitive Information, Please run the support command for this."
      )
      .addField("License Owner: ", `${ApiTraceback.keyOwner}`)
      .setFooter("AxiomNetwork");
    message.reply({ embeds: [InfoEmbedData] });
  } else {
    const NoDatabaseInfoStored = new Discord.MessageEmbed()
      .setTitle("That group can not be found in our System.")
      .setColor("RED")
      .setFooter("AxiomNetwork");
    return message.reply({ embeds: [NoDatabaseInfoStored] });
  }
}

export const help = {
  name: "info",
  guildOnly: false,
  enabled: true,
  category: "System",
  description: "Recieve help",
  usage: "info",
  BotDeveloperOnly: false,
};
