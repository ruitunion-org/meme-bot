import {
  convertAuthorIdListArrayToString,
  convertAuthorIdListStringToArray,
  IMessagesTableEntry,
  updateDataInMessagesTable,
} from "../db";

export const userRemovedExistingReactionConditionHandler = async (
  maybeMessagesTableEntry: IMessagesTableEntry,
  userId: string,
  msgId: number
) => {
  const { author_id_list } = maybeMessagesTableEntry;
  let authorIdListAsArray = convertAuthorIdListStringToArray(author_id_list);

  authorIdListAsArray = authorIdListAsArray.filter((el) => el === userId);
  const authorIdListAsString =
    convertAuthorIdListArrayToString(authorIdListAsArray);
  await updateDataInMessagesTable(msgId, authorIdListAsString);
};
