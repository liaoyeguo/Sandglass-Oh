import { observable, computed, reaction, action, when } from "mobx";
import { dataUrl } from "../../../app/logo";

class BackgroundStore {
  updateCallback = null;
  @observable remainTime = 0;
  @observable timerDuration = 0;
  @observable timerState = "init";

  constructor() {
    this.load();
  }
  onUpdated(callback) {
    this.updateCallback = callback;
    this.update();
  }

  update() {
    this.updateCallback && this.updateCallback(this.snapShot);
  }
  @computed get snapShot() {
    return {
      remainTime: this.remainTime,
      timerDuration: this.timerDuration,
      timerState: this.timerState
    };
  }
  setTimerDuration(timerDuration) {
    this.timerDuration = timerDuration;
    this.remainTime = timerDuration * 60;
  }
  @action prepareTimer() {
    this.setTimerDuration(this.timerDuration);
  }
  @action startTimer() {
    this.prepareTimer();
    this.timerState = "running";
    chrome.alarms.onAlarm.addListener(this.alarmCallback);
    this.tick();
  }

  @action resetTimer() {
    this.timerState = "init";
    chrome.alarms.onAlarm.removeListener(this.alarmCallback);
    this.prepareTimer();
  }

  @action alarmCallback = () => {
    this.remainTime -= 1;
    this.tick();
  };

  tick() {
    if (this.remainTime > 0) {
      chrome.alarms.create({ when: Date.now() + 1000 });
      this.update();
    } else {
      this.resetTimer();
      chrome.notifications.create({
        type: "basic",
        title: "Time up!",
        message: `You have been focused for ${this.timerDuration} minutes`,
        iconUrl: dataUrl
      });
    }
  }

  save() {
    chrome.storage.sync.set({
      timerDuration: this.timerDuration
    });
  }

  @action load() {
    chrome.storage.sync.get(["timerDuration"], result => {
      this.setTimerDuration((result && result.timerDuration) || 15);
    });
  }
}

module.export = BackgroundStore;
const backgroundStore = new BackgroundStore();
window.backgroundStore = backgroundStore;

reaction(
  () => backgroundStore.snapShot,
  () => {
    backgroundStore.update();
  }
);

chrome.runtime.onConnect.addListener(port => {
  // popup open
  port.onDisconnect.addListener(() => {
    // popup close
    backgroundStore.save();
  });
});
