// @flow
// flow-typed signature: 6d127419277bb968ec9f69563a87bd06
// flow-typed version: <<STUB>>/prismjs_v1.8.4/flow_v0.89.0

declare module "prismjs" {
  declare type Token = {|
    type: string,
    length: number,
  |};

  declare module.exports: {
    tokenize: (text: string, grammar: string) => Array<Token>,
    languages: {},
  };
}
