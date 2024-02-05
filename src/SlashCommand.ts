import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type Builder =
  | SlashCommandBuilder
  // If you add options to your slash command, this will be the new type of it
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
export default abstract class SlashCommand {
  public abstract opts: Builder;

  public abstract run(i: ChatInputCommandInteraction): Promise<void>;
}
