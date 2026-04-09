import type { Bookmark, BookmarkId } from "@bookmark/domain";
import type { BookmarkUpdateFields } from "@bookmark/domain";

export interface UpdateBookmarkCommand {
  id: BookmarkId;
  fields: BookmarkUpdateFields;
}

export interface UpdateBookmarkUseCase {
  execute(command: UpdateBookmarkCommand): Promise<Bookmark>;
}
