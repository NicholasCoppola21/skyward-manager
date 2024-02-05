import {
  type ChatInputCommandInteraction,
  type CacheType,
  SlashCommandBuilder,
  time,
} from "discord.js";
import SlashCommand, { type Builder } from "../SlashCommand";
import Login from "./login";
import { SkywardAccountManager, SkywardError } from "ccisd-skyward";

export default class RecentAssignemnts extends SlashCommand {
  public override opts: Builder = new SlashCommandBuilder()
    .setName("recent")
    .setDescription("Pulls your recent assignments from skyward")
    .addNumberOption((n) =>
      n
        .setName("days")
        .setDescription("The amount of days to pull, by default 7")
        .setMinValue(3)
        .setMaxValue(30),
    )
    .addBooleanOption((b) =>
      b
        .setName("show")
        .setDescription(
          "If in a server and true, shows your grades publically.",
        ),
    );

  public override async run(
    i: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await i.deferReply({
      ephemeral: i.inCachedGuild()
        ? !i.options.getBoolean("show") ?? true
        : false,
    });

    const session = await Login.getSession(i.user.id);

    if (!session)
      return void i.editReply({
        content: "You are not currently logged in! Please run /login first.",
      });

    let grades = await session.fetchGradebook();

    if (SkywardError.LOGIN_EXPIRED) {
      const newSession = await Login.getSession(i.user.id, true);
      if (!newSession)
        return void i.editReply({
          content: "Your login expired! Please run /login again!",
        });
      grades = await newSession.fetchGradebook();
    }

    if (SkywardAccountManager.isError(grades)) {
      return void i.editReply({
        content: `Something went wrong trying to pull grades! Please try again later or ping the developer with ${grades}`,
      });
    }

    const date = new Date();
    date.setDate(date.getDate() - (i.options.getNumber("days") ?? 7));

    const assignments = [...grades.values()].map((c) => {
      c.assignmentGrades = c.assignmentGrades
        .filter((a) => a.dueDate.getTime() - date.getTime() > 0)
        .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

      return c;
    });

    return void i.editReply({
      content: assignments
        .map((c) =>
          c.assignmentGrades
            .map(
              (a) =>
                `**${c.name}** - ${a.name} - ${a.grade ?? "*"} ${time(
                  a.dueDate,
                  "R",
                )}`,
            )
            .join("\n"),
        )
        .join("\n"),
    });
  }
}
