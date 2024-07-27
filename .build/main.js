import { Bot } from "grammy";
import "dotenv/config";
var bot = new Bot(process.env.BOT_TOKEN);
bot.on("message:text", function (ctx) { return ctx.reply(ctx.message.text); });
bot.start();
