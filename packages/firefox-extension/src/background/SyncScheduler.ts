import browser from "webextension-polyfill";

const ALARM_NAME = "bookmark-sync";
const SYNC_INTERVAL_MINUTES = 15;

export class SyncScheduler {
  start(): void {
    browser.alarms.create(ALARM_NAME, {
      periodInMinutes: SYNC_INTERVAL_MINUTES,
    });
  }

  stop(): void {
    void browser.alarms.clear(ALARM_NAME);
  }

  isSync(alarmName: string): boolean {
    return alarmName === ALARM_NAME;
  }
}
