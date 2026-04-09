export interface BookmarkCreated {
  readonly type: "BookmarkCreated";
  readonly bookmarkId: string;
  readonly url: string;
  readonly timestamp: Date;
}
