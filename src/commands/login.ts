import {
  SlashCommandBuilder,
  type CacheType,
  type Snowflake,
  ChatInputCommandInteraction,
  Collection,
} from "discord.js";
import SlashCommand, { type Builder } from "../SlashCommand";
import { SkywardAccountManager, SkywardError } from "ccisd-skyward";
import { sql } from "../database";

export default class Login extends SlashCommand {
  public override opts: Builder = new SlashCommandBuilder()
    .setName("login")
    .setDescription("Logins into Skyward")
    .addStringOption((s) =>
      s
        .setName("email")
        .setDescription(
          "The email for your Skyward account, may look like: 100051835@ccisd.net",
        )
        .setRequired(true),
    )
    .addStringOption((s) =>
      s
        .setName("password")
        .setDescription(
          "The password for your Skyward account, may look like: 0035138",
        )
        .setRequired(true),
    )
    .addBooleanOption((b) =>
      b
        .setName("save")
        .setDescription(
          "If you want to save the login to the database for future uses.",
        ),
    );

  public override async run(
    i: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await i.deferReply({ ephemeral: true });
    const email = i.options.getString("email", true);
    const password = i.options.getString("password", true);
    const save = i.options.getBoolean("save", false) ?? false;

    const account = new SkywardAccountManager();
    const payload = await account.login(email, password);

    if (SkywardAccountManager.isError(payload)) {
      if (payload === SkywardError.INVALID_LOGIN_OR_LOCKED) {
        return void i.editReply({
          content: `Sorry, your account details are invalid or the account is locked.`,
        });
      }

      return void i.editReply({
        content: `Sorry, we encounted an error trying to login. Please try again later or ping the developer with this error: ${payload}`,
      });
    }

    Login.sessions.set(i.user.id, account);

    let failed = false;

    if (save) {
      await sql.user
        .upsert({
          create: {
            id: i.user.id,
            skyward_email: email,
            skyward_password: password,
          },
          update: {
            skyward_email: email,
            skyward_password: password,
          },
          where: {
            id: i.user.id,
          },
        })
        .catch(() => (failed = true));

      if (failed) {
        return void i.editReply({
          content: `Could not save login to database.. Are you using someone elses email?`,
        });
      }

      return void i.editReply({
        content: `Succesfully logged in and saved you to the database!`,
      });
    }

    return void i.editReply({
      content: `Succesfully logged in! Do not log into skyward on your own until you're ready to end this session!`,
    });
  }

  private static sessions = new Collection<Snowflake, SkywardAccountManager>();

  public static async getSession(
    id: Snowflake,
    forceRefresh = false,
  ): Promise<SkywardAccountManager | null> {
    if (Login.sessions.has(id) && !forceRefresh) return this.sessions.get(id)!;

    const record = await sql.user.findFirst({ where: { id } });

    if (!record) return null;

    const session = new SkywardAccountManager(true);

    const payload = await session.login(
      record.skyward_email,
      record.skyward_password,
    );

    if (SkywardAccountManager.isError(payload)) return null;

    this.sessions.set(id, session);

    return session;
  }
}
