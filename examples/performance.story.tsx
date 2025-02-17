import { storiesOf } from "@storybook/react";
import React from "react";
import { RawDraftContentState } from "draft-js";
import markovContentStates from "markov_draftjs";

import { DraftailEditor } from "../src/index";

import EditorBenchmark from "./components/EditorBenchmark";
import { benchmarkProps } from "../tests/performance/MarkovBenchmark";

const contentStates = markovContentStates as RawDraftContentState[];

const NB_EDITORS = 50;
const NB_EDITORS_LOW = 5;
const MAX_EDITORS = contentStates.length;

const header = (
  <p>
    Enable the{" "}
    <a
      className="link"
      href="https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#fps-meter"
    >
      Chrome DevTools FPS meter
    </a>
  </p>
);

storiesOf("Performance", module)
  .add(`markov_draftjs 41`, () => (
    <>
      {header}
      <EditorBenchmark
        componentProps={{
          rawContentState: contentStates[41],
          ...benchmarkProps,
        }}
        runOnMount
      />
      <DraftailEditor rawContentState={contentStates[41]} {...benchmarkProps} />
    </>
  ))
  .add(`markov_draftjs 0-${NB_EDITORS_LOW}`, () => (
    <>
      {header}
      <>
        {contentStates.slice(0, NB_EDITORS_LOW).map((contentState, i) => (
          <DraftailEditor
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            rawContentState={contentState}
            {...benchmarkProps}
          />
        ))}
      </>
    </>
  ))
  .add(`markov_draftjs 0-${NB_EDITORS}`, () => (
    <>
      {header}
      <>
        {contentStates.slice(0, NB_EDITORS).map((contentState, i) => (
          <DraftailEditor
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            rawContentState={contentState}
            {...benchmarkProps}
          />
        ))}
      </>
    </>
  ))
  .add(`markov_draftjs ${MAX_EDITORS - NB_EDITORS_LOW}-${MAX_EDITORS}`, () => (
    <>
      {header}
      <>
        {contentStates.slice(-NB_EDITORS_LOW).map((contentState, i) => (
          <DraftailEditor
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            rawContentState={contentState}
            {...benchmarkProps}
          />
        ))}
      </>
    </>
  ))
  .add(`markov_draftjs ${MAX_EDITORS - NB_EDITORS}-${MAX_EDITORS}`, () => (
    <>
      {header}
      <>
        {contentStates.slice(-NB_EDITORS).map((contentState, i) => (
          <DraftailEditor
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            rawContentState={contentState}
            {...benchmarkProps}
          />
        ))}
      </>
    </>
  ));
