import React from "react";
import type { BenchResultsType } from "react-component-benchmark";

type Props = {
  results: BenchResultsType;
};

const BenchmarkResults = ({ results }: Props) => (
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
        <td data-benchmark="mean">{results.mean.toFixed(1)}</td>
        <td data-benchmark="min">{results.min.toFixed(1)}</td>
        <td data-benchmark="median">{results.median.toFixed(1)}</td>
        <td data-benchmark="p70">{results.p70.toFixed(1)}</td>
        <td data-benchmark="p95">{results.p95.toFixed(1)}</td>
        <td data-benchmark="p99">{results.p99.toFixed(1)}</td>
        <td data-benchmark="max">{results.max.toFixed(1)}</td>
        <td data-benchmark="stdDev">{results.stdDev.toFixed(1)}</td>
      </tr>
    </tbody>
  </table>
);

export default BenchmarkResults;
