import {
  SlashCommandBuilder,
  type CommandInteraction,
  type CacheType,
} from "discord.js";
import SlashCommand from "../SlashCommand";

export default class PingCommand extends SlashCommand {
  public override opts: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Tells you the network latency between discord and my server (in MS)",
    );

  public override async run(i: CommandInteraction<CacheType>): Promise<void> {
    const response = await i.reply({ content: "Pinging.." });

    return void i.editReply({
      content: `${Date.now() - response.createdTimestamp}ms`,
    });
  }
}
