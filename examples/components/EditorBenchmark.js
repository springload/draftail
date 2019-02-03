// @flow
import React, { Component } from "react";
import Benchmark, { BenchmarkType } from "react-component-benchmark";
import type { BenchResultsType } from "react-component-benchmark";

import { DraftailEditor } from "../../lib";

import BenchmarkResults from "./BenchmarkResults";

type Props = {|
  componentProps: {},
  runOnMount: boolean,
|};

type State = {|
  results: ?BenchResultsType,
|};

class EditorBenchmark extends Component<Props, State> {
  constructor(props: Props) {
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

  /* :: onBenchmarkComplete: (results: BenchResultsType) => void; */
  onBenchmarkComplete(results: BenchResultsType) {
    this.setState({ results });
  }

  benchmark: ?Benchmark;

  /* :: startBenchmark: () => void; */
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
        {results ? <BenchmarkResults results={results} /> : null}
      </>
    );
  }
}

export default EditorBenchmark;
