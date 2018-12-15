import PropTypes from "prop-types";
import React, { Component } from "react";
import Benchmark, { BenchmarkType } from "react-component-benchmark";

import { DraftailEditor } from "../../lib";

import SentryBoundary from "./SentryBoundary";
import Highlight from "./Highlight";

/* global PKG_VERSION */
const DRAFTAIL_VERSION =
  typeof PKG_VERSION === "undefined" ? "dev" : PKG_VERSION;

class EditorWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: null,
      benchmarkResults: null,
    };

    this.onSave = this.onSave.bind(this);
    this.startBenchmark = this.startBenchmark.bind(this);
    this.onBenchmarkComplete = this.onBenchmarkComplete.bind(this);
  }

  onSave(content) {
    const { id, onSave } = this.props;

    this.setState({ content });

    sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

    if (onSave) {
      onSave(content);
    }
  }

  onBenchmarkComplete(results) {
    this.setState({
      benchmarkResults: results,
    });
  }

  startBenchmark() {
    if (this.benchmark) {
      this.benchmark.start();
    }
  }

  render() {
    const { id } = this.props;
    const { content, benchmarkResults } = this.state;
    const initialContent =
      JSON.parse(sessionStorage.getItem(`${id}:content`)) || null;
    return (
      <div>
        <SentryBoundary>
          <DraftailEditor
            rawContentState={initialContent}
            {...this.props}
            onSave={this.onSave}
          />
        </SentryBoundary>
        <details>
          <summary>
            <span className="link">Debug</span>
          </summary>
          <ul className="list-inline">
            <li>
              <span>Version: {DRAFTAIL_VERSION}</span>
            </li>
          </ul>
          <button type="button" onClick={this.startBenchmark}>
            Benchmark
          </button>
          <Benchmark
            component={DraftailEditor}
            componentProps={this.props}
            onComplete={this.onBenchmarkComplete}
            ref={(ref) => {
              this.benchmark = ref;
            }}
            samples={25}
            timeout={10000}
            type={BenchmarkType.MOUNT}
          />
          {benchmarkResults ? (
            <table>
              <thead>
                <tr>
                  <th>mean</th>
                  <th>min</th>
                  <th>median</th>
                  <th>p70</th>
                  <th>p95</th>
                  <th>p99</th>
                  <th>max</th>
                  <th>stdDev</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{benchmarkResults.mean.toFixed(1)}</td>
                  <td>{benchmarkResults.min.toFixed(1)}</td>
                  <td>{benchmarkResults.median.toFixed(1)}</td>
                  <td>{benchmarkResults.p70.toFixed(1)}</td>
                  <td>{benchmarkResults.p95.toFixed(1)}</td>
                  <td>{benchmarkResults.p99.toFixed(1)}</td>
                  <td>{benchmarkResults.max.toFixed(1)}</td>
                  <td>{benchmarkResults.stdDev.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          ) : null}
          <Highlight
            language="js"
            value={JSON.stringify(content || initialContent, null, 2)}
          />
        </details>
      </div>
    );
  }
}

EditorWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};

EditorWrapper.defaultProps = {
  onSave: () => {},
};

export default EditorWrapper;
