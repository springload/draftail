import React from "react";
import { mount } from "enzyme";
import Benchmark, { BenchmarkType } from "react-component-benchmark";

import MarkovBenchmark from "./MarkovBenchmark";

const PERFORMANCE_BUFFER = 3;

/**
 * Performance numbers: highest seen number, multiplied by 1.5 factor.
 */
describe("performance", () => {
  let onComplete;
  let results;

  beforeEach(() => {
    onComplete = jest.fn((r) => {
      results = r;
    });
  });

  it("markov_draftjs[41] mount", () => {
    const component = mount(
      <Benchmark
        component={() => <MarkovBenchmark id={41} />}
        onComplete={onComplete}
        samples={25}
        type={BenchmarkType.MOUNT}
      />,
    );
    component.instance().start();
    expect(results.mean).toBeLessThan(87 * PERFORMANCE_BUFFER);
    expect(results.min).toBeLessThan(49 * PERFORMANCE_BUFFER);
    expect(results.median).toBeLessThan(70 * PERFORMANCE_BUFFER);
    expect(results.max).toBeLessThan(278 * PERFORMANCE_BUFFER);
  });

  it("markov_draftjs[41] unmount", () => {
    const component = mount(
      <Benchmark
        component={() => <MarkovBenchmark id={41} />}
        onComplete={onComplete}
        samples={25}
        type={BenchmarkType.UNMOUNT}
      />,
    );
    component.instance().start();
    expect(results.mean).toBeLessThan(2 * PERFORMANCE_BUFFER);
    expect(results.min).toBeLessThan(1 * PERFORMANCE_BUFFER);
    expect(results.median).toBeLessThan(2 * PERFORMANCE_BUFFER);
    expect(results.max).toBeLessThan(8 * PERFORMANCE_BUFFER);
  });

  it("markov_draftjs[41] update", () => {
    const component = mount(
      <Benchmark
        component={() => <MarkovBenchmark id={41} />}
        onComplete={onComplete}
        samples={25}
        type={BenchmarkType.UPDATE}
      />,
    );
    component.instance().start();
    expect(results.mean).toBeLessThan(3 * PERFORMANCE_BUFFER);
    expect(results.min).toBeLessThan(1 * PERFORMANCE_BUFFER);
    expect(results.median).toBeLessThan(2 * PERFORMANCE_BUFFER);
    expect(results.max).toBeLessThan(46 * PERFORMANCE_BUFFER);
  });
});
