import sqlite3 from "sqlite3";

const DataBase = sqlite3.verbose().Database;

type SQLiteFlag = 1 | 0;

export interface IMessagesTableEntry {
  message_id: number;
  author_id_list: string;
  has_been_posted: SQLiteFlag;
}

export const convertAuthorIdListStringToArray = (authorIdList: string) =>
  authorIdList.length === 0 ? [] : authorIdList.split(",");

export const convertAuthorIdListArrayToString = (authorIdList: string[]) =>
  authorIdList.join(",");

export const insertNewDataIntoMessagesTable = (messageId: number) =>
  new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO messages (message_id, author_id_list, has_been_posted) VALUES($messageId, '', 0)",
      {
        $messageId: messageId,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(void 0);
        }
      }
    );
  });

export const updateDataInMessagesTable = (
  messageId: number,
  authorIdList: string,
  has_been_posted?: SQLiteFlag
) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "UPDATE messages SET author_id_list = $authorIdList, has_been_posted = $has_been_posted WHERE message_id = $messageId",
      {
        $messageId: messageId,
        $authorIdList: authorIdList,
        $has_been_posted: has_been_posted ?? 0, // Default to 0 if undefined
      },
      (err) => {
        if (err) {
          console.error(err.message);
          return reject(err); // Reject the promise on error
        }
        resolve(); // Resolve only if there is no error
      }
    );
  });
};

export const getMessagesTableEntry = (
  messageId: number
): Promise<IMessagesTableEntry | null | undefined> => {
  return new Promise((resolve) => {
    db.get(
      "SELECT author_id_list, has_been_posted, message_id FROM messages WHERE message_id = ?",
      [messageId],
      (err, row) => {
        if (err) {
          console.error(err.message);
          resolve(null);
        } else {
          // @ts-ignore
          resolve(row);
        }
      }
    );
  });
};

export const db = new DataBase("sqlite/sqlite.db", (err) => {
  if (err) {
    console.log("Failed to start SQLite database", err);
    process.exit(1);
  } else {
    console.log("SQLite database started");
  }
});
