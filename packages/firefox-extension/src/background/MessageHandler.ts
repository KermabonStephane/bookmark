import type { Container } from "../composition/container.js";

export type Message =
  | { type: "SYNC_NOW" }
  | { type: "GET_SYNC_STATUS" }
  | { type: "SIGN_OUT" };

export class MessageHandler {
  constructor(private readonly container: Container) {}

  register(): void {
    browser.runtime.onMessage.addListener((message: unknown) => {
      return this.handle(message as Message);
    });
  }

  private async handle(message: Message): Promise<unknown> {
    switch (message.type) {
      case "SYNC_NOW":
        return this.container.sync.execute();
      case "GET_SYNC_STATUS":
        return this.container.cache.getLastSyncedAt();
      case "SIGN_OUT":
        await this.container.emailAuth.signOut();
        return { ok: true };
      default:
        return { error: "Unknown message type" };
    }
  }
}
