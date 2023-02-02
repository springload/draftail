import React, { Component } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Benchmark, { BenchmarkType } from "react-component-benchmark";

import { DraftailEditor } from "../../src/index";

import BenchmarkResults, { BenchResultsType } from "./BenchmarkResults";

type Props = {
  componentProps: unknown;
  runOnMount?: boolean;
};

type State = {
  results: BenchResultsType | null;
};

class EditorBenchmark extends Component<Props, State> {
  benchmark?: Benchmark;

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

  onBenchmarkComplete(results: BenchResultsType) {
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
          ref={(ref: React.Ref<Benchmark>) => {
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
