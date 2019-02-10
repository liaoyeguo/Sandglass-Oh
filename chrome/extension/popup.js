import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import App from "../../app/App";
import { observable, computed, autorun, action } from "mobx";

class Store {
  @observable timerDuration;
  @observable remainTime;
  @observable timerState;
  backgroundStore = null;

  constructor(backgroudStore) {
    this.backgroundStore = backgroudStore;
    this.backgroundStore.onUpdated(value => {
      this.remainTime = value.remainTime;
      this.timerDuration = value.timerDuration;
      this.timerState = value.timerState;
    });
  }

  @action setTimerDuration(value) {
    this.backgroundStore.setTimerDuration(value);
  }

  @action startTimer() {
    this.backgroundStore.startTimer(this.timerDuration);
  }

  @action resetTimer() {
    this.backgroundStore.resetTimer();
  }
}

const port = chrome.runtime.connect({ name: "popup" });
chrome.runtime.getBackgroundPage(function(backgroundPage) {
  const { backgroundStore } = backgroundPage;
  const store = new Store(backgroundStore);

  // inject to dom
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector("#root")
  );
});
