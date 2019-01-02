// @flow
// flow-typed signature: 754639b42acabb56189cf2f613dc9edf
// flow-typed version: <<STUB>>/stats-js_v1.0.0/flow_v0.89.0

declare module "stats-js" {
  declare class Stats {
    showPanel: (1 | 2 | 3 | 4) => void;
    begin: () => void;
    update: () => void;
    domElement: Element;
  }

  declare module.exports: typeof Stats;
}
