// @flow
// flow-typed signature: 28e77c1030280db8981c3735d6829271
// flow-typed version: <<STUB>>/react-component-benchmark_v0.0.4/flow_v0.89.0

const BenchmarkType = {
  MOUNT: "mount",
  UPDATE: "update",
  UNMOUNT: "unmount",
};

declare module "react-component-benchmark" {
  declare type FullSampleTimingType = {
    start: number,
    end: number,
    elapsed: number,
  };

  declare export type BenchResultsType = {|
    startTime: number,
    endTime: number,
    runTime: number,
    sampleCount: number,
    samples: Array<FullSampleTimingType>,
    max: number,
    min: number,
    median: number,
    mean: number,
    stdDev: number,
    p70: number,
    p95: number,
    p99: number,
  |};

  declare type Props = {|
    component: typeof React$Component,
    componentProps?: {},
    onComplete: (x: BenchResultsType) => void,
    samples: number,
    timeout: number,
    type: $Values<typeof BenchmarkType>,
  |};

  declare class Benchmark extends React$Component<Props> {
    start(): void;
  }

  declare export default typeof Benchmark;

  declare export var BenchmarkType: typeof BenchmarkType;
}
