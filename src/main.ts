import { Client, Collection, IntentsBitField } from "discord.js";
import "dotenv/config";
import { readdir } from "fs/promises";
import type SlashCommand from "./SlashCommand";

const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });

// Uses process.env.DISCORD_TOKEN which is automatically loaded from the .env file using dotenv
void client.login();

const commands = new Collection<string, SlashCommand>();

(
  await Promise.all(
    (await readdir("./dist/commands/"))
      .filter((name) => name.endsWith(".js"))
      .map((name) => import(`./commands/${name}`)),
  )
)
  .map((c) => new c.default() as SlashCommand)
  .forEach((sc) => commands.set(sc.opts.name, sc));

client.on("ready", (client) => {
  console.log(`${client.user.username} has logged in!`);
  void client.application.commands
    .set(commands.map((v) => v.opts))
    .catch(console.error);

  console.log(
    `Loaded & registered the following commands:\n${commands
      .map((_, k) => `/${k}`)
      .join("\n")}`,
  );
});
