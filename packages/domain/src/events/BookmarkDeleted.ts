export interface BookmarkDeleted {
  readonly type: "BookmarkDeleted";
  readonly bookmarkId: string;
  readonly timestamp: Date;
}
