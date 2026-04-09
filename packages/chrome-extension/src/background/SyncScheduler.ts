const ALARM_NAME = "bookmark-sync";
const SYNC_INTERVAL_MINUTES = 15;

export class SyncScheduler {
  start(): void {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: SYNC_INTERVAL_MINUTES,
    });
  }

  stop(): void {
    chrome.alarms.clear(ALARM_NAME);
  }

  onAlarm(callback: (alarmName: string) => void): void {
    chrome.alarms.onAlarm.addListener((alarm) => {
      callback(alarm.name);
    });
  }

  isSync(alarmName: string): boolean {
    return alarmName === ALARM_NAME;
  }
}
