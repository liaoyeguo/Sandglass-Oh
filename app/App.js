import React, { Component } from "react";
import PropTypes from "prop-types";

import "./App.css";
import { inject, observer } from "mobx-react";
import { Slider, Button, Icon, Progress } from "antd";

import { svg } from "./logo";

@inject("store")
@observer
class Timer extends Component {
  format = time => {
    let secs = time % 60;
    let mins = Math.floor(time / 60);
    return (
      (mins < 10 ? `0${mins}` : mins) + ":" + (secs < 10 ? `0${secs}` : secs)
    );
  };
  render() {
    const { store } = this.props;
    return (
      <div className="timer">
        <span className="number">{this.format(store.remainTime)}</span>
      </div>
    );
  }
}

const Header = () => {
  return (
    <div className="header">
      <div className="logo">{svg}</div>
    </div>
  );
};

@inject("store")
@observer
class ToolBox extends Component {
  handleSliderChange = value => {
    const { store } = this.props;
    store.setTimerDuration(value);
  };
  render() {
    const { store } = this.props;
    const percent = (1 - store.remainTime / store.timerDuration / 60) * 100;
    return (
      <div className="toolbox">
        {store.timerState == "running" ? (
          <div className="progress-wrapper">
            <Progress
              percent={50}
              showInfo={false}
              size="small"
              className="progress"
              strokeWidth={4}
              strokeColor="#fc6f80"
              percent={percent}
              status="active"
            />
          </div>
        ) : (
          <div className="slider-wrapper">
            <Slider
              marks={{ 15: "", 25: "", 30: "", 45: "" }}
              max={45}
              step={null}
              tooltipVisible={false}
              className="slider"
              onChange={this.handleSliderChange}
              value={store.timerDuration}
            />
          </div>
        )}
      </div>
    );
  }
}
@inject("store")
@observer
class App extends Component {
  handleStart = () => {
    const { store } = this.props;
    store.startTimer();
  };
  handleGiveUp = () => {
    const { store } = this.props;
    store.resetTimer();
  };

  createButton = () => {
    const { store } = this.props;
    switch (store.timerState) {
      case "init":
        return (
          <Button className="btn round" onClick={this.handleStart}>
            <Icon type="play-circle" />
            Let's focus
          </Button>
        );
      case "running":
        return (
          <Button className="btn round" onClick={this.handleGiveUp}>
            <Icon type="close-circle" />
            Give up
          </Button>
        );
    }
  };
  render() {
    const { store } = this.props;
    const button = this.createButton();
    return (
      <div className="app">
        <Header />
        <div className="main">
          <Timer />
          <div className="btn-wrapper">{button}</div>
        </div>
        <ToolBox />
      </div>
    );
  }
}

App.propTypes = {};

export default App;
