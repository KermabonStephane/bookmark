import type { BookmarkId } from "@bookmark/domain";

export interface DeleteBookmarkCommand {
  id: BookmarkId;
}

export interface DeleteBookmarkUseCase {
  execute(command: DeleteBookmarkCommand): Promise<void>;
}
