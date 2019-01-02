// @flow
import React, { Component } from "react";
import Stats from "stats-js";

const MB_PANEL = 2;

/**
 * Integration of https://github.com/Kevnz/stats.js.
 * Adapted from https://github.com/vigneshshanmugam/react-memorystats.
 */
export default class StatsGraph extends Component<{||}> {
  componentDidMount() {
    const stats = new Stats();
    stats.showPanel(MB_PANEL);
    stats.begin();

    this.stats = stats;

    if (this.elt) {
      this.elt.appendChild(this.stats.domElement);
    }

    const updateStats = () => {
      this.stats.update();
      requestIdleCallback(updateStats);
    };

    if (requestIdleCallback) {
      requestIdleCallback(updateStats);
    }
  }

  stats: Stats;

  elt: ?Element;

  render() {
    return (
      <div
        ref={(ref) => {
          this.elt = ref;
        }}
      />
    );
  }
}
