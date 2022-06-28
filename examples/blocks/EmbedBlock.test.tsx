import React from "react";
import { shallow } from "enzyme";

import { ContentBlock, EditorState } from "draft-js";
import EmbedBlock from "./EmbedBlock";

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
      ),
    ).toMatchSnapshot();
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
      ),
    ).toMatchSnapshot();
  });
});
