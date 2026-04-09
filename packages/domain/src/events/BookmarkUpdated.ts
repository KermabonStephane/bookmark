export interface BookmarkUpdated {
  readonly type: "BookmarkUpdated";
  readonly bookmarkId: string;
  readonly changedFields: string[];
  readonly timestamp: Date;
}
