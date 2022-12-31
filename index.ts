// Packages
import { Client as _Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import express, { urlencoded, json } from "express";
const router = express();
import chalk from "chalk";
const { yellow, green } = chalk;
import routes from "./routes/posts.js";
import { createServer } from "http";
// Variables
const Client = new _Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});
var maintenance = false;
let commandsList = new Collection();

// Handlers

const commands = readdirSync("./commands/").filter((file) =>
  file.endsWith(".ts")
);
for (const file of commands) {
  const props = await import(`./commands/${file}`);
  console.log(yellow(`Loading Command: ${props.help.name}. 👌`));
  commandsList.set(props.help.name, props);
}

const eventFiles = readdirSync("./events/").filter((file) =>
  file.endsWith(".ts")
);
for (const file of eventFiles) {
  const eventName = file.split(".")[0];
  console.log(green(`Loading Event: ${eventName}. 👌`, "log"));
  const event = (await import(`./events/${file}`)).default;
  Client.on(eventName, (arg1) => {
    event(Client, arg1, commandsList);
  });
}
/** Parse the request */
router.use(urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(json());

/** Routes */
router.use("/", routes);
/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: "Not found",
  });
});

// Code for Requests
const httpServer = createServer(router);
const PORT = process.env.PORT ?? 2012;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

Client.login(
  "MTA1NzE0NDk3Njg0NjM2MDY3Ng.GMsqnr.fctihp1lmXGtsmoRlBM_b7CllaCZQcwiQHxI2Q"
);
