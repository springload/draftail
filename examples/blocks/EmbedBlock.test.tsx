import React from "react";
import { shallow } from "enzyme";

import { ContentBlock, EditorState } from "draft-js";
import EmbedBlock from "./EmbedBlock";
import EmbedSource from "../sources/EmbedSource";

describe("EmbedBlock", () => {
  it("renders", () => {
    expect(
      shallow(
        <EmbedBlock
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "test",
              icon: "test",
              type: "test",
              source: EmbedSource,
            },
            editorState: EditorState.createEmpty(),
            entityKey: "string",
            textDirectionality: "RTL",
            lockEditor: () => {},
            unlockEditor: () => {},
            onChange: () => {},
            onEditEntity: () => {},
            onRemoveEntity: () => {},
            entity: {
              getType: () => "type",
              getMutability: () => "MUTABLE",
              getData: () => ({
                url: "http://www.example.com/",
                title: "Test title",
                thumbnail: "http://www.example.com/example.png",
              }),
            },
          }}
        />,
      ).length,
    ).toBe(1);
  });

  it("no data", () => {
    expect(
      shallow(
        <EmbedBlock
          block={new ContentBlock()}
          blockProps={{
            entityType: {
              description: "test",
              icon: "test",
              type: "test",
              source: EmbedSource,
            },
            editorState: EditorState.createEmpty(),
            entityKey: "string",
            textDirectionality: "RTL",
            lockEditor: () => {},
            unlockEditor: () => {},
            onChange: () => {},
            onEditEntity: () => {},
            onRemoveEntity: () => {},
            entity: {
              getType: () => "type",
              getMutability: () => "MUTABLE",
              getData: () => ({}),
            },
          }}
        />,
      ).length,
    ).toBe(1);
  });
});
