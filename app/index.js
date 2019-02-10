import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";

import registerServiceWorker from "./registerServiceWorker";

import App from "./App";
import commonStore from "./stores/CommonStore";
import taskStore from "./stores/TaskStore";

const stores = {
  commonStore,
  taskStore
};
ReactDOM.render(
  <Provider {...stores}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
