export const logCtx = (ctx: unknown) =>
  console.log(JSON.stringify(ctx, null, 2));

export const authorIdListContainsUser = (
  authorId: string,
  authorIdList: string[]
) => authorIdList.some((authorIdListItem) => authorIdListItem === authorId);
