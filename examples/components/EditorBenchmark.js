import PropTypes from "prop-types";
import React, { Component } from "react";
import Benchmark, { BenchmarkType } from "react-component-benchmark";

import { DraftailEditor } from "../../lib";

import BenchmarkResults from "./BenchmarkResults";

class EditorBenchmark extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
    };

    this.startBenchmark = this.startBenchmark.bind(this);
    this.onBenchmarkComplete = this.onBenchmarkComplete.bind(this);
  }

  componentDidMount() {
    const { runOnMount } = this.props;

    if (runOnMount) {
      this.startBenchmark();
    }
  }

  onBenchmarkComplete(results) {
    this.setState({ results });
  }

  startBenchmark() {
    if (this.benchmark) {
      this.benchmark.start();
    }
  }

  render() {
    const { componentProps } = this.props;
    const { results } = this.state;

    return (
      <>
        <button type="button" onClick={this.startBenchmark}>
          Benchmark
        </button>
        <Benchmark
          component={DraftailEditor}
          componentProps={componentProps}
          onComplete={this.onBenchmarkComplete}
          ref={(ref) => {
            this.benchmark = ref;
          }}
          samples={25}
          timeout={10000}
          type={BenchmarkType.MOUNT}
        />
        <BenchmarkResults results={results} />
      </>
    );
  }
}

EditorBenchmark.propTypes = {
  componentProps: PropTypes.object.isRequired,
  runOnMount: PropTypes.bool,
};

EditorBenchmark.defaultProps = {
  runOnMount: false,
};

export default EditorBenchmark;
