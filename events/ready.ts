import chalk from "chalk";
import { Client } from "discord.js";
export default async (Client: Client) => {
  console.log(
    chalk.green(`${Client.user?.tag} is ready to connect to Axiom Network.`)
  );
  Client.user?.setActivity({ name: "Axiom Interactive", type: "WATCHING" });
};
