import React from "react";
import MarkovBenchmark from "./MarkovBenchmark";

/**
 * markov_draftjs contentstates are sorted by number of blocks, as well as presence of entities / styles.
 * Number 41 features a combination of different block types, styles, and entities which is a good mixture
 * of the editor's capabilities for basic CMS-style integrations.
 */
export default () => <MarkovBenchmark id={41} />;
