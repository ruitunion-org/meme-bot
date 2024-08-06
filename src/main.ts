import { API_CONSTANTS, Bot, GrammyError, HttpError } from "grammy";

import "dotenv/config";
import {
  convertAuthorIdListStringToArray,
  insertNewDataIntoMessagesTable,
  getMessagesTableEntry,
  db,
  updateDataInMessagesTable,
} from "./db";
import {
  userAddedNewReactionConditionHandler,
  userRemovedExistingReactionConditionHandler,
} from "./handlers";
import { authorIdListContainsUser, logCtx } from "./lib";

const bot = new Bot(process.env.BOT_TOKEN, {});

bot.command("dev", (ctx) => {
  ctx.reply("operational");
  logCtx(ctx);
});

bot.on("message:video", async (ctx) => {
  if (
    String(ctx.msg.message_thread_id) ===
    process.env.TOPIC_ID_TO_SUBSCRIBE_TO_REACTIONS_FROM
  ) {
    await insertNewDataIntoMessagesTable(ctx.msgId);
  }
});

bot.on("message:photo", async (ctx) => {
  if (
    String(ctx.msg.message_thread_id) ===
    process.env.TOPIC_ID_TO_SUBSCRIBE_TO_REACTIONS_FROM
  ) {
    await insertNewDataIntoMessagesTable(ctx.msgId);
  }
});

bot.on("message_reaction", async (ctx) => {
  const maybeMessagesTableEntry = await getMessagesTableEntry(ctx.msgId);

  if (
    // shit happens
    !maybeMessagesTableEntry ||
    // уже запостили в группу админов
    maybeMessagesTableEntry.has_been_posted ||
    // anonymous users reactions can be ignored
    !ctx.update.message_reaction.user?.id
  ) {
    return;
  }

  const msgId = ctx.msgId;
  const reactionOwnerUserId = String(ctx.update.message_reaction.user.id);
  const authorIdList = convertAuthorIdListStringToArray(
    maybeMessagesTableEntry.author_id_list
  );

  // пользователь удалил существующую реакцию
  const isOldReaction = Boolean(
    ctx.update.message_reaction.old_reaction.length
  );
  // пользователь добавил новую реакцию
  const isNewReaction = Boolean(
    ctx.update.message_reaction.new_reaction.length
  );
  // просто поменял реакцию
  const isUserChangedReaction = isOldReaction && isNewReaction;
  // актуальное кол-во реакций на посте не считая ctx.update.message_reaction.new_reaction
  const currentReactionsAmount = authorIdList.length;
  //собрали достаточно реакций для постинга админам
  const isReactionCountSufficientToForwardMemeToAdmins =
    currentReactionsAmount === Number(process.env.REACTIONS_AMOUNT) &&
    !isUserChangedReaction &&
    isNewReaction &&
    !authorIdListContainsUser(reactionOwnerUserId, authorIdList);

  if (isReactionCountSufficientToForwardMemeToAdmins) {
    await ctx.forwardMessage(process.env.GROUP_ID_TO_POST_SUGGESTIONS, {
      // @ts-ignore
      message_id: maybeMessagesTableEntry.message_id,
    });
    return await updateDataInMessagesTable(
      msgId,
      maybeMessagesTableEntry.author_id_list,
      1
    );
  }

  if (isUserChangedReaction) {
    console.log("User replaced existing reaction with another one");
    return;
  }

  if (isOldReaction) {
    console.log("User has removed a reaction");
    await userRemovedExistingReactionConditionHandler(
      maybeMessagesTableEntry,
      reactionOwnerUserId,
      msgId
    );
  }

  if (isNewReaction) {
    console.log("User has added a new reaction");
    await userAddedNewReactionConditionHandler(
      maybeMessagesTableEntry,
      reactionOwnerUserId,
      msgId
    );
  }
});

bot
  .start({ allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES })
  .catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  })
  .finally(() => db.close());
