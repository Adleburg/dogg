import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
export async function run(client: Client, message: Message, args: string[]){
    if(args.length < 3){
        return await message.reply("Please supply a status, title, and message.");
    }

    let status = args[0];
    let title = args[1];
    args.shift();
    args.shift();
    let msg = args.join(" ");

    let embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(msg);
    if(status == "online") embed.setColor("GREEN")
    if(status == "down") embed.setColor("#ff0000");
    if(status == "issue") embed.setColor("ORANGE");
    if(status == "maintenance") embed.setColor("BLUE");
    client.channels.fetch('996857314785108070').then(channel => {
        (<TextChannel>channel!).send({embeds: [embed]});
    })
}
export const help = {
    name: "status",
    guildOnly: false,
    enabled: true,
    category: "System",
    description: "Recieve help",
    usage: "info",
    BotDeveloperOnly: true,
  };