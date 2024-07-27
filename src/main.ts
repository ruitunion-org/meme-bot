import { Bot } from "grammy";

import "dotenv/config";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));

bot.start();
