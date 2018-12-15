import React from "react";
import { mount } from "enzyme";
import Benchmark, { BenchmarkType } from "react-component-benchmark";

import MarkovBenchmark from "./MarkovBenchmark";

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
    expect(results.mean).toBeLessThan(77);
    expect(results.min).toBeLessThan(49);
    expect(results.median).toBeLessThan(61);
    expect(results.max).toBeLessThan(278);
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
    expect(results.mean).toBeLessThan(2);
    expect(results.min).toBeLessThan(1);
    expect(results.median).toBeLessThan(2);
    expect(results.max).toBeLessThan(8);
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
    expect(results.mean).toBeLessThan(3);
    expect(results.min).toBeLessThan(1);
    expect(results.median).toBeLessThan(2);
    expect(results.max).toBeLessThan(46);
  });
});
