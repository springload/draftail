import React from "react";

export interface BenchResultsType {
  mean: number;
  min: number;
  median: number;
  p70: number;
  p95: number;
  p99: number;
  max: number;
  stdDev: number;
}

const BenchmarkResults = ({ results }: { results: BenchResultsType }) => (
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
