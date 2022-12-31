import Discord, { Client, Message, User } from "discord.js";
import roblox from "noblox.js";
import db from "quick.db";

export async function run(client: Client, message: Message, args: string[]) {
  async function MakeGameKey(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const user =
    message.mentions.users.first() ||
    message.guild?.members.cache.get(args[0])?.user;
  const APIKEYGENERATED = await MakeGameKey(26);

  const InfoEmbedData = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle("Arguments Invalid,")
    .setDescription("You must provide the GROUPID Value")
    .setColor("RED");
  if (!args[0]) return message.reply({ embeds: [InfoEmbedData] });
  if (!args[1] || user === undefined)
    return message.reply({ content: "Ping the user to link to." });
  console.error(args[1]);
  let GroupLookup = await roblox.getGroup(Number(args[0])).catch((e) => {});
  if (!GroupLookup || GroupLookup === undefined)
    return message.reply({ content: "Group Invalid" });

  if (db.has(`${GroupLookup.id}`)) {
    const AlreadyLinkedEmbed = new Discord.MessageEmbed()
      .setTitle("That group is already linked.")
      .addField("Group Name: ", `${GroupLookup.name}`, true)
      .addField("Group ID: ", `${GroupLookup.id}`, true)
      .addField("Member Count: ", `${GroupLookup.memberCount}`, true)
      .setColor("RED");
    return message.reply({ embeds: [AlreadyLinkedEmbed] });
  }

  const GroupLinkedEmbed = new Discord.MessageEmbed()
    .setTitle(
      `${GroupLookup.name} has been linked to ${user.tag} in the Axiom Network`
    )
    .addField("Group Name: ", `${GroupLookup.name}`, true)
    .addField("Group ID: ", `${GroupLookup.id}`, true)
    .addField("Member Count: ", `${GroupLookup.memberCount}`, true)
    .setColor("GREEN")
    .setFooter({
      text: `<@${user.id}> has been privately messaged with the API Key `,
      iconURL: "https://i.imgur.com/i35lFue.png",
    });

  const PMUserEmbed = new Discord.MessageEmbed()
    .setTitle("Your group has just been linked to the Axiom Network")
    .setDescription(
      "You have been given access to a channel with the information on how to setup your product, if you cannot find it please ping a staff member."
    )

    .addField("API Key: ", `${APIKEYGENERATED}`, true)
    .addField("Group Linked to: ", `${GroupLookup.id}`, true)

    .setColor("BLURPLE")
    .setFooter("AxiomNetwork");

  db.set(`${APIKEYGENERATED}`, {
    groupID: `${GroupLookup.id}`,
    keyOwner: `${user.id}`,
  });
  db.set(`${GroupLookup.id}`, { Key: `${APIKEYGENERATED}` });

  user.send({ embeds: [PMUserEmbed] }).catch(() => {
    message.reply("Can't send DM to user, api key logged to console instead!");
    console.log(`${user.tag} has the api key of ${APIKEYGENERATED}`);
  });
  return message.reply({ embeds: [GroupLinkedEmbed] });
}

export const help = {
  name: "link",
  guildOnly: false,
  enabled: true,
  category: "System",
  description: "Recieve help",
  usage: "info",
  BotDeveloperOnly: true,
};
