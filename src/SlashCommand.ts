import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class SlashCommand {
  public abstract opts: SlashCommandBuilder;

  public abstract run(i: CommandInteraction): Promise<void>;
}
