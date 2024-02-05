import {
  type ChatInputCommandInteraction,
  type CacheType,
  SlashCommandBuilder,
} from "discord.js";
import SlashCommand, { type Builder } from "../SlashCommand";
import Login from "./login";
import { SkywardAccountManager, SkywardError } from "ccisd-skyward";

export default class PullGradeBook extends SlashCommand {
  public override opts: Builder = new SlashCommandBuilder()
    .setName("grades")
    .setDescription(
      "Pull your current term grades! Make sure to run /login first!",
    )
    .addBooleanOption((b) =>
      b
        .setName("all")
        .setDescription(
          "Weather to display all terms for each class or just the last 3 current terms.",
        ),
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

    if (!session) {
      return void i.editReply({
        content: "You are not currently logged in! Run /login first!",
      });
    }

    let grades = await session.fetchGradebook();

    if (SkywardError.LOGIN_EXPIRED === grades) {
      // attempt to relog into skyward
      const newSession = await Login.getSession(i.user.id, true);
      if (!newSession)
        return void i.editReply({
          content:
            "Your login session expired and we were not able to re-login. Please try to run /login again or try later.",
        });
      grades = await newSession.fetchGradebook();
    }

    if (SkywardAccountManager.isError(grades))
      return void i.editReply({
        content: `An error occured and we were not able to resolve it. Please try again later or ping the developer with the error: ${grades}`,
      });

    const classes = [...grades.values()];
    classes.forEach(
      (c) => (c.name = c.name.length > 20 ? `${c.name.slice(0, 19)}.` : c.name),
    );
    const longestClass = classes.sort(
      (a, b) => b.name.length - a.name.length,
    )[0];
    console.log(longestClass);
    return void i.editReply({
      content: `Hey, ${i.user}! Here's your current grades:\n\`\`\`ansi
${classes
  .sort((a, b) => a.period - b.period)
  .map(
    (skywardClass) =>
      `\u001b[0;34m${`${skywardClass.name}\u001b[0m: `.padEnd(
        `${longestClass.name}\u001b[0m: `.length,
        " ",
      )} ${skywardClass.termGrades
        .filter((term) => Number(term.grade))
        .slice(i.options.getBoolean("all") ? 0 : -3)
        .map(
          (grade, i, a) =>
            `${grade.grade! < 100 ? " " : ""}${
              Number(grade.grade) < 70
                ? `\u001b[0;31m${grade.grade}\u001b[0m`
                : i + 1 === a.length
                ? `\u001b[0;33m${grade.grade}\u001b[0m`
                : grade.grade
            }`,
        )
        .join(" ")}`,
  )
  .join("\n")}\`\`\``,
    });
  }
}
