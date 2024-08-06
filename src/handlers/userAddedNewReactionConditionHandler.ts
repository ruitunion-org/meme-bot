import {
  convertAuthorIdListArrayToString,
  convertAuthorIdListStringToArray,
  IMessagesTableEntry,
  updateDataInMessagesTable,
} from "../db";
import { authorIdListContainsUser } from "../lib";

export const userAddedNewReactionConditionHandler = async (
  maybeMessagesTableEntry: IMessagesTableEntry,
  userId: string,
  msgId: number
) => {
  const { author_id_list } = maybeMessagesTableEntry;
  const authorIdListAsArray = convertAuthorIdListStringToArray(author_id_list);

  if (!authorIdListContainsUser(userId, authorIdListAsArray)) {
    authorIdListAsArray.push(userId);
    const authorIdListAsString =
      convertAuthorIdListArrayToString(authorIdListAsArray);
    await updateDataInMessagesTable(msgId, authorIdListAsString);
  }
};
