// @flow
import React from "react";
import type { Node } from "react";
import Prism from "prismjs";
import type { ContentBlock } from "draft-js";

import { BLOCK_TYPE } from "../../lib";

type Options = {|
  defaultLanguage: "javascript" | "css",
|};

/**
 * Syntax highlighting with Prism as a Draft.js decorator.
 * This code is an adaptation of https://github.com/SamyPesse/draft-js-prism
 * to use the CompositeDecorator strategy API.
 */
class PrismDecorator {
  /* :: options: Options; */
  /* :: highlighted: {}; */
  /* :: component: (props: { children: Node, offsetKey: string }) => Node; */
  /* :: strategy: (block: ContentBlock, (start: number, end: number) => void) => void; */

  constructor(options: Options) {
    this.options = options;
    this.highlighted = {};

    this.component = this.renderToken.bind(this);
    this.strategy = this.getDecorations.bind(this);
  }

  // Renders the decorated tokens.
  renderToken({ children, offsetKey }: { children: Node, offsetKey: string }) {
    const type = this.getTokenTypeForKey(offsetKey);
    return <span className={`token ${type}`}>{children}</span>;
  }

  getTokenTypeForKey(key: string) {
    const [blockKey, tokId] = key.split("-");
    const token = this.highlighted[blockKey][tokId];

    return token ? token.type : "";
  }

  getDecorations(
    block: ContentBlock,
    callback: (start: number, end: number) => void,
  ) {
    // Only process code blocks.
    if (block.getType() !== BLOCK_TYPE.CODE) {
      return;
    }

    const language = block
      .getData()
      .get("language", this.options.defaultLanguage);

    // Allow for no syntax highlighting
    if (language == null) {
      return;
    }

    const blockKey = block.getKey();
    const blockText = block.getText();

    let tokens;

    try {
      tokens = Prism.tokenize(blockText, Prism.languages[language]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return;
    }

    this.highlighted[blockKey] = {};

    let tokenCount = 0;
    tokens.reduce((startOffset, token) => {
      const endOffset = startOffset + token.length;

      if (typeof token !== "string") {
        tokenCount += 1;
        this.highlighted[blockKey][tokenCount] = token;
        callback(startOffset, endOffset);
      }

      return endOffset;
    }, 0);
  }
}

export default PrismDecorator;
