// @flow

declare module "markov_draftjs" {
  declare type RawContentState = {|
    blocks: $ReadOnlyArray<{}>,
    entityMap: {},
  |};

  declare module.exports: $ReadOnlyArray<RawContentState>;
}
