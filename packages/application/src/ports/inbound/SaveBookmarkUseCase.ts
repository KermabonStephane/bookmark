import type { Bookmark } from "@bookmark/domain";
import type { SaveBookmarkCommand } from "../../dto/SaveBookmarkCommand.js";

export interface SaveBookmarkUseCase {
  execute(command: SaveBookmarkCommand): Promise<Bookmark>;
}
